import { useState } from "react";
import { sha256 } from "js-sha256";
import "../css/AdminLogin.css";
import { useToast } from "../contexts/ToastContext";

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

const AdminLogin = ({ onLoginSuccess }: AdminLoginProps) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  // Get environment variables
  const getEnvCredentials = () => {
    // @ts-ignore - Vite specific property
    const envUsername = import.meta.env?.VITE_ADMIN_USERNAME || "";
    // @ts-ignore - Vite specific property
    const envPasswordHash = import.meta.env?.VITE_ADMIN_PASSWORD_HASH || "";

    return { envUsername, envPasswordHash };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.password.trim()) {
      showToast("Please enter both username and password", "error");
      return;
    }

    setIsLoading(true);

    try {
      const { envUsername, envPasswordHash } = getEnvCredentials();

      // Hash the entered password
      const enteredPasswordHash = sha256(formData.password);

      // Check credentials
      if (
        formData.username === envUsername &&
        enteredPasswordHash === envPasswordHash
      ) {
        onLoginSuccess();
      } else {
        showToast("Invalid username or password. Please try again.", "error");
      }
    } catch (error) {
      console.error("Login error:", error);
      showToast("An error occurred during login. Please try again.", "error");
    } finally {
      setIsLoading(false);
      // Clear password field for security
      setFormData((prev) => ({ ...prev, password: "" }));
    }
  };

  const handleHintClick = () => {
    showToast(
      "Contact the administrator to get credentials for admin access.",
      "info"
    );
  };

  return (
    <div className="admin-login">
      <div className="admin-login-container">
        <div className="admin-login-header">
          <h1 className="admin-login-title">Admin Login</h1>
        </div>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <i className="fa fa-spinner fa-spin" aria-hidden="true"></i>
                Logging in...
              </>
            ) : (
              <>
                <i className="fa fa-sign-in" aria-hidden="true"></i>
                Login
              </>
            )}
          </button>

          <div className="login-hint">
            <button
              type="button"
              className="hint-btn"
              onClick={handleHintClick}
            >
              <i className="fa fa-info-circle" aria-hidden="true"></i>
              Hint
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
