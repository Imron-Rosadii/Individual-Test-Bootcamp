import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/product";

export async function getProducts(searchQuery = "", category = "", sort = "asc") {
  try {
    const params = new URLSearchParams();
    if (searchQuery) params.append("search", searchQuery);
    if (category) params.append("category", category);
    params.append("sort", sort);

    const response = await axios.get(`${API_BASE_URL}?${params.toString()}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching products:", error.response?.data || error.message);
    return [];
  }
}

export async function getCategories() {
  try {
    const response = await axios.get(`${API_BASE_URL}/category`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching categories:", error.response?.data || error.message);
    return [];
  }
}

export const deleteProduct = async (productId) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login ulang.");

  try {
    const response = await axios.delete(`${API_BASE_URL}/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Gagal menghapus produk.");
  }
};

export const createProduct = async (formData) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login ulang.");

  console.log("🔍 Token ditemukan:", token);
  console.log("📝 Data produk sebelum dikirim:", formData);

  // Pastikan semua data dikonversi ke string (FormData hanya menerima string atau file)
  const form = new FormData();
  form.append("title", formData.title);
  form.append("slug", formData.slug);
  form.append("price", String(formData.price));
  form.append("stock", String(formData.stock));
  form.append("isActive", formData.isActive.toString());
  form.append("categoryId", String(formData.categoryId));
  form.append("customerId", String(formData.customerId));
  form.append("description", formData.description);

  if (formData.imagePath) {
    form.append("imagePath", formData.imagePath);
    console.log("📸 Gambar ditambahkan:", formData.imagePath.name);
  } else {
    console.warn("⚠️ Tidak ada gambar yang diunggah.");
  }

  try {
    console.log("📡 Mengirim request ke backend...");
    const response = await axios.post(API_BASE_URL, form, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("✅ Produk berhasil disimpan:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Gagal menyimpan produk:", error.response?.data || error.message);
    throw error;
  }
};
export const UpdateProduct = async (productId, formData) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login ulang.");

  const form = new FormData();
  form.append("title", formData.title ?? "");
  form.append("slug", formData.slug ?? "");
  form.append("price", formData.price ?? "0");
  form.append("stock", formData.stock ?? "0");
  form.append("isActive", (formData.isActive ?? true).toString());
  form.append("categoryId", formData.categoryId ?? "");
  form.append("description", formData.description ?? "");
  form.append("customerId", formData.customerId ?? "");

  // Hanya tambahkan file jika ada (jangan kirim string kosong)
  if (formData.imagePath instanceof File) {
    form.append("imagePath", formData.imagePath);
  }

  const response = await axios.put(`http://localhost:8080/api/product/${productId}`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
