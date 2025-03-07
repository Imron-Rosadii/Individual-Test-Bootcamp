import React from "react";
import Image from "next/image";
import Button from "@/components/atoms/Button";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/Cart/cartSlice";
import { addToCartAPI } from "@/service/CartService";
import { getImageUrl } from "@/service/image";
import { useRouter } from "next/router";

const CardProductDetail = ({ children }) => {
  return <div className="max-w-5xl w-full bg-white shadow-2xl rounded-lg overflow-hidden flex flex-col md:flex-row">{children}</div>;
};

function Header({ image, title }) {
  return (
    <div className="md:w-1/2 w-full">
      <Image src={getImageUrl(image)} alt={`Gambar produk ${title}`} className="w-full h-full object-cover" width={600} height={600} />
    </div>
  );
}

function Body({ title, desc }) {
  return (
    <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
      <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">{title}</h3>
      <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4">{desc}</p>
    </div>
  );
}

function Footer({ price, stock, product }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const handleAddToCart = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      router.push("/login");
      alert("Anda harus login terlebih dahulu");
      return;
    }

    if (product && product.id) {
      try {
        // Hit API terlebih dahulu
        const response = await addToCartAPI(product, token); // Mengirim data ke server

        // Periksa apakah API memberikan respons yang valid
        if (response.status === 200) {
          console.log("Produk berhasil ditambahkan ke keranjang");

          // Dispatch ke Redux untuk update state
          dispatch(
            addToCart({
              id: product.id, // Gunakan ID dari API
              title: product.title, // Gunakan title dari API
              price: product.price, // Gunakan price dari API
              qty: 1, // Default quantity
              imagePath: product.imagePath, // Ambil imagePath dari produk
            })
          );
        } else {
          console.error("Gagal menambahkan produk ke keranjang.");
        }
      } catch (error) {
        console.error("Gagal menambahkan produk ke keranjang:", error);
      }
    } else {
      console.error("Produk tidak valid:", product);
    }
  };

  return (
    <>
      <div className="p-6  mt-4 bg-white rounded-lg shadow-sm">
        <div className="flex flex-col">
          <span className="text-3xl font-bold text-indigo-600">{price.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</span>
          <p className={`mt-2 text-lg font-medium ${stock > 0 ? "text-green-600" : "text-red-600"}`}>{stock > 0 ? `Stok: ${stock}` : "Stok Habis"}</p>
        </div>
        <Button
          disabled={stock === 0}
          buttonClassname={`mt-4 w-full py-3 px-6 rounded-lg text-lg font-semibold transition-all duration-300 ease-in-out shadow-md flex items-center justify-center ${
            stock > 0 ? "bg-gradient-to-r from-blue-500 to-violet-700 hover:from-violet-700 hover:to-blue-500 text-white cursor-pointer" : "bg-gray-300 text-gray-500 cursor-no-drop"
          }`}
          onClick={handleAddToCart}
        >
          Beli Sekarang
        </Button>
      </div>
    </>
  );
}

CardProductDetail.Header = Header;
CardProductDetail.Body = Body;
CardProductDetail.Footer = Footer;

export default CardProductDetail;
