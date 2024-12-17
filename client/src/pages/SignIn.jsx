import { Link } from "react-router-dom";
import "../styles/Auth.css";
import { useEffect, useState } from "react";
import { useSignIn } from "../hooks/useSignIn";
import ClipLoader from "react-spinners/ClipLoader";
import Toast from "../components/Toast";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signin, error, isLoading } = useSignIn();
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
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    await signin(email, password);
  };
  return (
    <div className="auth-page">
      <div className="auth-form">
        <h2>Sign In</h2>
        <form onSubmit={handleSignInSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
              "Sign In"
            )}
          </button>
        </form>
        <Link to="/signup">Don&apos;t have an account? Sign Up</Link>
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
