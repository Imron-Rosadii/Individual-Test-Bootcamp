import { useState } from "react";
import { createProduct } from "@/service/products";

const useProductForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    price: "",
    stock: "",
    isActive: true,
    categoryId: "",
    description: "",
    imagePath: null,
    customerId: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file" && files.length > 0) {
      setFormData((prev) => ({ ...prev, imagePath: files[0] }));
      console.log("📸 File yang dipilih:", files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createProduct(formData);
      alert("🎉 Produk berhasil dibuat!");

      // Reset Form
      setFormData({
        title: "",
        slug: "",
        price: "",
        stock: "",
        isActive: true,
        categoryId: "",
        description: "",
        imagePath: null,
        customerId: "",
      });
    } catch (err) {
      setError(err.message || "Gagal membuat produk");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    error,
    handleChange,
    handleSubmit,
    setFormData,
  };
};

export default useProductForm;
