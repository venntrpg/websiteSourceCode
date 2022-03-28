import router from "@/router/index";
import store from "./index";

export function checkResponse(response) {
  if (!response || response.success !== true) {
    if (response.info && response.info.includes("Authentication invalid")) {
      // user has been logged out
      store.commit("setIsLoggedIn", false);
      store.commit("setUsername", "");
      localStorage.removeItem("auth");
      localStorage.removeItem("username");
      if (router.currentRoute.name !== "Home") {
        router.push({ name: "Home" });
      }
    } else {
      // something went wrong
      console.log(response);
    }
    return false;
  }
  return true;
}
