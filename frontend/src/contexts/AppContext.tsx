import React from "react";

export type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

type AppContextType = {
  showToast: (toastMessage: ToastMessage) => void;
  isLoggedIn: boolean;
};

export const AppContext = React.createContext<AppContextType | undefined>(undefined)