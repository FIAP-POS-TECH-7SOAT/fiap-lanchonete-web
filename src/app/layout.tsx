"use client"
import { Hooks } from "@/hooks";
import "./globals.css";

import { NextUIProvider } from "@nextui-org/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <NextUIProvider>
        <Hooks>        
          <body className={`dark text-foreground bg-background min-h-screen flex flex-col`}>
          <div className="flex-grow">
            {children}
          </div>
          </body>
        </Hooks>
      </NextUIProvider>
    </html>
  );
}
