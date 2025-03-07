import Navbar from "@/components/organism/Navbar";
import ModalUpdate from "@/components/molecule/ModalUpdate";
import { useProfile } from "@/hooks/useProfile";
import { updateUserProfile } from "@/service/profile";

const Profile = () => {
  const { userData, modalType, setModalType, inputValue, setInputValue, showModal, setShowModal } = useProfile();

  const openModal = (type) => {
    setModalType(type);
    setInputValue(type === "username" ? userData?.username || "" : "");
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      if (!inputValue) {
        alert(`${modalType} tidak boleh kosong!`);
        return;
      }

      const response = await updateUserProfile(userData.id, modalType, inputValue);
      if (response.status === 200) {
        alert(`${modalType} updated successfully!`);
        setShowModal(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Gagal update data:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
        <h2 className="text-2xl font-bold mb-4">Profil</h2>
        {userData ? (
          <div>
            <p>
              <strong>ID:</strong> {userData.id}
            </p>
            <p>
              <strong>Username:</strong> {userData.username}
              <button onClick={() => openModal("username")} className="text-blue-500 ml-2">
                Edit
              </button>
            </p>
            <p>
              <strong>Email:</strong> {userData.email}
              <button onClick={() => openModal("email")} className="text-blue-500 ml-2">
                Edit
              </button>
            </p>
            <p>
              <strong>Role:</strong> {userData.role}
            </p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
        <button onClick={() => openModal("password")} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md">
          Update Password
        </button>
      </div>

      {showModal && <ModalUpdate modalType={modalType} inputValue={inputValue} setInputValue={setInputValue} setShowModal={setShowModal} handleUpdate={handleUpdate} />}
    </>
  );
};

export default Profile;
