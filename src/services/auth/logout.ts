import { secureStoreHelper } from "@/services/storage/secureStore";
import { clearCredentials } from "@/store/slices/authSlice";
import { ROUTES } from "@/navigation/routes";

export async function performLogout(dispatch: any, router: { replace: (path: string) => void }) {
  await Promise.all([
    secureStoreHelper.deleteItem("token"),
    secureStoreHelper.deleteItem("refresh_token"),
    secureStoreHelper.deleteItem("user"),
    secureStoreHelper.deleteItem("onBoardingCompleted"),
  ]);

  dispatch(clearCredentials());
  router.replace(ROUTES.LOGIN);
}
