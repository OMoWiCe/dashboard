import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import AdminToast from "../components/AdminToast";
import type { ToastType } from "../components/AdminToast";

interface ToastContextType {
  showToast: (message: string, type: ToastType, duration?: number) => void;
  showConfirmation: (message: string, onConfirm: () => void) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

interface ToastState {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  showConfirmation?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = (message: string, type: ToastType, duration?: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastState = {
      id,
      message,
      type,
      duration,
    };

    setToasts((prev) => [...prev, newToast]);
  };

  const showConfirmation = (message: string, onConfirm: () => void) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastState = {
      id,
      message,
      type: "confirm",
      showConfirmation: true,
      onConfirm,
      onCancel: () => removeToast(id),
    };

    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, showConfirmation }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <AdminToast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
            onConfirm={toast.onConfirm}
            onCancel={toast.onCancel}
            showConfirmation={toast.showConfirmation}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
