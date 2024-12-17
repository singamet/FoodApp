import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSignUp } from "../hooks/useSignUp";
import ClipLoader from "react-spinners/ClipLoader";
import Toast from "../components/Toast";
import "../styles/Auth.css";

export default function SignUp() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, error, isLoading } = useSignUp();
  const [toast, setToast] = useState({
    message: "",
    isVisible: false,
    isError: false,
  });
  useEffect(() => {
    if (error) {
      setToast({
        message: error,
        isVisible: true,
        isError: true,
      });
    }
  }, [error]);
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    await signup(fullname, email, password);
  };
  return (
    <div className="auth-page">
      <div className="auth-form">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignUpSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            required
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? (
              <ClipLoader
                loading={isLoading}
                size={35}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
        <Link to="/signin">Already have an account? Sign In</Link>
      </div>
      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        isError={toast.isError}
        onClose={() =>
          setToast({ message: "", isVisible: false, isError: false })
        }
      />
    </div>
  );
}
