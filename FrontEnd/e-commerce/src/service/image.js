const BASE_URL = "http://localhost:8080/uploads";

export const getImageUrl = (imagePath) => {
  return `${BASE_URL}/${imagePath}`;
};
