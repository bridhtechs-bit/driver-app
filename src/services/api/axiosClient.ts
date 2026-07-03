import axios from "axios";
import Config from "../../constants/config";
import secureStoreHelper from "./secureStore";

const axiosClient = axios.create({
  baseURL: Config.API_URL,
  timeout: Config.DEFAULT_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Inject JWT token from SecureStore
axiosClient.interceptors.request.use(
  async (config) => {
    console.log("Request Interceptor: Adding Authorization header if token exists.");
    console.log("Current Config:", config);
    console.log(config.headers);
    console.log(config.url);
    console.log(config.method);
    console.log(config.data);
    const token = await secureStoreHelper.getItem("token");

    console.log("Retrieved token from secure store:", token);


    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    
    console.log("Authorization =", config.headers?.Authorization);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global error interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized, we could handle token clearing or redirects
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized request detected (401). clearing token...");
      secureStoreHelper.deleteItem("token");
    }
    
    // Normalize errors for easy UI presentation
    const errorMessage = 
      error.response?.data?.message || 
      error.response?.data?.error || 
      error.message || 
      "Une erreur est survenue. Veuillez réessayer.";
      
    error.friendlyMessage = errorMessage;
    return Promise.reject(error);
  }
);

export default axiosClient;
