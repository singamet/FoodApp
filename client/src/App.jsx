import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import About from "./pages/About";
import FoodDetails from "./pages/FoodDetails";
import NotFound from "./pages/NotFound";
import Dishes from "./pages/Dishes";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { useAuthContext } from "./hooks/useAuthContext";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import Favourites from "./pages/Favourites";
import { useCartContext } from "./hooks/useCartContext";

function App() {
  const { user } = useAuthContext();
  const { cart } = useCartContext();
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="dishes" element={<Dishes />} />
        <Route path="dishes/:id" element={<FoodDetails />} />
        <Route
          path="signin"
          element={!user ? <SignIn /> : <Navigate to="/" />}
        />
        <Route
          path="signup"
          element={!user ? <SignUp /> : <Navigate to="/" />}
        />
        <Route path="cart" element={!user ? <SignIn /> : <Cart />} />
        <Route
          path="favourites"
          element={!user ? <SignIn /> : <Favourites />}
        />
        <Route path="orders" element={!user ? <SignIn /> : <Orders />} />
        <Route
          path="checkout"
          element={
            !user ? (
              <SignIn />
            ) : cart && cart.length > 0 ? (
              <Checkout />
            ) : (
              <Cart />
            )
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
