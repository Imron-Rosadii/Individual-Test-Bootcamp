import Link from "next/link";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold text-red-500">403 - Akses Ditolak</h1>
      <p className="mt-2">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
      <Link href="/" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
        Kembali ke Beranda
      </Link>
    </div>
  );
};

export default Unauthorized;
