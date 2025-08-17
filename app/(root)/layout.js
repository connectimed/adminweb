import "../globals.css";
import { Roboto } from "next/font/google";
import Topbar from "@/components/Topbar";
import { AuthContextProvider } from "@/lib/AuthContext";

const roboto = Roboto({ weight: "400", subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "SkillsBot",
  description: "Trade on Binance like a pro",
};

export default function RootLayout({ children }) {
  return (
    <AuthContextProvider>
      <html lang="en" className={roboto.className}>
        <body>
          <Topbar />

          <div className="min-h-screen py-16">{children}</div>
        </body>
      </html>
    </AuthContextProvider>
  );
}
