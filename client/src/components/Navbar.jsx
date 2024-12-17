import { Link, NavLink } from "react-router-dom";
import { useSignOut } from "../hooks/useSignOut";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCartContext } from "../hooks/useCartContext";
import "../styles/Navbar.css";
import { useState, useEffect } from "react";
import Toast from "./Toast";
import ClipLoader from "react-spinners/ClipLoader";

const Navbar = () => {
  const { signout, isLoading, error } = useSignOut();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user } = useAuthContext();
  const { cart } = useCartContext();
  const [toast, setToast] = useState({
    message: "",
    isVisible: false,
    isError: false,
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1100) {
        setIsMenuOpen(false);
        setIsUserMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSignOut = async () => {
    const json = await signout();
    if (json.success) {
      setToast({
        message: json.message,
        isVisible: true,
        isError: false,
      });
    } else {
      setToast({
        message: error,
        isVisible: true,
        isError: true,
      });
    }
  };

  const handleToggleMenu = () => {
    setIsUserMenuOpen(false);
    setIsMenuOpen(!isMenuOpen);
  };

  const handleToggleUserMenu = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <>
      <nav className="navbar">
        <Link className="logo" to="/">
          <img src="../images/LogoPic.png" alt="Food App Logo" />
          <h1>Food App</h1>
        </Link>
        <div className={`menu ${isMenuOpen ? "open" : ""}`}>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Home
          </NavLink>
          <NavLink
            to="dishes"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Dishes
          </NavLink>
          <NavLink
            to="orders"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Orders
          </NavLink>
          <NavLink
            to="contact"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Contact
          </NavLink>
          <NavLink
            to="about"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            About
          </NavLink>
        </div>
        <div className={`user-menu ${isUserMenuOpen ? "open" : ""}`}>
          <Link to="dishes">
            <i className="material-symbols-outlined">search</i>
          </Link>
          <NavLink
            to="favourites"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <i className="material-symbols-outlined">favorite</i>
          </NavLink>
          <NavLink
            to="cart"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <i className="material-symbols-outlined">shopping_cart</i>
            <span>{user ? cart && cart.length : ""}</span>
          </NavLink>
          {user ? (
            <button className="nav-button" onClick={handleSignOut}>
              {isLoading ? (
                <ClipLoader
                  loading={isLoading}
                  size={25}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              ) : (
                <div className="sign-out">
                  <h5>Sign Out</h5>
                  <i className="material-symbols-outlined">logout</i>
                </div>
              )}
            </button>
          ) : (
            <Link className="nav-button" to="/signin">
              Sign In
            </Link>
          )}
        </div>
        <div className="nav-icons">
          <button onClick={handleToggleMenu}>
            <i className="material-symbols-outlined">menu</i>
          </button>
          <button onClick={handleToggleUserMenu}>
            <i className="material-symbols-outlined">account_circle</i>
          </button>
        </div>
      </nav>
      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        isError={toast.isError}
        onClose={() =>
          setToast({ message: "", isVisible: false, isError: false })
        }
      />
    </>
  );
};

export default Navbar;
