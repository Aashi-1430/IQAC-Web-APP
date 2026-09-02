import "./globals.css";
import { AuthProvider } from "../lib/AuthContext";

export const metadata = {
  title: "SVIET IQAC",
  description: "SVIET Internal Quality Assurance Cell Portal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <div id="app">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
