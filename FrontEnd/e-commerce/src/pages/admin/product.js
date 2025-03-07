import Navbar from "@/components/organism/Navbar";
import Sidebar from "@/components/molecule/SideBar";
import useProductForm from "@/hooks/useProductForm";
import { useState, useEffect } from "react";
import { getProducts, deleteProduct, createProduct, UpdateProduct } from "@/service/products";
import Image from "next/image";
import { useRouter } from "next/router";

const AdminProduct = () => {
  const { formData, loading, error, handleChange, setFormData } = useProductForm();
  const [token, setToken] = useState(null);
  const [products, setProducts] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    if (!user || user.role !== "ADMIN") {
      router.push("/unauthorized");
    }
  }, [router]);

  // Ambil token hanya untuk operasi Create/Edit/Delete
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = sessionStorage.getItem("token");
      setToken(storedToken);
    }
  }, []);

  // Fetch Produk (Tidak Butuh Token)
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts(); // Tanpa token
      setProducts(data);
    } catch (error) {
      setFetchError(error.message);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditingProductId(null);
    setFormData({});
  };

  const handleDelete = async (productId) => {
    if (!token) {
      alert("Token tidak ditemukan! Silakan login ulang.");
      return;
    }

    const isConfirmed = window.confirm("Apakah Anda yakin ingin menghapus produk ini?");
    if (!isConfirmed) return;

    try {
      await deleteProduct(productId, token);
      fetchProducts();
      alert("Produk berhasil dihapus.");
    } catch (error) {
      console.error("Gagal menghapus produk:", error.message);
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditingProductId(product.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    console.log("🚀 Submit Form Produk");

    if (!token) {
      console.error("❌ Token tidak ditemukan!");
      alert("Token tidak ditemukan! Silakan login ulang.");
      return;
    }

    console.log("🔍 Token ditemukan:", token);
    console.log("📝 Data produk sebelum dikirim:", formData);

    try {
      if (isEditing) {
        console.log("✏️ Mode Edit: ID Produk ->", editingProductId);
        await UpdateProduct(editingProductId, formData, token);
      } else {
        console.log("🆕 Menambahkan produk baru...");
        await createProduct(formData, token);
      }

      console.log("✅ Produk berhasil disimpan!");
      closeModal();
      fetchProducts();
    } catch (error) {
      console.error("❌ Gagal menyimpan produk:", error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFormData((prev) => ({ ...prev, imagePath: file }));
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="p-4 flex-1">
          <h1 className="text-2xl font-bold">Products Admin</h1>

          <button onClick={() => setIsModalOpen(true)} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
            Tambah Produk
          </button>

          {/* Modal Tambah/Edit Produk */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">{isEditing ? "Edit Produk" : "Tambah Produk"}</h2>
                <form onSubmit={handleFormSubmit} className="space-y-3">
                  <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full p-2 border" placeholder="Title" />
                  <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="w-full p-2 border" placeholder="Slug" />
                  <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full p-2 border" placeholder="Price" />
                  <input type="number" name="stock" value={formData.stock} onChange={handleChange} required className="w-full p-2 border" placeholder="Stock" />
                  <input type="text" name="categoryId" value={formData.categoryId} onChange={handleChange} required className="w-full p-2 border" placeholder="Category ID" />
                  <input type="text" name="customerId" value={formData.customerId} onChange={handleChange} required className="w-full p-2 border" placeholder="Customer ID" />
                  <textarea name="description" value={formData.description} onChange={handleChange} required className="w-full p-2 border" placeholder="Description" />
                  <input type="file" name="imagePath" onChange={handleFileChange} required className="w-full p-2 border" accept="image/*" />

                  <div className="flex justify-between mt-4">
                    <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-500 text-white rounded">
                      {loading ? "Loading..." : isEditing ? "Simpan Perubahan" : "Buat Produk"}
                    </button>
                    <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-500 text-white rounded">
                      Tutup
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Tabel Produk */}
          <div className="bg-white p-4 border rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Daftar Produk</h2>
            {fetchError && <p className="text-red-500">{fetchError}</p>}
            {products.length === 0 ? (
              <p className="text-gray-500">Tidak ada produk tersedia.</p>
            ) : (
              <table className="w-full border-collapse border">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">#</th>
                    <th className="border p-2">Nama Produk</th>
                    <th className="border p-2">Harga</th>
                    <th className="border p-2">Stok</th>
                    <th className="border p-2">Gambar</th>
                    <th className="border p-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={product.id} className="text-center">
                      <td className="border p-2">{index + 1}</td>
                      <td className="border p-2">{product.title}</td>
                      <td className="border p-2">Rp {product.price}</td>
                      <td className="border p-2">{product.stock}</td>
                      <td className="border p-2">
                        <Image width={100} height={100} src={`http://localhost:8080/uploads/${product.imagePath}`} alt={product.title} className="w-16 h-16 object-cover" />
                      </td>
                      <td className="border p-2 space-x-2">
                        <button onClick={() => handleEdit(product)} className="px-2 py-1 bg-yellow-500 text-white rounded">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="px-2 py-1 bg-red-500 text-white rounded">
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProduct;
