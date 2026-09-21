import { useRouter } from "expo-router";
import { ROUTES } from "@/navigation/routes";
import { useAppDispatch } from "@/store/hooks";
import { useRegisterMutation } from "@/services/api/authApi";
import { secureStoreHelper } from "@/services/storage/secureStore";
import { setCredentials } from "@/store/slices/authSlice";

export function useRegister() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [register, state] = useRegisterMutation();

  const handleRegister = async (payload: any) => {
    const response = await register(payload).unwrap();

    await secureStoreHelper.setItem(
      "token",
      response.accessToken
    );

    dispatch(
      setCredentials({
        token: response.accessToken,
        user: response.user,
      })
    );
    
    //rediriger vers la page de connexion après l'inscription
    router.replace(ROUTES.LOGIN);
  };

  return {
    register: handleRegister,
    ...state,
  };
}