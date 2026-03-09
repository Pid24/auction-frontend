"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

if (typeof window !== "undefined") {
  // Aktifkan mode debug Pusher agar tidak blind test
  Pusher.logToConsole = true;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).Pusher = Pusher;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EchoContext = createContext<any>(null);

export const EchoProvider = ({ children }: { children: ReactNode }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [echoInstance, setEchoInstance] = useState<any>(null);

  useEffect(() => {
    const echo = new Echo({
      broadcaster: "reverb",
      key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
      wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
      wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT ?? 8080),
      wssPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT ?? 8080),
      // Wajib false di local environment agar tidak memaksakan WSS
      forceTLS: false,
      disableStats: true,
      enabledTransports: ["ws", "wss"],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      authorizer: (channel: any) => {
        return {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          authorize: (socketId: string, callback: any) => {
            const token = localStorage.getItem("access_token");
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/broadcasting/auth`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                socket_id: socketId,
                channel_name: channel.name,
              }),
            })
              .then((response) => {
                if (!response.ok) throw new Error("Network response was not ok");
                return response.json();
              })
              .then((data) => callback(false, data))
              .catch((error) => callback(true, error));
          },
        };
      },
    } as any);

    // eslint-disable-next-line
    setEchoInstance(echo);

    return () => {
      echo.disconnect();
    };
  }, []);

  return <EchoContext.Provider value={echoInstance}>{children}</EchoContext.Provider>;
};

export const useEcho = () => useContext(EchoContext);
