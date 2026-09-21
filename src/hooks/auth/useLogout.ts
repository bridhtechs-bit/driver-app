import { useRouter } from "expo-router";
import { useAppDispatch } from "@/store/hooks";
import { clearCredentials } from "@/store/slices/authSlice";
import { secureStoreHelper } from "@/services/storage/secureStore";

export function useLogout() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const logout = async () => {
    await secureStoreHelper.deleteItem("token");
    await secureStoreHelper.deleteItem("refresh_token");
    await secureStoreHelper.deleteItem("user");
    await secureStoreHelper.deleteItem("onBoardingCompleted");

    dispatch(clearCredentials());

    router.replace("/login");
  };

  return {
    logout,
  };
}