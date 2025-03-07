import { useEffect, useState } from "react";
import { getProducts, getCategories } from "@/service/products";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTriggered, setSearchTriggered] = useState(false);

  // Fetch kategori sekali saat komponen dimount
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((error) => console.error("Gagal mengambil kategori", error));
  }, []);

  // Fetch produk setiap kali filter, sorting, atau pencarian berubah
  useEffect(() => {
    if (searchTriggered && !searchQuery) return;

    setLoading(true);
    getProducts(searchQuery, selectedCategory, sortOrder)
      .then(setProducts)
      .catch((error) => console.error("Gagal mengambil produk", error))
      .finally(() => {
        setLoading(false);
        setSearchTriggered(false); // Reset setelah pencarian selesai
      });
  }, [selectedCategory, sortOrder, searchTriggered]);

  // Fungsi untuk memicu pencarian
  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSearchTriggered(true);
    }
  };

  return {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    sortOrder,
    setSortOrder,
    searchQuery,
    setSearchQuery,
    loading,
    handleSearch,
  };
}
