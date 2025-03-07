import { useEffect, useState } from "react";
import { fetchOrders, updateOrderStatus } from "../../service/order";
import Navbar from "@/components/organism/Navbar";
import Sidebar from "@/components/molecule/SideBar";
import { useRouter } from "next/router";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData")); // Ambil user dari localStorage
    if (!user || user.role !== "ADMIN") {
      router.push("/unauthorized"); // Redirect jika bukan admin
    }
  }, [router]);

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await fetchOrders(token, statusFilter);
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const openOrderDetailModal = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    if (!orderId) {
      alert("Order ID tidak ditemukan!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await updateOrderStatus(orderId, newStatus, token);
      alert("Status pesanan berhasil diperbarui!");
      loadOrders();
    } catch (error) {
      alert("Gagal memperbarui status pesanan.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="p-4 w-full">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Manajemen Pesanan</h1>

            <div className="mb-4">
              <label className="mr-2">Filter berdasarkan Status:</label>
              <select className="border rounded p-2" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">Semua</option>
                <option value="PENDING">Pending</option>
                <option value="SHIPPED">Dikirim</option>
                <option value="DELIVERED">Diterima</option>
                <option value="CANCELLED">Dibatalkan</option>
              </select>
            </div>

            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Order ID</th>
                  <th className="border p-2">Customer</th>
                  <th className="border p-2">Total Harga</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.orderId} className="border">
                    <td className="border p-2">{order.orderId}</td>
                    <td className="border p-2">{order.customerId}</td>
                    <td className="border p-2">Rp {order.totalPrice.toLocaleString()}</td>
                    <td className="border p-2">
                      <select className="border rounded p-1" value={order.status} onChange={(e) => handleStatusChange(order.orderId, e.target.value)}>
                        <option value="PENDING">Pending</option>
                        <option value="SHIPPED">Dikirim</option>
                        <option value="DELIVERED">Diterima</option>
                        <option value="CANCELLED">Dibatalkan</option>
                      </select>
                    </td>
                    <td className="border p-2">
                      <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => openOrderDetailModal(order)}>
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Modal Detail Order */}
            {isDetailModalOpen && selectedOrder && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                <div className="bg-white p-6 rounded shadow-lg w-1/2">
                  <h2 className="text-xl font-bold mb-4">Detail Pesanan</h2>
                  <p>
                    <strong>Order ID:</strong> {selectedOrder.orderId}
                  </p>
                  <p>
                    <strong>Customer ID:</strong> {selectedOrder.customerId}
                  </p>
                  <p>
                    <strong>Total Harga:</strong> Rp {selectedOrder.totalPrice.toLocaleString()}
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedOrder.status}
                  </p>

                  <h3 className="font-bold mt-4">Items:</h3>
                  <ul className="list-disc pl-5">
                    {selectedOrder.items.map((item) => (
                      <li key={item.productId}>
                        {item.productName} - {item.quantity} x Rp {item.subtotal.toLocaleString()}
                      </li>
                    ))}
                  </ul>

                  <h3 className="font-bold mt-4">Riwayat Status:</h3>
                  <ul className="list-disc pl-5">
                    {selectedOrder.orderHistory.map((history, index) => (
                      <li key={index}>
                        {history.status} - {new Date(history.updatedAt).toLocaleString()}
                      </li>
                    ))}
                  </ul>

                  <div className="flex justify-end mt-4">
                    <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setIsDetailModalOpen(false)}>
                      Tutup
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrdersPage;
