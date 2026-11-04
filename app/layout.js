import "./globals.css";

export const metadata = {
  title: "Creator Studio | AI Video Creator",
  description: "Create amazing videos with AI. Turn your imagination into reality.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
