import {
  MODE_AUTH_SERVER,
  MODE_MASTER_SERVER,
  PROJECT_NAME,
} from "./variables";
import CryptoJS from "crypto-js";
import { Loading, Notify, LocalStorage } from "quasar";
import useFetch from "./useFetch";
import { masterServerRoute } from './masterServerRoutes.js'

let loadingVar = [];
let updateUserInfoOnNextRoute = false;
const useUtils = {
  async fetchIuguId() {
    const ret = await useFetch({ route: "/iugu/getIuguTokenByCid" });
    setIuguId(ret.data);
  },
  userType: {
    async fetchAndRegister() {
      const ret = await useFetch({
        route: "/mobile/profile/getSelectedUserType",
      });
      window.localStorage.setItem("ut", JSON.stringify(ret.data));
    },
    get() {
      return JSON.parse(window.localStorage.getItem("ut"));
    },
  },

  updateNextRoute: {
    get() {
      return updateUserInfoOnNextRoute;
    },
    set(val) {
      updateUserInfoOnNextRoute = val;
      // const userInfo = this.getUserInfoByToken()
      return;
    },
  },
  presentUserInfo() {
    const key = LocalStorage.getItem("$k");
    const udCr = LocalStorage.getItem("u");
    if (!udCr || !key) return false;
    const ud = JSON.parse(
      CryptoJS.AES.decrypt(udCr, key).toString(CryptoJS.enc.Utf8)
    );
    return ud;
  },
  registerLogin(data) {
    const key = window.localStorage.getItem("$k");
    const d = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    window.localStorage.setItem("u" + data.userId, d);
    window.localStorage.setItem("au", data.userId);
    this.userType.fetchAndRegister();
  },
  getUSerProfilePhotoUrl() {
    const userInfo = this.presentUserInfo();
    return (
      this.attachmentsAddress() +
      userInfo.profilePhoto +
      "?" +
      new Date().getTime()
    );
  },
  localStorage: {
    set(key, value) {
      window.localStorage.setItem(key, JSON.stringify(value));
      return;
    },
    get(key) {
      return JSON.parse(window.localStorage.getItem(key));
    },
  },
  loading: {
    async loadingMk(message) {
      loadingVar = await Loading.create({
        message: message ? message : "Aguarde",
      });
    },
    async loadingMkArr(message) {
      loadingVar.push(
        await Loading.create({
          message: message ? message : "Aguarde",
        })
      );
      return loadingVar.length - 1;
    },
    async show(message) {
      await this.loadingMk(message);
      loadingVar.present();
    },
    async hide() {
      try {
        await loadingVar.dismiss();
      } catch (e) {
        return;
      }
    },
    async clear() {
      try {
        await loadingVar.dismiss();
      } catch (e) {
        return;
      }
    },
  },
  // isSystemComplete() {
  //   return SYSTEM_COMPLETE;
  // },
  async registerUserDataAndKey({ data, key }) {
    LocalStorage.set("$k", key);
    const d = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    LocalStorage.set("u", d);
    return;
  },
  urlIframeAdmin() {
    if (MODE_IFRAME === "local") return "http://localhost:8302/#";
    else return "https://homolr.b3dev.net/Admin/front/#";
  },

  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  errorMessages(type) {
    let ret;
    Vue.prototype.$errorMessages.forEach((e) => {
      if (e.name === type) ret = e.label;
    });
    Notify.create(ret);
    return ret;
  },
  presentOriginalUserInfo() {
    const key = window.localStorage.getItem("$k");
    const activeUser = window.localStorage.getItem("ul");
    const udCr = window.localStorage.getItem("u" + activeUser);
    if (!udCr || !key) return false;
    let ud;
    let error = false;
    try {
      ud = JSON.parse(
        CryptoJS.AES.decrypt(udCr, key).toString(CryptoJS.enc.Utf8)
      );
    } catch (e) {
      error = true;
    }
    if (!error) return ud;
    // window.location.href = '/login'
    return ud;
  },
  setActiveUser(id) {
    window.localStorage.setItem("au", id);
  },
  makeFileUrl (filename) {
    if (!filename) return '/assets/default_avatar.svg'
    return this.attachmentsAddress() + filename + '?' + new Date().getTime()
  },
  attachmentsAddress() {
    if (
      MODE_MASTER_SERVER === "dev" &&
      MODE_MASTER_SERVER === "dev_ext" &&
      MODE_MASTER_SERVER === "prod"
    )
      return masterServerRoute() + `/static/${PROJECT_NAME}/`;
    else return masterServerRoute("dev_ext") + `/static/${PROJECT_NAME}/`;
  },
  getPermissions() {
    const opt = {
      route: "/desktop/auth/getUserPermissions",
    };
    return useFetch(opt);
  },
  getUserInfoByToken() {
    const opt = {
      mode: MODE_AUTH_SERVER,
      route: "/desktop/auth/getUserInfoByToken",
    };
    return useFetch(opt);
  },
  getDrawerOptions(type) {
    const obj = {
      admin: [
        {
          label: "Tipos de funções",
          route: "/admin/functionsTypesList",
          icon: "format_list_numbered",
        },
      ],
      users: [
        {
          label: "Aguardando aprovação",
          route: "/users/usersWaitingApprovalList",
          icon: "access_time_filled",
        },
        {
          label: "Lista de Usuários",
          route: "/users/usersList",
          icon: "group",
        },
        {
          label: "Lista de turmas",
          route: "/users/classesList",
          icon: "school",
        },
        {
          label: "Lista de chats",
          route: "/users/chatList",
          icon: "question_answer",
        },
      ],
      social: [
        {
          label: "Lista de postagens",
          route: "/social/postsList",
          icon: "format_list_bulleted",
        },
        {
          label: 'Gerenciar comentários',
          route: '/social/manageComments',
          icon: 'chat'
        },
      ],
    };
    return obj[type];
  },
};
export default useUtils;
