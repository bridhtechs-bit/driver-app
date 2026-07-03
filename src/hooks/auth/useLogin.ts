import { useRouter } from "expo-router";
import { useAppDispatch } from "@/store/hooks";
import { useLoginMutation } from "@/services/api/authApi";
import secureStoreHelper from "@/services/api/secureStore";
import { setCredentials } from "@/store/slices/authSlice";

export function useLogin() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [loginMutation, state] = useLoginMutation();

  const login = async (
    phone: string,
    password: string
  ) => {
    const response = await loginMutation({
      phone,
      password,
    }).unwrap();

    console.log("✅ Login response:", response);

    // Sauvegarde du token
    await secureStoreHelper.setItem(
      "token",
      response.accessToken
    );

    // Vérification
    const savedToken = await secureStoreHelper.getItem("token");
    console.log("✅ Token saved:", savedToken);

    dispatch(
      setCredentials({
        token: response.accessToken,
        user: response.user,
      })
    );

    router.replace("/");

    return response.user;
  };

  return {
    login,
    loading: state.isLoading,
    isLoading: state.isLoading,
    isSuccess: state.isSuccess,
    isError: state.isError,
    error:
      "data" in (state.error ?? {})
        ? (state.error as any).data?.message
        : undefined,
  };
}