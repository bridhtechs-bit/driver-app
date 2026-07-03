import { useRouter } from "expo-router";
import { useAppDispatch } from "@/store/hooks";
import { clearCredentials } from "@/store/slices/authSlice";
import { secureStoreHelper } from "@/services/api/secureStore";

export function useLogout() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const logout = async () => {
    await secureStoreHelper.deleteItem("token");

    dispatch(clearCredentials());

    router.replace("/login");
  };

  return {
    logout,
  };
}