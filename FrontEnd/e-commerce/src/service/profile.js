import axios from "axios";

export const updateUserProfile = async (userId, modalType, inputValue) => {
  try {
    const token = sessionStorage.getItem("token");
    const url = `http://localhost:8080/api/customer/${userId}/update-${modalType}`;

    let payload = {};
    if (modalType === "username") {
      payload = { usernameUpdate: inputValue };
    } else if (modalType === "email") {
      payload = { emailUpdate: inputValue };
    } else if (modalType === "password") {
      payload = {
        oldPassword: inputValue.oldPassword,
        updatePassword: inputValue.newPassword,
      };
    }

    const response = await axios.put(url, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response;
  } catch (error) {
    console.error("Gagal update data:", error);
    throw error;
  }
};
