import router from "@/router/index";
import store from "../store/index";

export function checkResponse(response: ServerResponse) {
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
      // matches comes from the ability search api, which may fail but return near misses
      if (!response.matches) {
        // something went wrong
        console.log(response);
      }
    }
    return false;
  }
  return true;
}
