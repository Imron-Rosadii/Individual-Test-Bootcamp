import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/atoms/Button"; // Sesuaikan path
import { addToCart, removeFromCart, setCartData, clearCart } from "@/redux/Cart/cartSlice"; // Sesuaikan path
import { useRouter } from "next/router";
import Navbar from "@/components/organism/Navbar";
import { addToCartAPI, deleteFromCartAPI, checkoutCartToAPI } from "@/service/CartService";

const CartPage = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.data); // Mengambil data cart dari Redux store
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  // Tambahkan state showModal untuk mengontrol modal
  const [showModal, setShowModal] = useState(false);

  // Menghitung total harga
  const totalPrice = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.qty, 0);
  }, [cart]);

  // Menyimpan cart ke localStorage saat cart berubah
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart)); // Menyimpan cart ke localStorage
    }
  }, [cart]);

  // Mengambil data cart dari localStorage saat pertama kali aplikasi dimuat
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    dispatch(setCartData(storedCart)); // Meng-update state Redux dengan data dari localStorage
  }, [dispatch]);

  // Menambahkan produk ke cart
  const handleAddToCart = async ({ product }) => {
    console.log("Produk yang diterima:", product);
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("Token tidak ditemukan. Pastikan Anda sudah login.");
      return;
    }

    if (product && product.id) {
      try {
        // Hit API terlebih dahulu
        const response = await addToCartAPI(product, token); // Mengirim data ke server

        // Periksa apakah API memberikan respons yang valid
        if (response.status === 200) {
          console.log("Produk berhasil ditambahkan ke keranjang");

          // Dispatch ke Redux untuk update state
          dispatch(
            addToCart({
              id: product.id, // Gunakan ID dari API
              title: product.title, // Gunakan title dari API
              price: product.price, // Gunakan price dari API
              qty: 1, // Default quantity
              imagePath: product.imagePath, // Ambil imagePath dari produk
            })
          );
        } else {
          console.error("Gagal menambahkan produk ke keranjang.");
        }
      } catch (error) {
        console.error("Gagal menambahkan produk ke keranjang:", error);
      }
    } else {
      console.error("Produk tidak valid:", product);
    }
  };

  // Menghapus produk dari cart
  const handleRemoveFromCart = async (productId) => {
    console.log("Produk yang dihapus = >:", productId);
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("Token tidak ditemukan. Pastikan Anda sudah login.");
      return;
    }

    try {
      // Panggil API untuk menghapus produk dari keranjang
      const response = await deleteFromCartAPI(productId, token);

      if (response.status === 200) {
        console.log("Produk berhasil dihapus dari keranjang");

        // Dispatch action untuk menghapus produk dari Redux
        dispatch(removeFromCart(productId));
      } else {
        console.error("Gagal menghapus produk dari keranjang.");
      }
    } catch (error) {
      console.error("Gagal menghapus produk dari keranjang:", error);
    }
  };

  useEffect(() => {
    // Ambil token dari cookies atau localStorage
    const userToken = localStorage.getItem("token");

    // Jika token tidak ada, arahkan pengguna ke halaman login
    if (!userToken) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    try {
      const storedUserData = localStorage.getItem("userData");
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
      }
    } catch (error) {
      console.error("Error parsing userData dari localStorage:", error);
    }
  }, []);

  // Fungsi untuk menangani checkout
  const handleCheckout = async (userData) => {
    if (!userData) {
      console.error("Data pengguna belum tersedia.");
      return;
    }

    // Pastikan struktur data sesuai dengan kebutuhan backend
    const UserData = {
      id: userData.id,
      name: userData.username, // Menggunakan username sebagai name
      email: userData.email,
    };

    console.log("Data yang dikirim ke backend:", UserData);

    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("Token tidak ditemukan. Pastikan Anda sudah login.");
      return;
    }

    try {
      const responseData = await checkoutCartToAPI(userData, token);

      console.log("Checkout berhasil:", responseData);
      dispatch(clearCart());
    } catch (error) {
      console.error("Gagal checkout:", error.message);
    }
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6 mt-20 mb-96">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        {cart.length === 0 ? (
          <p className="text-gray-500">
            Keranjang belanja kosong.{" "}
            <Link href="/" className="text-blue-500">
              Belanja sekarang!
            </Link>
          </p>
        ) : (
          <div className="space-y-4">
            {cart.map((product) => (
              <div key={product.id} className="flex items-center justify-between border p-4 rounded-lg shadow">
                <div className="flex items-center gap-4">
                  <Image src={`http://localhost:8080/uploads/${product.imagePath}`} alt={product.title} width={60} height={60} className="rounded" />
                  <div>
                    <h2 className="text-lg font-semibold">{product.title}</h2>
                    <p className="text-gray-500">Rp {product.price.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    className="px-3 py-1 bg-gray-300 rounded-full"
                    onClick={() => handleRemoveFromCart(product.id)} // Mengurangi qty atau menghapus produk
                  >
                    -
                  </button>
                  <span className="text-lg font-bold">{product.qty}</span>
                  <button
                    className="px-3 py-1 bg-gray-300 rounded-full"
                    onClick={() => handleAddToCart({ product })} // Menambah qty produk
                  >
                    +
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                    onClick={() => handleRemoveFromCart(product.id)} // Menghapus produk
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
            <div className="text-right mt-6">
              <h2 className="text-2xl font-semibold">Total: Rp {totalPrice.toLocaleString()}</h2>
              <Button buttonClassname="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg" onClick={() => handleCheckout(userData)}>
                Checkout
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Checkout */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold">Checkout Successful</h2>
            <p className="mt-4 text-gray-500">Your order has been placed successfully!</p>
            <div className="mt-6 flex justify-end">
              <Button
                buttonClassname="px-6 py-2 bg-blue-500 text-white rounded-lg"
                onClick={closeModal} // Menutup modal
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartPage;
