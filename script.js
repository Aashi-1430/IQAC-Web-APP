/* =========================================================
   SVIET IQAC FRONTEND
   Authentication + JWT + Role Based Access
   ========================================================= */


/* =========================================================
   API CONFIGURATION
   ========================================================= */

const API_BASE_URL =
    "https://fms-backend-ybbn.onrender.com";

const LOGIN_API =
    `${API_BASE_URL}/auth/login`;

const SIGNUP_API =
    `${API_BASE_URL}/auth/signup`;


/*
 * IMPORTANT
 *
 * credentials: "include" is enabled because your backend
 * may store JWT in an HTTP-only cookie.
 *
 * If your backend returns the JWT in JSON, we also support
 * that automatically.
 */


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const authPage =
    document.getElementById("authPage");

const loginSection =
    document.getElementById("loginSection");

const signupSection =
    document.getElementById("signupSection");

const loginTab =
    document.getElementById("loginTab");

const signupTab =
    document.getElementById("signupTab");

const iqacDashboard =
    document.getElementById("iqacDashboard");

const hodDashboard =
    document.getElementById("hodDashboard");

const loginForm =
    document.getElementById("loginForm");

const signupForm =
    document.getElementById("signupForm");

const loginButton =
    document.getElementById("loginButton");

const signupButton =
    document.getElementById("signupButton");

const loginMessage =
    document.getElementById("loginMessage");

const signupMessage =
    document.getElementById("signupMessage");


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log(
        "SVIET IQAC Authentication initialized."
    );

    checkExistingSession();

});


/* =========================================================
   LOGIN / SIGNUP SWITCH
   ========================================================= */

function showLogin() {

    if (loginSection) {
        loginSection.classList.remove("hidden");
    }

    if (signupSection) {
        signupSection.classList.add("hidden");
    }

    if (loginTab) {
        loginTab.classList.add("active");
    }

    if (signupTab) {
        signupTab.classList.remove("active");
    }

    clearMessages();

}


function showSignup() {

    if (loginSection) {
        loginSection.classList.add("hidden");
    }

    if (signupSection) {
        signupSection.classList.remove("hidden");
    }

    if (loginTab) {
        loginTab.classList.remove("active");
    }

    if (signupTab) {
        signupTab.classList.add("active");
    }

    clearMessages();

}


/* =========================================================
   MESSAGE HANDLING
   ========================================================= */

function showMessage(
    element,
    message,
    type
) {

    if (!element) {
        return;
    }

    element.textContent = message;

    element.className =
        `message ${type}`;

}


function clearMessages() {

    if (loginMessage) {

        loginMessage.textContent = "";

        loginMessage.className =
            "message hidden";

    }

    if (signupMessage) {

        signupMessage.textContent = "";

        signupMessage.className =
            "message hidden";

    }

}


/* =========================================================
   PASSWORD VISIBILITY
   ========================================================= */

function togglePassword(
    inputId,
    button
) {

    const input =
        document.getElementById(inputId);

    if (!input) {
        return;
    }


    if (input.type === "password") {

        input.type = "text";

        if (button) {
            button.textContent = "Hide";
        }

    } else {

        input.type = "password";

        if (button) {
            button.textContent = "Show";
        }

    }

}


/* =========================================================
   LOGIN
   ========================================================= */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            clearMessages();


            const email =
                document.getElementById(
                    "loginEmail"
                ).value.trim();


            const password =
                document.getElementById(
                    "loginPassword"
                ).value;


            /* ---------------------------------------------
               BASIC VALIDATION
            --------------------------------------------- */

            if (!email || !password) {

                showMessage(
                    loginMessage,
                    "Please enter your email and password.",
                    "error"
                );

                return;

            }


            setButtonLoading(
                loginButton,
                true,
                "Logging in..."
            );


            try {

                console.log(
                    "Attempting login for:",
                    email
                );


                /* -----------------------------------------
                   SEND LOGIN REQUEST
                ----------------------------------------- */

                const response =
                    await fetch(
                        LOGIN_API,
                        {
                            method: "POST",

                            credentials: "include",

                            headers: {
                                "accept":
                                    "application/json",

                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                email: email,
                                password: password
                            })
                        }
                    );


                console.log(
                    "Login HTTP status:",
                    response.status
                );


                /* -----------------------------------------
                   READ RESPONSE
                ----------------------------------------- */

                const data =
                    await parseResponse(response);


                console.log(
                    "FULL LOGIN RESPONSE:",
                    data
                );


                /* -----------------------------------------
                   HANDLE HTTP ERRORS
                ----------------------------------------- */

                if (!response.ok) {

                    const errorMessage =
                        extractErrorMessage(data);


                    /*
                     * Special handling for inactive accounts.
                     */

                    if (
                        isInactiveAccountError(
                            errorMessage
                        )
                    ) {

                        throw new Error(
                            "Your account is waiting for approval from the IQAC Coordinator. You will be able to login after your account is approved."
                        );

                    }


                    throw new Error(
                        errorMessage
                    );

                }


                /* -----------------------------------------
                   EXTRACT TOKEN
                ----------------------------------------- */

                const token =
                    extractToken(data);


                /* -----------------------------------------
                   EXTRACT USER
                ----------------------------------------- */

                const user =
                    extractUser(data);


                console.log(
                    "Extracted JWT:",
                    token
                        ? "Token found"
                        : "No token in JSON response"
                );


                console.log(
                    "Extracted user:",
                    user
                );


                /* -----------------------------------------
                   DETERMINE ROLE
                ----------------------------------------- */

                let role =
                    user?.role ||
                    data?.role ||
                    data?.user_role ||
                    data?.data?.role ||
                    data?.data?.user_role ||
                    data?.result?.role;


                /*
                 * If role was not directly returned,
                 * try reading it from JWT.
                 */

                if (
                    !role &&
                    token
                ) {

                    role =
                        getRoleFromToken(
                            token
                        );

                }


                console.log(
                    "Detected role:",
                    role
                );


                /* -----------------------------------------
                   SAVE JWT IF AVAILABLE
                ----------------------------------------- */

                if (token) {

                    localStorage.setItem(
                        "iqac_token",
                        token
                    );

                }


                /* -----------------------------------------
                   SAVE USER IF AVAILABLE
                ----------------------------------------- */

                if (user) {

                    localStorage.setItem(
                        "iqac_user",
                        JSON.stringify(user)
                    );

                }


                /* -----------------------------------------
                   IMPORTANT
                   
                   DO NOT require a JSON JWT here.

                   If backend uses an HTTP-only cookie,
                   the browser will already have the JWT.
                ----------------------------------------- */

                if (!role) {

                    /*
                     * We have a successful HTTP response,
                     * but cannot determine the role.
                     */

                    console.error(
                        "Login succeeded, but role could not be determined."
                    );

                    console.error(
                        "Backend response:",
                        data
                    );


                    throw new Error(
                        "Login was successful, but the server did not provide the user's role. Please check the login API response."
                    );

                }


                /* -----------------------------------------
                   NORMALIZE ROLE
                ----------------------------------------- */

                role =
                    normalizeRole(role);


                /* -----------------------------------------
                   ROUTE USER
                ----------------------------------------- */

                routeUserByRole(
                    role,
                    user
                );

            }

            catch (error) {

                console.error(
                    "LOGIN ERROR:",
                    error
                );


                showMessage(
                    loginMessage,

                    error.message ||
                    "Unable to login. Please try again.",

                    "error"
                );

            }

            finally {

                setButtonLoading(
                    loginButton,
                    false,
                    "Login"
                );

            }

        }
    );

}


/* =========================================================
   SIGNUP
   ========================================================= */

if (signupForm) {

    signupForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            clearMessages();


            const name =
                document.getElementById(
                    "signupName"
                ).value.trim();


            const email =
                document.getElementById(
                    "signupEmail"
                ).value.trim();


            const password =
                document.getElementById(
                    "signupPassword"
                ).value;


            const confirmPassword =
                document.getElementById(
                    "confirmPassword"
                ).value;


            /* ---------------------------------------------
               VALIDATION
            --------------------------------------------- */

            if (!name) {

                showMessage(
                    signupMessage,
                    "Please enter your full name.",
                    "error"
                );

                return;

            }


            if (!email) {

                showMessage(
                    signupMessage,
                    "Please enter your email address.",
                    "error"
                );

                return;

            }


            if (password.length < 6) {

                showMessage(
                    signupMessage,
                    "Password must contain at least 6 characters.",
                    "error"
                );

                return;

            }


            if (
                password !==
                confirmPassword
            ) {

                showMessage(
                    signupMessage,
                    "Passwords do not match.",
                    "error"
                );

                return;

            }


            setButtonLoading(
                signupButton,
                true,
                "Creating Account..."
            );


            try {

                console.log(
                    "Creating account for:",
                    email
                );


                /* -----------------------------------------
                   SIGNUP REQUEST
                ----------------------------------------- */

                const response =
                    await fetch(
                        SIGNUP_API,
                        {
                            method: "POST",

                            credentials: "include",

                            headers: {
                                "accept":
                                    "application/json",

                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                name: name,

                                email: email,

                                password: password

                            })
                        }
                    );


                const data =
                    await parseResponse(
                        response
                    );


                console.log(
                    "SIGNUP RESPONSE:",
                    data
                );


                if (!response.ok) {

                    throw new Error(
                        extractErrorMessage(data)
                    );

                }


                /* -----------------------------------------
                   SUCCESS
                ----------------------------------------- */

                showMessage(
                    signupMessage,

                    "Registration successful! Your account is awaiting approval from the IQAC Coordinator. You will be able to login once your account is approved.",

                    "success"
                );


                signupForm.reset();


                /*
                 * Switch to login after 3 seconds.
                 */

                setTimeout(
                    () => {

                        showLogin();

                        const emailInput =
                            document.getElementById(
                                "loginEmail"
                            );

                        if (emailInput) {

                            emailInput.value =
                                email;

                        }

                    },
                    3000
                );

            }

            catch (error) {

                console.error(
                    "SIGNUP ERROR:",
                    error
                );


                showMessage(
                    signupMessage,

                    error.message ||
                    "Unable to create account. Please try again.",

                    "error"
                );

            }

            finally {

                setButtonLoading(
                    signupButton,
                    false,
                    "Create Account"
                );

            }

        }
    );

}


/* =========================================================
   PARSE API RESPONSE
   ========================================================= */

async function parseResponse(
    response
) {

    const contentType =
        response.headers.get(
            "content-type"
        ) || "";


    /*
     * JSON response
     */

    if (
        contentType.includes(
            "application/json"
        )
    ) {

        try {

            return await response.json();

        }

        catch (error) {

            console.error(
                "JSON parsing error:",
                error
            );

            return {};

        }

    }


    /*
     * Plain text response
     */

    const text =
        await response.text();


    return {
        detail: text
    };

}


/* =========================================================
   ERROR MESSAGE EXTRACTION
   ========================================================= */

function extractErrorMessage(
    data
) {

    if (!data) {

        return "Something went wrong.";

    }


    /* ---------------------------------------------
       FastAPI:
       { "detail": "Invalid credentials" }
    --------------------------------------------- */

    if (
        typeof data.detail ===
        "string"
    ) {

        return data.detail;

    }


    /* ---------------------------------------------
       FastAPI validation errors
    --------------------------------------------- */

    if (
        Array.isArray(
            data.detail
        )
    ) {

        return data.detail
            .map(
                error => {

                    if (
                        typeof error ===
                        "string"
                    ) {

                        return error;

                    }

                    return (
                        error.msg ||
                        error.message ||
                        "Invalid input"
                    );

                }
            )
            .join(", ");

    }


    /* ---------------------------------------------
       message
    --------------------------------------------- */

    if (
        typeof data.message ===
        "string"
    ) {

        return data.message;

    }


    /* ---------------------------------------------
       error
    --------------------------------------------- */

    if (
        typeof data.error ===
        "string"
    ) {

        return data.error;

    }


    /* ---------------------------------------------
       nested data.message
    --------------------------------------------- */

    if (
        data.data &&
        typeof data.data.message ===
        "string"
    ) {

        return data.data.message;

    }


    /* ---------------------------------------------
       nested data.detail
    --------------------------------------------- */

    if (
        data.data &&
        typeof data.data.detail ===
        "string"
    ) {

        return data.data.detail;

    }


    return "Unable to complete the request.";

}


/* =========================================================
   CHECK INACTIVE ACCOUNT ERROR
   ========================================================= */

function isInactiveAccountError(
    message
) {

    if (!message) {

        return false;

    }


    const text =
        message.toLowerCase();


    const inactiveKeywords = [

        "inactive",

        "not active",

        "account is inactive",

        "pending",

        "approval",

        "not approved",

        "awaiting approval",

        "disabled",

        "deactivated"

    ];


    return inactiveKeywords.some(
        keyword =>
            text.includes(keyword)
    );

}


/* =========================================================
   EXTRACT JWT TOKEN
   ========================================================= */

function extractToken(
    data
) {

    if (!data) {

        return null;

    }


    /*
     * ------------------------------------------
     * Direct token
     * ------------------------------------------
     */

    if (
        typeof data.access_token ===
        "string"
    ) {

        return data.access_token;

    }


    if (
        typeof data.accessToken ===
        "string"
    ) {

        return data.accessToken;

    }


    if (
        typeof data.token ===
        "string"
    ) {

        return data.token;

    }


    if (
        typeof data.jwt ===
        "string"
    ) {

        return data.jwt;

    }


    /*
     * ------------------------------------------
     * Nested inside data
     * ------------------------------------------
     */

    if (data.data) {

        if (
            typeof data.data.access_token ===
            "string"
        ) {

            return data.data.access_token;

        }


        if (
            typeof data.data.accessToken ===
            "string"
        ) {

            return data.data.accessToken;

        }


        if (
            typeof data.data.token ===
            "string"
        ) {

            return data.data.token;

        }


        if (
            typeof data.data.jwt ===
            "string"
        ) {

            return data.data.jwt;

        }

    }


    /*
     * ------------------------------------------
     * Nested inside result
     * ------------------------------------------
     */

    if (data.result) {

        if (
            typeof data.result.access_token ===
            "string"
        ) {

            return data.result.access_token;

        }


        if (
            typeof data.result.token ===
            "string"
        ) {

            return data.result.token;

        }

    }


    /*
     * ------------------------------------------
     * Nested inside auth
     * ------------------------------------------
     */

    if (data.auth) {

        if (
            typeof data.auth.access_token ===
            "string"
        ) {

            return data.auth.access_token;

        }


        if (
            typeof data.auth.token ===
            "string"
        ) {

            return data.auth.token;

        }

    }


    return null;

}


/* =========================================================
   EXTRACT USER
   ========================================================= */

function extractUser(
    data
) {

    if (!data) {

        return null;

    }


    /*
     * Direct user
     */

    if (
        data.user &&
        typeof data.user ===
        "object"
    ) {

        return data.user;

    }


    /*
     * data.user
     */

    if (
        data.data &&
        data.data.user &&
        typeof data.data.user ===
        "object"
    ) {

        return data.data.user;

    }


    /*
     * result.user
     */

    if (
        data.result &&
        data.result.user &&
        typeof data.result.user ===
        "object"
    ) {

        return data.result.user;

    }


    /*
     * auth.user
     */

    if (
        data.auth &&
        data.auth.user &&
        typeof data.auth.user ===
        "object"
    ) {

        return data.auth.user;

    }


    /*
     * User directly inside response
     */

    if (
        data.role ||
        data.email ||
        data.name
    ) {

        return data;

    }


    /*
     * User directly inside data
     */

    if (
        data.data &&
        (
            data.data.role ||
            data.data.email ||
            data.data.name
        )
    ) {

        return data.data;

    }


    /*
     * User directly inside result
     */

    if (
        data.result &&
        (
            data.result.role ||
            data.result.email ||
            data.result.name
        )
    ) {

        return data.result;

    }


    return null;

}


/* =========================================================
   NORMALIZE ROLE
   ========================================================= */

function normalizeRole(
    role
) {

    if (!role) {

        return null;

    }


    return String(role)
        .trim()
        .toLowerCase()
        .replace(/[\s-]+/g, "_");

}


/* =========================================================
   READ ROLE FROM JWT
   ========================================================= */

function getRoleFromToken(
    token
) {

    try {

        if (!token) {

            return null;

        }


        const parts =
            token.split(".");


        if (
            parts.length !== 3
        ) {

            console.warn(
                "JWT does not appear to have 3 parts."
            );

            return null;

        }


        /*
         * JWT payload is Base64URL encoded.
         */

        let payload =
            parts[1]
                .replace(/-/g, "+")
                .replace(/_/g, "/");


        /*
         * Add Base64 padding.
         */

        while (
            payload.length % 4 !== 0
        ) {

            payload += "=";

        }


        const decodedPayload =
            atob(payload);


        const bytes =
            decodedPayload
                .split("")
                .map(
                    character =>
                        "%" +
                        (
                            "00" +
                            character
                                .charCodeAt(0)
                                .toString(16)
                        ).slice(-2)
                )
                .join("");


        const payloadObject =
            JSON.parse(
                decodeURIComponent(
                    bytes
                )
            );


        console.log(
            "JWT payload:",
            payloadObject
        );


        return (
            payloadObject.role ||
            payloadObject.user_role ||
            payloadObject.userRole ||
            null
        );

    }

    catch (error) {

        console.error(
            "JWT decoding failed:",
            error
        );

        return null;

    }

}


/* =========================================================
   ROLE BASED ROUTING
   ========================================================= */

function routeUserByRole(
    role,
    user = null
) {

    role =
        normalizeRole(role);


    console.log(
        "Routing authenticated user.",
        {
            role: role,
            user: user
        }
    );


    /* ---------------------------------------------
       IQAC COORDINATOR = ADMIN
    --------------------------------------------- */

    if (
        role ===
        "iqac_coordinator"
    ) {

        showIQACDashboard(
            user
        );

        return;

    }


    /* ---------------------------------------------
       HOD = USER
    --------------------------------------------- */

    if (
        role === "hod"
    ) {

        showHODDashboard(
            user
        );

        return;

    }


    /* ---------------------------------------------
       UNKNOWN ROLE
    --------------------------------------------- */

    console.error(
        "Unknown user role:",
        role
    );


    logout();


    showLogin();


    showMessage(
        loginMessage,

        "Your account has an unsupported role. Please contact the IQAC Coordinator.",

        "error"
    );

}


/* =========================================================
   SHOW IQAC COORDINATOR DASHBOARD
   ========================================================= */

function showIQACDashboard(
    user
) {

    /*
     * Hide authentication
     */

    if (authPage) {

        authPage.classList.add(
            "hidden"
        );

    }


    /*
     * Hide HOD dashboard
     */

    if (hodDashboard) {

        hodDashboard.classList.add(
            "hidden"
        );

    }


    /*
     * Show IQAC dashboard
     */

    if (iqacDashboard) {

        iqacDashboard.classList.remove(
            "hidden"
        );

    }


    const name =
        user?.name ||
        "IQAC Coordinator";


    const nameElement =
        document.getElementById(
            "iqacUserName"
        );


    if (nameElement) {

        nameElement.textContent =
            name;

    }


    const avatar =
        document.getElementById(
            "iqacAvatar"
        );


    if (avatar) {

        avatar.textContent =
            getInitial(name);

    }


    /*
     * Update browser URL without
     * reloading the page.
     */

    setApplicationPath(
        "/iqac-coordinator/dashboard"
    );

}


/* =========================================================
   SHOW HOD DASHBOARD
   ========================================================= */

function showHODDashboard(
    user
) {

    /*
     * Hide authentication
     */

    if (authPage) {

        authPage.classList.add(
            "hidden"
        );

    }


    /*
     * Hide IQAC dashboard
     */

    if (iqacDashboard) {

        iqacDashboard.classList.add(
            "hidden"
        );

    }


    /*
     * Show HOD dashboard
     */

    if (hodDashboard) {

        hodDashboard.classList.remove(
            "hidden"
        );

    }


    const name =
        user?.name ||
        "HOD";


    const nameElement =
        document.getElementById(
            "hodUserName"
        );


    if (nameElement) {

        nameElement.textContent =
            name;

    }


    const avatar =
        document.getElementById(
            "hodAvatar"
        );


    if (avatar) {

        avatar.textContent =
            getInitial(name);

    }


    /*
     * Update browser URL.
     */

    setApplicationPath(
        "/hod/dashboard"
    );

}


/* =========================================================
   GET USER INITIAL
   ========================================================= */

function getInitial(
    name
) {

    if (!name) {

        return "?";

    }


    return name
        .trim()
        .charAt(0)
        .toUpperCase();

}


/* =========================================================
   CHANGE APPLICATION URL
   ========================================================= */

function setApplicationPath(
    path
) {

    try {

        window.history.replaceState(
            {},
            "",
            path
        );

    }

    catch (error) {

        console.warn(
            "Unable to change URL:",
            error
        );

    }

}


/* =========================================================
   LOGOUT
   ========================================================= */

function logout() {

    console.log(
        "Logging out..."
    );


    /*
     * Remove locally stored JWT.
     */

    localStorage.removeItem(
        "iqac_token"
    );


    /*
     * Remove locally stored user.
     */

    localStorage.removeItem(
        "iqac_user"
    );


    /*
     * Hide dashboards.
     */

    if (iqacDashboard) {

        iqacDashboard.classList.add(
            "hidden"
        );

    }


    if (hodDashboard) {

        hodDashboard.classList.add(
            "hidden"
        );

    }


    /*
     * Show authentication page.
     */

    if (authPage) {

        authPage.classList.remove(
            "hidden"
        );

    }


    /*
     * Show login tab.
     */

    showLogin();


    /*
     * Reset forms.
     */

    if (loginForm) {

        loginForm.reset();

    }


    if (signupForm) {

        signupForm.reset();

    }


    /*
     * Return URL to login page.
     */

    setApplicationPath(
        "/"
    );

}


/* =========================================================
   CHECK EXISTING SESSION
   ========================================================= */

function checkExistingSession() {

    console.log(
        "Checking existing authentication session..."
    );


    /*
     * Check locally stored JWT.
     */

    const token =
        localStorage.getItem(
            "iqac_token"
        );


    /*
     * Check locally stored user.
     */

    const storedUser =
        localStorage.getItem(
            "iqac_user"
        );


    let user = null;


    if (storedUser) {

        try {

            user =
                JSON.parse(
                    storedUser
                );

        }

        catch (error) {

            console.warn(
                "Stored user data is invalid.",
                error
            );

            localStorage.removeItem(
                "iqac_user"
            );

        }

    }


    /*
     * Get role from stored user.
     */

    let role =
        user?.role;


    /*
     * If role isn't available,
     * try reading it from JWT.
     */

    if (
        !role &&
        token
    ) {

        role =
            getRoleFromToken(
                token
            );

    }


    /*
     * If both are available,
     * route immediately.
     */

    if (role) {

        console.log(
            "Existing session detected.",
            {
                role: role
            }
        );


        routeUserByRole(
            role,
            user
        );


        return;

    }


    /*
     * No usable local session.
     */

    console.log(
        "No local authenticated session found."
    );


    showLogin();

}


/* =========================================================
   BUTTON LOADING STATE
   ========================================================= */

function setButtonLoading(
    button,
    loading,
    text
) {

    if (!button) {

        return;

    }


    if (loading) {

        button.disabled =
            true;


        button.innerHTML = `
            <span class="loading-spinner"></span>
            <span>${text}</span>
        `;

    }

    else {

        button.disabled =
            false;


        button.innerHTML = `
            <span>${text}</span>
            <span class="button-arrow">→</span>
        `;

    }

}


/* =========================================================
   DEBUG HELPER
   =========================================================
   
   You can call this from browser console:
   
       debugAuth()
   
   It will show current authentication
   information.
   ========================================================= */

function debugAuth() {

    const token =
        localStorage.getItem(
            "iqac_token"
        );


    const user =
        localStorage.getItem(
            "iqac_user"
        );


    console.log(
        "========== SVIET IQAC AUTH DEBUG =========="
    );


    console.log(
        "Stored Token:",
        token
            ? "YES"
            : "NO"
    );


    console.log(
        "Stored User:",
        user
            ? JSON.parse(user)
            : null
    );


    if (token) {

        console.log(
            "JWT Role:",
            getRoleFromToken(
                token
            )
        );

    }


    console.log(
        "==========================================="
    );

}