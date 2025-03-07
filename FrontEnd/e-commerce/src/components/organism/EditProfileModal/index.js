import { useState } from "react";

const EditProfileModal = ({ field, currentValue, onUpdate, onClose }) => {
  const [value, setValue] = useState(currentValue);

  const handleUpdate = () => {
    onUpdate(value);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit {field}</h2>
        <input type="text" value={value} onChange={(e) => setValue(e.target.value)} className="w-full px-4 py-2 border rounded-md mb-4" />
        <div className="flex justify-end">
          <button onClick={onClose} className="mr-2 px-4 py-2 bg-gray-500 text-white rounded-md">
            Batal
          </button>
          <button onClick={handleUpdate} className="px-4 py-2 bg-blue-500 text-white rounded-md">
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
