"use client";
import "../assets/css/globals.css";
import { Inter } from "next/font/google";
import Providers from "@/provider/providers";
import "simplebar-react/dist/simplebar.min.css";
import "flatpickr/dist/themes/light.css";
import DirectionProvider from "@/provider/direction.provider";
import store from "@/lib/store";
import { Provider } from "react-redux";
import AuthCheckProvider from "@/provider/AuthCheckProvider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children, params: { lang } }) {

  return (
    <html lang={lang}>
      <Provider store={store}>
        <Providers>
          <AuthCheckProvider>
            <DirectionProvider lang={lang}>{children}</DirectionProvider>
          </AuthCheckProvider>
        </Providers>
      </Provider>
    </html>
  );
}
