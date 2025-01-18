const { default: axiosInstance } = require(".");

export const addReport = async (formData) => {
  try {
    const formHeaders = { "Content-Type": "multipart/form-data" };
    console.log("Adding report:", formData);
    const response = await axiosInstance.post("/api/reports/add-report", formData, {
      headers: formHeaders,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding report:", error);
    return error.response ? error.response.data : { success: false, message: "Network error" };
  }
};

export const getAllReports = async (filters) => {
  try {
    console.log("Fetching all reports with filters:", filters);
    const response = await axiosInstance.post("/api/reports/get-all-reports", filters);
    return response.data;
  } catch (error) {
    console.error("Error fetching all reports:", error);
    return error.response ? error.response.data : { success: false, message: "Network error" };
  }
};

export const getAllReportsByUser = async () => {
  try {
    console.log("Fetching all reports by user...");
    const response = await axiosInstance.post("/api/reports/get-all-reports-by-user");
    return response.data;
  } catch (error) {
    console.error("Error fetching reports by user:", error);
    return error.response ? error.response.data : { success: false, message: "Network error" };
  }
};
