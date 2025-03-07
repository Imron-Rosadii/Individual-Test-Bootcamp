import Link from "next/link";
import React from "react";
import Image from "next/image";
import Button from "@/components/atoms/Button";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/Cart/cartSlice";
import { addToCartAPI } from "@/service/CartService";
import { getImageUrl } from "@/service/image";
import { useRouter } from "next/router";

const CardProduct = ({ children }) => {
  return (
    <div>
      <div className="w-full max-w-xs rounded-lg bg-white border border-gray-300 shadow-md overflow-hidden transform transition duration-300 hover:-translate-y-2 hover:shadow-lg">{children}</div>
    </div>
  );
};

function Header({ image, title, slug }) {
  return (
    <Link href={`/product/${slug}`} passHref>
      <Image src={getImageUrl(image)} alt={`Gambar produk ${title}`} className="p-4 rounded-t-lg w-full aspect-video object-contain cursor-pointer" width={300} height={300} />
    </Link>
  );
}

const Body = ({ title, link = "#" }) => {
  return (
    <div className="px-5 pb-5 h-10 min-h-[80px]">
      <Link href={link}>
        <h3 className="text-3xl font-bold text-gray-900 line-clamp-2 min-h-[75px]">{title}</h3>
      </Link>
    </div>
  );
};

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

CardProduct.Header = Header;
CardProduct.Body = Body;
CardProduct.Footer = Footer;

export default CardProduct;
