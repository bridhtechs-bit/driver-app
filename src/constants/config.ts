import { Platform } from "react-native";

const DEV_MACHINE_IP = "11.11.11.12";

const getHost = () => {
  if (Platform.OS === "android") {
    return DEV_MACHINE_IP;
  }

  return "localhost";
};

const HOST = getHost();

const Config = {
  BASE_URL: `http://${HOST}:5000`,
  API_URL: `http://${HOST}:5000/api`,
  SOCKET_URL: `http://${HOST}:5000`,
  DEFAULT_TIMEOUT: 10000,
};

export default Config;