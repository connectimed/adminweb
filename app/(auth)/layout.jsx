import { Inter } from "next/font/google";
import "../globals.css";
import { AuthContextProvider } from "@/lib/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SkillsBot",
  description: "Trade on Binance like a pro",
};

export default function RootLayout({ children }) {
  return (
    <AuthContextProvider>
      <html lang="en" className={inter.className}>
        <body>
          <main className="h-screen">
            <div className="w-full h-full">{children}</div>
          </main>
        </body>
      </html>
    </AuthContextProvider>
  );
}
