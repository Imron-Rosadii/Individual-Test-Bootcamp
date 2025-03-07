import Link from "next/link";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold">Admin Panel</h2>
      <nav>
        <ul className="mt-4">
          <li>
            <Link href="/admin/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link href="/admin/product">Products</Link>
          </li>
          <li>
            <Link href="/admin/users">Users</Link>
          </li>
          <li>
            <Link href="/admin/orders">Orders</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
