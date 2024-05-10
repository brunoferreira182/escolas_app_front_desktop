import {
  MODE_AUTH_SERVER,
  MODE_MASTER_SERVER,
  PROJECT_NAME,
} from "./variables";
import CryptoJS from "crypto-js";
import { Loading, Notify, LocalStorage } from "quasar";
import useFetch from "./useFetch";
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
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
  getFilesystemAccess() {
    return new Promise(async (resolve) => {
      const status = await Filesystem.checkPermissions()
      const state = status.publicStorage

      if (state === 'granted') {
        return resolve(true)
      } else if (state === 'denied') {
      } else {
        Filesystem.requestPermissions()
      }
      return resolve(false)
    })
  },
  async convertBlobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  },


  async downloadFile (obj) {

    const perm = await this.getFilesystemAccess()
    const opt = {
      route: '/download/' + obj.filename,
      method: 'GET'
    }
    const httpResponse = await useFetch(opt)
    console.log("🚀 ~ downloadFile ~ httpResponse22222222222222:", httpResponse)
    const originalnameSplit = obj.originalname.split('.')
    const currentDate = new Date().toLocaleString().replace(/[,:\s\/]/g, '-')
    let nameToDownload
    if (originalnameSplit.length === 1) nameToDownload = obj.originalname + '_' + currentDate
    else nameToDownload = originalnameSplit[0] + '_' + currentDate + '.' + originalnameSplit[originalnameSplit.length - 1]

    let writeFile
    let error = false


    // Solicita permissão para escrever no diretório
    const dirHandle = await window.showDirectoryPicker();
    // Cria um novo arquivo no diretório
    const fileHandle = await dirHandle.getFileHandle(nameToDownload, { create: true });
    // Cria um gravador de arquivos
    const writableStream = await fileHandle.createWritable();
    // Escreve os dados no arquivo
    await writableStream.write(httpResponse);
    // Fecha o gravador de arquivos
    await writableStream.write({ type: 'write', data: httpResponse });
    await writableStream.close();
    // try {
    //   writeFile = await Filesystem.writeFile({
    //     path: nameToDownload,
    //     data: httpResponse,
    //     directory: 'C://Projects',
    //     encoding: Encoding.UTF8,
    //   })
    //     console.log("🚀 ~ downloadFile ~ httpResponse:", httpResponse)
    // } catch (e) {
    //   console.log(e, 'erro criar arquivo')
    //   error = true
    // }
    console.log(writeFile, 'writeFiel aqui')
    if (!error) Notify.create('Arquivo baixado na pasta Documentos')
    else {
      Notify.create('Ocorreu um erro ao baixar o arquivo')
      return
    }
      const link = writeFile.uri
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.href = link;
      a.download = obj.originalname;
      a.click();
      URL.revokeObjectURL(link);
    // await FileOpener.openFile({
    //   path: writeFile.uri,
    // })
    return
  },
  // downloadFile (options) {
  //   console.log("🚀 ~ downloadFile ~ options:", options)
  //   const opt = {
  //     method: 'GET',
  //     responseType: 'arrayBuffer',
  //     route: '/download/' + options.filename
  //   }
  //   useFetch(opt).then((response) => {
  //     console.log("🚀 ~ useFetch ~ response:", response)
  //     console.log('entrou', typeof response)
  //     const blob = new Blob([response], {type: options.mimetype})
  //     console.log('blob', blob)
  //     const link = URL.createObjectURL(blob)
  //     const a = document.createElement("a");
  //     document.body.appendChild(a);
  //     a.href = link;
  //     a.download = options.originalname;
  //     a.click();
  //     URL.revokeObjectURL(link);
  //   })
  // },
  // async downloadFile (obj) {
  //   console.log("🚀 ~ downloadFile ~ obj:", obj)
  //   const perm = await this.getFilesystemAccess()
  //   if (!perm) return false
  //   const originalnameSplit = obj.originalname.split('.')
  //   const currentDate = new Date().toLocaleString().replace(/[,:\s\/]/g, '-')
  //   let nameToDownload
  //   if (originalnameSplit.length === 1) nameToDownload = obj.originalname + '_' + currentDate
  //   else nameToDownload = originalnameSplit[0] + '_' + currentDate + '.' + originalnameSplit[originalnameSplit.length - 1]
  //   const opt = {
  //     url: `/download/${obj.filename}`,
  //     method: 'GET',
  //     // directory: Directory.Data
  //     // path: '/Users/tiago/Documents/'
  //   }
  //   console.log(opt, 'opt aqui')
  //   const dl = await Filesystem.downloadFile(opt)
  //   console.log(dl, 'blob')
  //   const blob = new Blob([dl.blob], {type: obj.mimetype})
  //   const teste = await this.convertBlobToBase64(blob)
  //   console.log('blob', teste)
  //   const link = URL.createObjectURL(teste)
  //   const a = document.createElement("a");
  //   document.body.appendChild(a);
  //   a.href = link;
  //   a.download = obj.originalname;
  //   a.click();
  //   URL.revokeObjectURL(link);
  // },
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
    if (!filename || filename === '') return '/assets/default_avatar.svg'
    return this.attachmentsAddress() + filename + '?' + new Date().getTime()
  },
  attachmentsAddress() {
    console.log(masterServerRoute() + `/static/`, 'eita caraia')
    return masterServerRoute() + `/static/`;
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
          label: "Funções",
          route: "/admin/functionsTypesList",
          icon: "format_list_numbered",
        },
        {
          label: "Lista de atividades",
          route: "/admin/eventsList",
          icon: "format_list_numbered",
        },
        {
          label: "Cardápios",
          route: "/admin/menuList",
          icon: "restaurant_menu",
        },
        {
          label: "Arquivos",
          route: "/admin/archiveList",
          icon: "backup",
        },
      ],
      users: [
        {
          label: "Aguardando aprovação",
          route: "/users/usersWaitingApprovalList",
          icon: "access_time_filled",
        },
        {
          label: "Lista de usuários",
          route: "/users/usersList",
          icon: "group",
        },
        {
          label: "Lista de crianças",
          route: "/users/childrenList",
          icon: "child_care",
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
        {
          label: "Lista de presença",
          route: "/users/attendanceList",
          icon: "list",
        }
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
        {
          label: 'Lista de eventos',
          route: '/social/schoolEventsList',
          icon: 'event'
        },
        {
          label: 'Lista de recados',
          route: '/social/notesList',
          icon: 'note'
        },
      ],
    };
    return obj[type];
  },
};
export default useUtils;
