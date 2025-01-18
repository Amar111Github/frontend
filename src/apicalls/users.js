const { default: axiosInstance } = require(".");

export const registerUser = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/users/register', payload);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

// export const loginUser = async (payload) => {
//     try {
//         const response = await axiosInstance.post('/api/users/login', payload);
//         return response.data;
//     } catch (error) {
//         return error.response.data;
//     }
// }
export const loginUser = async (payload) => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from local storage
      const response = await axiosInstance.post(
        "/api/users/login",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  };
  

export const getUserInfo = async () => {
    try {
        const response = await axiosInstance.post('/api/users/get-user-info');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
