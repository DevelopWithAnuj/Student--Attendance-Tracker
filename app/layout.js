import "./globals.css";
import { ThemeProvider } from "app/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "Attendance AI | Institutional Management Console",
  description: "Advanced student attendance tracking and analytics platform for modern educational institutions.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
