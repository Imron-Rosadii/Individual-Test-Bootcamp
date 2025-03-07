import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import CardProductDetail from "@/components/molecule/CardProductDetail/index";
import Navbar from "@/components/organism/Navbar";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/Cart/cartSlice";

const ProductDetail = () => {
  const [token, setToken] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const { slug } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setToken(token);

    if (slug) {
      setLoading(true);
      axios
        .get(`http://localhost:8080/api/product/${slug}`)
        .then((res) => {
          setProduct(res.data);
        })
        .catch((err) => {
          console.error("Gagal mengambil detail produk:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [slug, router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(sessionStorage.getItem("token"));
    }
  }, []);

  const handleAddToCart = (product) => {
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        qty: 1,
        imagePath: product.imagePath,
      })
    );
  };

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Produk tidak ditemukan</p>;

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row gap-4 p-4 mt-20 mb-40">
        <div className="w-full md:w-1/2 flex justify-center items-center border-2 border-gray-300 rounded-lg shadow-md p-3">
          <CardProductDetail.Header image={product.imagePath} className="w-48 md:w-64 lg:w-80" />
        </div>

        <div className="w-full md:w-1/2 flex flex-col gap-2">
          <CardProductDetail.Body title={product.title} desc={product.description} className="text-sm md:text-base lg:text-lg" />
          <CardProductDetail.Footer price={product.price} className="text-sm md:text-base" stock={product.stock} product={product} onAddToCart={handleAddToCart} />
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
