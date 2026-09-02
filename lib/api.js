/* =========================================================
   SVIET IQAC — API HELPERS
   Ported from the original vanilla-JS script.js
   ========================================================= */

export const API_BASE_URL = "https://fms-backend-ybbn.onrender.com";

export const LOGIN_API = `${API_BASE_URL}/auth/login`;
export const SIGNUP_API = `${API_BASE_URL}/auth/signup`;
export const USER_ME_API = `${API_BASE_URL}/users/me`;
export const CHANGE_PASSWORD_API = `${API_BASE_URL}/auth/change-password`;

/* =========================================================
   PARSE API RESPONSE
   ========================================================= */
export async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch (error) {
      console.error("JSON parsing error:", error);
      return {};
    }
  }

  const text = await response.text();
  return { detail: text };
}

/* =========================================================
   ERROR MESSAGE EXTRACTION
   ========================================================= */
export function extractErrorMessage(data) {
  if (!data) {
    return "Something went wrong.";
  }

  // FastAPI: { "detail": "Invalid credentials" }
  if (typeof data.detail === "string") {
    return data.detail;
  }

  // FastAPI validation errors
  if (Array.isArray(data.detail)) {
    return data.detail
      .map((error) => {
        if (typeof error === "string") {
          return error;
        }
        return error.msg || error.message || "Invalid input";
      })
      .join(", ");
  }

  if (typeof data.message === "string") {
    return data.message;
  }

  if (typeof data.error === "string") {
    return data.error;
  }

  if (data.data && typeof data.data.message === "string") {
    return data.data.message;
  }

  if (data.data && typeof data.data.detail === "string") {
    return data.data.detail;
  }

  return "Unable to complete the request.";
}

/* =========================================================
   CHECK INACTIVE ACCOUNT ERROR
   ========================================================= */
export function isInactiveAccountError(message) {
  if (!message) {
    return false;
  }

  const text = message.toLowerCase();

  const inactiveKeywords = [
    "inactive",
    "not active",
    "account is inactive",
    "pending",
    "approval",
    "not approved",
    "awaiting approval",
    "disabled",
    "deactivated",
  ];

  return inactiveKeywords.some((keyword) => text.includes(keyword));
}

/* =========================================================
   EXTRACT JWT TOKEN
   ========================================================= */
export function extractToken(data) {
  if (!data) {
    return null;
  }

  if (typeof data.access_token === "string") return data.access_token;
  if (typeof data.accessToken === "string") return data.accessToken;
  if (typeof data.token === "string") return data.token;
  if (typeof data.jwt === "string") return data.jwt;

  if (data.data) {
    if (typeof data.data.access_token === "string") return data.data.access_token;
    if (typeof data.data.accessToken === "string") return data.data.accessToken;
    if (typeof data.data.token === "string") return data.data.token;
    if (typeof data.data.jwt === "string") return data.data.jwt;
  }

  if (data.result) {
    if (typeof data.result.access_token === "string") return data.result.access_token;
    if (typeof data.result.token === "string") return data.result.token;
  }

  if (data.auth) {
    if (typeof data.auth.access_token === "string") return data.auth.access_token;
    if (typeof data.auth.token === "string") return data.auth.token;
  }

  return null;
}

/* =========================================================
   EXTRACT USER
   ========================================================= */
export function extractUser(data) {
  if (!data) {
    return null;
  }

  if (data.user && typeof data.user === "object") return data.user;
  if (data.data && data.data.user && typeof data.data.user === "object") return data.data.user;
  if (data.result && data.result.user && typeof data.result.user === "object") return data.result.user;
  if (data.auth && data.auth.user && typeof data.auth.user === "object") return data.auth.user;

  if (data.role || data.email || data.name) return data;

  if (data.data && (data.data.role || data.data.email || data.data.name)) return data.data;
  if (data.result && (data.result.role || data.result.email || data.result.name)) return data.result;

  return null;
}

/* =========================================================
   NORMALIZE ROLE
   ========================================================= */
export function normalizeRole(role) {
  if (!role) {
    return null;
  }
  return String(role).trim().toLowerCase().replace(/[\s-]+/g, "_");
}

/* =========================================================
   READ ROLE FROM JWT
   ========================================================= */
export function getRoleFromToken(token) {
  try {
    if (!token) return null;

    const parts = token.split(".");
    if (parts.length !== 3) {
      console.warn("JWT does not appear to have 3 parts.");
      return null;
    }

    let payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (payload.length % 4 !== 0) {
      payload += "=";
    }

    const decodedPayload = atob(payload);
    const bytes = decodedPayload
      .split("")
      .map((character) => "%" + ("00" + character.charCodeAt(0).toString(16)).slice(-2))
      .join("");

    const payloadObject = JSON.parse(decodeURIComponent(bytes));

    return payloadObject.role || payloadObject.user_role || payloadObject.userRole || null;
  } catch (error) {
    console.error("JWT decoding failed:", error);
    return null;
  }
}

/* =========================================================
   GET USER INITIAL
   ========================================================= */
export function getInitial(name) {
  if (!name) return "?";
  return name.trim().charAt(0).toUpperCase();
}

/* =========================================================
   FETCH USER FROM /users/me
   ========================================================= */
export async function fetchUserProfile(token) {
  if (!token) return null;

  try {
    const response = await fetch(USER_ME_API, {
      method: "GET",
      credentials: "include",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      console.error("Failed to fetch user profile:", data);
      return null;
    }

    return data.data || data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

/* =========================================================
   LOGIN
   ========================================================= */
export async function loginRequest(email, password) {
  const response = await fetch(LOGIN_API, {
    method: "POST",
    credentials: "include",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    const errorMessage = extractErrorMessage(data);

    if (isInactiveAccountError(errorMessage)) {
      throw new Error(
        "Your account is waiting for approval from the IQAC Coordinator. You will be able to login after your account is approved."
      );
    }

    throw new Error(errorMessage);
  }

  const token = extractToken(data);
  let user = extractUser(data);

  let role =
    user?.role ||
    data?.role ||
    data?.user_role ||
    data?.data?.role ||
    data?.data?.user_role ||
    data?.result?.role;

  if (!role && token) {
    role = getRoleFromToken(token);
  }

  if (!role) {
    throw new Error(
      "Login was successful, but the server did not provide the user's role. Please check the login API response."
    );
  }

  role = normalizeRole(role);

  return { token, user, role };
}

/* =========================================================
   SIGNUP
   ========================================================= */
export async function signupRequest(name, email, password) {
  const response = await fetch(SIGNUP_API, {
    method: "POST",
    credentials: "include",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(extractErrorMessage(data));
  }

  return data;
}

/* =========================================================
   CHANGE PASSWORD
   ========================================================= */
export async function changePasswordRequest(token, currentPassword, newPassword) {
  const response = await fetch(CHANGE_PASSWORD_API, {
    method: "POST",
    credentials: "include",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    }),
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(extractErrorMessage(data));
  }

  return data;
}
