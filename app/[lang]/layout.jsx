"use client";
import React, { use } from "react";
import "../assets/css/globals.css";
import { Inter } from "next/font/google";
import Providers from "@/provider/providers";
import "simplebar-react/dist/simplebar.min.css";
import "flatpickr/dist/themes/light.css";
import DirectionProvider from "@/provider/direction.provider";
import store from "@/lib/store";
import { Provider } from "react-redux";
import AuthCheckProvider from "@/provider/AuthCheckProvider";
import FaviconProvider from "@/provider/FaviconProvider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children, params }) {
    const { lang } = use(params);
    return (
        <html lang={lang} suppressHydrationWarning>
            <Provider store={store}>
                <Providers>
                    <FaviconProvider>
                        <AuthCheckProvider>
                            <DirectionProvider lang={lang}>
                                {children}
                            </DirectionProvider>
                        </AuthCheckProvider>
                    </FaviconProvider>
                </Providers>
            </Provider>
        </html>
    );
}
