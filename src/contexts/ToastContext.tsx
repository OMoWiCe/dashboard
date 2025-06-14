import React, { createContext, useContext, useState, ReactNode } from "react";
import AdminToast, { ToastType } from "../components/AdminToast";

interface ToastContextProps {
  showToast: (message: string, type: ToastType, duration?: number) => void;
  showConfirmation: (
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

interface ToastState {
  message: string;
  type: ToastType;
  duration?: number;
  visible: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  showConfirmation: boolean;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toast, setToast] = useState<ToastState>({
    message: "",
    type: "info",
    visible: false,
    showConfirmation: false,
  });

  const showToast = (message: string, type: ToastType, duration = 7) => {
    setToast({
      message,
      type,
      duration,
      visible: true,
      showConfirmation: false,
    });
  };

  const showConfirmation = (
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => {
    setToast({
      message,
      type: "confirm",
      visible: true,
      onConfirm,
      onCancel: onCancel || hideToast,
      showConfirmation: true,
    });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast, showConfirmation, hideToast }}>
      {children}
      {toast.visible && (
        <AdminToast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={hideToast}
          onConfirm={toast.onConfirm}
          onCancel={toast.onCancel}
          showConfirmation={toast.showConfirmation}
        />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextProps => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
