import Sidebar from "@/components/molecule/SideBar";
import Navbar from "@/components/organism/Navbar";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Dashboard = () => {
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    if (!user || user.role !== "ADMIN") {
      router.push("/unauthorized");
    }
  }, [router]);
  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="p-4 w-full">
          <h1 className="text-2xl font-bold">Dashboard Admin</h1>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
