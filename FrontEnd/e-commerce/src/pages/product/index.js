import { useState, useEffect } from "react";
import Navbar from "@/components/organism/Navbar";
import CardProduct from "@/components/molecule/CardProduct";
import { useProducts } from "@/hooks/useProducts";

export default function ProductPage() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(sessionStorage.getItem("token"));
    }
  }, []);

  const { products, categories, selectedCategory, setSelectedCategory, sortOrder, setSortOrder, searchQuery, setSearchQuery, loading, setSearchTriggered, handleSearch } = useProducts(token);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-blue-500 uppercase mb-4">Products</h1>

        {/* Search Input */}
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Search products..."
            className="border p-3 rounded w-full bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 transition" onClick={handleSearch}>
            Search
          </button>
        </div>

        {/* Filter & Sort Controls */}
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="w-full md:w-1/3">
            <label className="block text-gray-700 font-bold mb-2">Filter by Category:</label>
            <select className="border p-3 rounded w-full bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-1/3">
            <label className="block text-gray-700 font-bold mb-2">Sort by Price:</label>
            <select className="border p-3 rounded w-full bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="asc">Lowest to Highest</option>
              <option value="desc">Highest to Lowest</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <CardProduct key={product.id}>
              <CardProduct.Header image={product.imagePath} slug={product.slug} />
              <CardProduct.Body title={product.title} desc={product.description} />
              <CardProduct.Footer price={product.price} id={product.id} stock={product.stock} product={product} handleAddToCart={() => handleAddToCart(product)} />
            </CardProduct>
          ))}
        </div>
      </div>
    </>
  );
}
