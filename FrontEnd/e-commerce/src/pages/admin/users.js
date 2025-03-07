import { useState, useEffect } from "react";
import { fetchUsers, updateUserRole, deleteUser } from "../../service/user";
import Navbar from "@/components/organism/Navbar";
import Sidebar from "@/components/molecule/SideBar";
import { useRouter } from "next/router";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData")); // Ambil user dari localStorage
    if (!user || user.role !== "ADMIN") {
      router.push("/unauthorized"); // Redirect jika bukan admin
    }
  }, [router]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await fetchUsers(token);
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleRoleChange = async () => {
    try {
      const token = localStorage.getItem("token");
      await updateUserRole(selectedUser.id, selectedUser.role, token);
      loadUsers();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const token = localStorage.getItem("token");
      await deleteUser(selectedUser.id, token);
      loadUsers();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const filteredUsers = roleFilter ? users.filter((user) => user.role === roleFilter) : users;

  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="p-4 w-full">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Manajemen Pengguna</h1>
            <div className="mb-4">
              <label className="mr-2">Filter per Role:</label>
              <select className="border rounded p-2" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                <option value="">Semua</option>
                <option value="ADMIN">Admin</option>
                <option value="CUSTOMER">Customer</option>
              </select>
            </div>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Nama</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Role</th>
                  <th className="border p-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border">
                    <td className="border p-2">{user.username}</td>
                    <td className="border p-2">{user.email}</td>
                    <td className="border p-2">{user.role}</td>
                    <td className="border p-2 space-x-2">
                      <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => openEditModal(user)}>
                        Edit
                      </button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => openDeleteModal(user)}>
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Modal Edit */}
            {isEditModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                <div className="bg-white p-6 rounded shadow-lg">
                  <h2 className="text-xl font-bold mb-4">Edit Peran Pengguna</h2>
                  <select className="border rounded p-2 w-full mb-4" value={selectedUser.role} onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}>
                    <option value="ADMIN">Admin</option>
                    <option value="CUSTOMER">Customer</option>
                  </select>
                  <div className="flex justify-end space-x-2">
                    <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setIsEditModalOpen(false)}>
                      Batal
                    </button>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleRoleChange}>
                      Simpan
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Hapus */}
            {isDeleteModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                <div className="bg-white p-6 rounded shadow-lg">
                  <h2 className="text-xl font-bold mb-4">Konfirmasi Hapus</h2>
                  <p>Apakah Anda yakin ingin menghapus {selectedUser.name}?</p>
                  <div className="flex justify-end space-x-2 mt-4">
                    <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setIsDeleteModalOpen(false)}>
                      Batal
                    </button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleDeleteUser}>
                      Hapus
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

export default UsersPage;
