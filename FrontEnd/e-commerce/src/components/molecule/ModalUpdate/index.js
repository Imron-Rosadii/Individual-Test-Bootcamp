const ModalUpdate = ({ modalType, inputValue, setInputValue, setShowModal, handleUpdate }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h3 className="text-lg font-bold">Update {modalType}</h3>

        {modalType === "password" ? (
          <>
            <input type="password" placeholder="Old Password" value={inputValue.oldPassword} onChange={(e) => setInputValue({ ...inputValue, oldPassword: e.target.value })} className="w-full px-4 py-2 border rounded-md mt-2" />
            <input type="password" placeholder="New Password" value={inputValue.newPassword} onChange={(e) => setInputValue({ ...inputValue, newPassword: e.target.value })} className="w-full px-4 py-2 border rounded-md mt-2" />
          </>
        ) : (
          <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="w-full px-4 py-2 border rounded-md mt-2" />
        )}

        <div className="flex justify-end mt-4">
          <button onClick={() => setShowModal(false)} className="mr-2 bg-gray-400 text-white px-4 py-2 rounded-md">
            Cancel
          </button>
          <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalUpdate;
