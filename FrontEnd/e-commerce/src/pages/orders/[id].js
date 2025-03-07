import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/organism/Navbar";
import { getCurrentUser } from "@/service/auth";

const OrderDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("token");
      if (!token) {
        alert("Anda harus login terlebih dahulu");
        router.push("/login");
        return;
      }
      setIsAuthenticated(true);
      const sessionUser = getCurrentUser(token);
      setUser(sessionUser);
    }
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchOrderDetail = async () => {
      setLoading(true);
      setError("");
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          setError("Token tidak ditemukan.");
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:8080/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Gagal mengambil data pesanan.");

        const data = await response.json();
        setOrder(data);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };

    fetchOrderDetail();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-red-500">{error}</p>
      </div>
    );

  if (!order)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-red-500">Order tidak ditemukan</p>
      </div>
    );

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Detail Pesanan</h1>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="mb-4">
            <p className="text-lg">
              <strong>ID Pesanan:</strong> {order.orderId}
            </p>
            <p className="text-lg">
              <strong>Total Harga:</strong> Rp {order.totalPrice.toLocaleString()}
            </p>
            <p className="text-lg flex items-center">
              <strong>Status:</strong>
              <span className={`ml-2 px-3 py-1 text-sm font-semibold rounded-full ${order.status === "PENDING" ? "bg-yellow-200 text-yellow-700" : order.status === "COMPLETED" ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"}`}>
                {order.orderHistory?.[0]?.status || order.status}
              </span>
            </p>
            <p className="text-lg">
              <strong>Waktu Pembuatan:</strong> {new Date(order.createdAt).toLocaleString()}
            </p>
            <p className="text-lg">
              <strong>Terakhir Diperbarui:</strong> {new Date(order.orderHistory?.[0]?.updatedAt || order.createdAt).toLocaleString()}
            </p>
          </div>

          <h2 className="text-xl font-semibold mt-6 mb-2">Produk:</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Nama Produk</th>
                <th className="border p-2 text-center">Qty</th>
                <th className="border p-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.productId}>
                  <td className="border p-2">{item.productName}</td>
                  <td className="border p-2 text-center">{item.quantity}</td>
                  <td className="border p-2 text-right">Rp {item.subtotal.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="text-xl font-semibold mt-6 mb-2">Riwayat Pesanan:</h2>
          <ul className="border border-gray-300 rounded-md p-4 bg-gray-50">
            {order.orderHistory.map((history, index) => (
              <li key={index} className="mb-2">
                <span className="font-semibold">{history.status}</span> - <span className="text-sm text-gray-600">{new Date(history.updatedAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default OrderDetailPage;
