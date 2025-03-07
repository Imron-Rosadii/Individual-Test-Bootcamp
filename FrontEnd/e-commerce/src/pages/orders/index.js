import Navbar from "@/components/organism/Navbar";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getCurrentUser } from "@/service/auth";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [alertShown, setAlertShown] = useState(false); // Tambahkan state

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("token");

      if (!token && !alertShown) {
        // Cek apakah alert sudah ditampilkan
        alert("Anda harus login terlebih dahulu");
        setAlertShown(true); // Set agar alert tidak muncul lagi
        router.push("/login");
      } else if (token) {
        setIsAuthenticated(true);
        const sessionUser = getCurrentUser(token);
        setUser(sessionUser);
      }
    }
  }, [router, alertShown]); // Tambahkan alertShown sebagai dependency

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          console.error("Token not found");
          setLoading(false);
          return;
        }

        const url = status ? `http://localhost:8080/api/orders?status=${status.toUpperCase()}` : "http://localhost:8080/api/orders";
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [status]);

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Daftar Pesanan</h1>
        <div className="mb-4">
          <select className="p-2 border rounded" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Semua</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELED">Canceled</option>
          </select>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">ID</th>
                <th className="border p-2">Total Harga</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Produk</th>
                <th className="border p-2">Waktu Pembuatan</th>
                <th className="border p-2">Terakhir Diperbarui</th>
                <th className="border p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId} className="text-center">
                  <td className="border p-2">{order.orderId}</td>
                  <td className="border p-2">Rp {order.totalPrice.toLocaleString()}</td>
                  <td className={`border p-2 font-semibold ${order.status === "PENDING" ? "text-yellow-500" : order.status === "COMPLETED" ? "text-green-500" : "text-red-500"}`}>{order.orderHistory?.[0]?.status || order.status}</td>
                  <td className="border p-2">
                    {order.items.map((item) => (
                      <div key={item.productId} className="text-left">
                        {item.productName} (x{item.quantity}) - Rp {item.subtotal.toLocaleString()}
                      </div>
                    ))}
                  </td>
                  <td className="border p-2">{new Date(order.createdAt).toLocaleString()}</td>
                  <td className="border p-2">{new Date(order.orderHistory?.[0]?.updatedAt || order.createdAt).toLocaleString()}</td>
                  {/* Perbaikan: Link harus ada di dalam <td> */}
                  <td className="border p-2">
                    <Link href={`/orders/${order.orderId}`} className="text-blue-500 hover:underline">
                      Lihat Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default OrdersPage;
