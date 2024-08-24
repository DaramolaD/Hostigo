import React, { useState } from "react";
import { AppContext, ToastMessage } from "./AppContext"; // Adjust the import path accordingly
import Toast from "../components/Toast";
import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../api-client";

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [toast, setToast] = useState<ToastMessage | undefined>(undefined);
  // const { isError } = useQuery("validateToken", apiClient.validateToken, {
  //   retry: false,
  // });
  const { isError } = useQuery({
    queryKey: ["validateToken"],
    queryFn: apiClient.validateToken,
    retry: false,
  });
  console.log("Errro", isError);
  
  
  return (
    <AppContext.Provider
      value={{
        showToast: (toastMessage) => {
          setToast(toastMessage);
        },
        isLoggedIn: !isError,
      }}
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(undefined)}
        />
      )}
      {children}
    </AppContext.Provider>
  );
};
