import { Inter, Oleo_Script, Funnel_Display } from "next/font/google";

export const inter = Inter({ subsets: ["latin"] });
export const funnel = Funnel_Display({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const oleo = Oleo_Script({
  subsets: ["latin"],
  weight: ["400"],
});
