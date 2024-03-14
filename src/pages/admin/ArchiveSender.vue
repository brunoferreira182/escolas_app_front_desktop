<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="row q-px-md q-gutter-md items-center">
        <div class="col q-pa-md text-left text-h5">
          Envio de arquivo
        </div>
        <div class="col text-right">
          <q-btn
            color="primary"
            unelevated
            no-caps
            @click = "sendDocumentsToUserById()"
            rounded
            class="q-pa-sm"
            label="Enviar Documento"
            icon="send"
            />
        </div>
      </div>
      <q-separator class="q-mx-md" />
      <div class="row">
        <div class="col-6 q-ma-md q-gutter-y-md">
            <q-file color="teal" filled v-model="fileAttach" label="Escolher arquivo">
              <template v-slot:prepend>
                <q-icon name="cloud_upload" />
              </template>
            </q-file>
            <div
              v-if = "user || user===true" style="border-radius: 20px;"
              class="row items-center text-subtitle2 q-pa-md bg-grey-3">
              <div
                class="col"
              >
                {{ this.user.name }} <br>
                {{ this.user.registerNumber}}
              </div>
              <div class="self-end" >
                <q-btn @click="selectUser(null, true)" class="justify-end" unelevated icon="clear"/>
              </div>
            </div>
        </div>
        <q-separator vertical />
        <div class="col">
          <div class="col q-pa-sm items-center">
            <div class="col q-gutter-lg q-py-sm">
              <q-input
                @keyup="getUsersList"
                outlined
                dense
                debounce="300"
                v-model="filter"
                placeholder="Procurar usuário"
              >
                <template #append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <q-scroll-area style="height: 475px; max-width: 400px;">
                <q-item v-for="(user, i) in userList"
                  :key="user"
                  class="bg-grey-3 cursor-pointer"
                  style="margin-bottom: 3px; border-radius: 15px;"
                  >
                  <q-item-section
                  @click="selectUser(userList[i])"
                  >
                    <q-item-label caption>{{ userList[i].name }}</q-item-label>
                  </q-item-section>
                </q-item>
            </q-scroll-area>
          </div>
        </div>
      </div>
    </q-page>
  </q-page-container>
</template>

<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";

export default defineComponent({
  name: "ArchiveSender",
  data() {
    return {
      fileAttach: null,
      userList: [],
      user: null,
      userId: null,
      pagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
        sortBy: "",
      },
      filter: "",
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount() {
    this.getUsersList();
  },
  methods: {
    selectUser(user, clear){
      if (!clear) {
        this.userId = user._id
        this.user = user
        console.log(userId)
      } else{
        this.userid = null
        this.user = null
      }
    },
    nextPage(e) {
      this.pagination.page = e.pagination.page;
      this.pagination.sortBy = e.pagination.sortBy;
      this.pagination.rowsPerPage = e.pagination.rowsPerPage;
      this.getUsersList();
    },
    sendDocumentsToUserById (){
      const file = [{file: this.fileAttach, name:'document'}]
      const opt = {
        route : "/desktop/adm/sendDocumentToUserById",
        body : {
          userId: this.userId
        }
      };
      if (this.fileAttach !== null) opt.file = file
      console.log(opt.file);

      this.$q.loading.show()
      useFetch(opt).then((r) =>{
        this.$q.loading.hide()
        if(r.error) return this.$q.notify('Falha ao enviar documento!')
        else{
          this.$q.notify('Arquivo enviado!')
          this.selectUser(null, true)
          this.fileAttach = null
        }
      })
    },
    getUsersList() {
      const page = this.pagination.page
      const rowsPerPage = this.pagination.rowsPerPage
      const searchString = this.filter
      const sortBy = this.pagination.sortBy
      const opt = {
        route: "/desktop/users/getUsersList",
        body: {
          page: page,
          rowsPerPage: rowsPerPage,
          searchString: searchString,
          sortBy: sortBy,
        },
      };
      useFetch(opt).then((r) => {
        this.userList = r.data.list
        console.log(this.userList);
      });
    },
  },
});
</script>
<style scoped>


.user-list {
  width: 100%;
}
</style>
