import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCartData } from "@/redux/Cart/cartSlice";
import axios from "axios";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.data);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.sub);
      } catch (error) {
        console.error("Gagal mendecode token:", error);
        handleLogout(); // Logout otomatis jika token tidak valid
      }
    } else {
      setIsAuthenticated(false);
    }
  }, [router]);

  useEffect(() => {
    if (userId) {
      fetchUserData(userId);
    }
  }, [userId]);

  const fetchUserData = async (user) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`http://localhost:8080/api/customer/id/${user}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        setUserData(response.data);
        localStorage.setItem("userData", JSON.stringify(response.data)); // Simpan userData ke localStorage
      }
    } catch (error) {
      console.error("Gagal fetching data user:", error);
    }
  };

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    dispatch(setCartData(savedCart));
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    localStorage.removeItem("cart");
    localStorage.removeItem("userData");
    setIsAuthenticated(false);
    setUserData(null);
    router.push("/login");
  };

  return (
    <nav className="bg-green-500 p-4 flex justify-between items-center text-white">
      <h1 className="text-xl font-bold">DrinkEase</h1>
      <div className="flex gap-6">
        <Link href="/product" className="hover:text-gray-900">
          Product
        </Link>
        <Link href="/profile" className="hover:text-gray-900">
          Profile
        </Link>
        <Link href="/orders" className="hover:text-gray-900">
          Orders
        </Link>
        {userData?.role === "ADMIN" && (
          <Link href="/admin/dashboard" className="hover:text-gray-900">
            Dashboard
          </Link>
        )}
      </div>
      <div className="flex items-center gap-4">
        {userData && <span className="font-semibold">Hi, {userData.username}!</span>}
        <Link href="/cart" className="relative text-4xl">
          🛒
          {Array.isArray(cart) && cart.length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">{cart.reduce((total, item) => total + (item.qty || 0), 0)}</span>}
        </Link>
        {isAuthenticated ? (
          <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">
            Logout
          </button>
        ) : (
          <Link href="/login" className="bg-blue-500 px-4 py-2 rounded">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
