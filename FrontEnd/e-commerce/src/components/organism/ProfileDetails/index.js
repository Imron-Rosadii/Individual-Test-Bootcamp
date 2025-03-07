const ProfileDetails = ({ userData, onEdit }) => {
  return (
    <>
      <div className="mb-4">
        <label className="block text-gray-700">Username</label>
        <div className="flex justify-between">
          <p className="w-full px-4 py-2 border rounded-md">{userData.username}</p>
          <button onClick={() => onEdit("username")} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md">
            Edit
          </button>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Email</label>
        <div className="flex justify-between">
          <p className="w-full px-4 py-2 border rounded-md">{userData.email}</p>
          <button onClick={() => onEdit("email")} className="ml-2 bg-green-500 text-white px-4 py-2 rounded-md">
            Edit
          </button>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Role</label>
        <p className="w-full px-4 py-2 border rounded-md">{userData.role}</p>
      </div>
    </>
  );
};

export default ProfileDetails;
