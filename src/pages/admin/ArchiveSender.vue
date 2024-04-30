<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="row q-px-md q-gutter-md items-center">
        <div class="col q-pa-md text-left text-h5">
          Envio de arquivo
        </div>
        <div class="col text-right">
          <div class="row justify-center items-center">
            <div class="col">

            </div>
            <div class="col">
              <q-btn
              color="primary"
              unelevated
              no-caps
              @click = "sendDocumentsToUserById()"
              rounded
              dense
              class="q-pa-sm"
              label="Enviar Documento"
              icon="send"
              />
            </div>
          </div>
        </div>
      </div>
      <q-separator class="q-mx-md" />
      <div class="row">
        <div class="col-6 q-ma-md q-gutter-y-md">
          <q-select
            outlined
            debounce="300"
            :options="typeArch"
            v-model="documentType"
            label="Tipo de arquivo"
          />
          <PhotoHandler
            v-show="startPhotoHandler"
            :start="startPhotoHandler"
            :allFiles="true"
            :noCrop="false"
            @captured="captured"
            @cancel="cancelPhotoHandler"
          />
          <q-btn
            class="q-mr-xs"
            flat
            no-caps
            color="primary"
            label="Clique para inserir um arquivo"
            @click="clkAddAttachment"
          />

          <!-- <q-file outlined v-model="fileAttach" label="Escolher arquivo">
            <template v-slot:prepend>
              <q-icon name="cloud_upload" />
            </template>
          </q-file> -->
          <div v-if= "documentType === 'Boleto' && documentType !== ''" >
            <q-input outlined v-model= "barCode" label= "Código de barras"/>
          </div>
          <div
            v-if="userId"
            style="border-radius: 20px;"
            class="row items-center text-subtitle2 q-pa-md bg-grey-3"
          >
            <div class="col">
              Nome: {{ this.user.name }} <br>
              Registro: {{ this.user.registerNumber}}
            </div>
            <div class="self-end" >
              <q-btn @click="selectUser(null, true)" class="justify-end" unelevated icon="clear"/>
            </div>
          </div>
        </div>
        <q-separator vertical />
        <div class="col">
          <q-table
            flat class="bg-accent"
            :columns="columnsData"
            row-key="_id"
            virtual-scroll
            rows-per-page-label="Registros por página"
            no-data-label="Nenhum dado"
            no-results-label="A pesquisa não retornou nenhum resultado"
            :rows-per-page-options="[10, 20, 30, 50]"
            :filter="filter"
            title="Usuário"
            :rows="userList"
            @row-click="selectUser"
            :virtual-scroll-item-size="48"
            v-model:pagination="pagination"
            @request="nextPage"
          >
            <template #top-right>
              <div class="flex row q-gutter-sm items-center text-right">
                <div class="col" >
                  <q-input
                    @keyup="getUsersList"
                    outlined
                    dense
                    debounce="300"
                    v-model="filter"
                    placeholder="Procurar"
                  >
                    <template #append>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>
              </div>
            </template>
          </q-table>
          <!-- <div class="col q-pa-sm items-center">
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
            <q-scroll-area style="height: 475px; max-width: auto;">
                <q-item v-for="(user, i) in userList"
                  :key="user"
                  class="bg-grey-3 cursor-pointer"
                  style="margin-bottom: 3px;"
                  >
                  <q-item-section
                  @click="selectUser(userList[i])"
                  >
                    <q-item-label caption>{{ userList[i].name }}</q-item-label>
                  </q-item-section>
                </q-item>
            </q-scroll-area>
          </div> -->
        </div>
      </div>
    </q-page>
  </q-page-container>
</template>

<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
import { useTableColumns } from "stores/tableColumns";
// import utils from '../../boot/utils'
import PhotoHandler from '../../components/PhotoHandler.vue'
export default defineComponent({
  components:{
    PhotoHandler
  },
  name: "ArchiveSender",
  data() {
    return {
      typeArch:[
        'Boleto', 'Outros',
      ],
      fileAttach: null,
      userList: [],
      barCode: '',
      user: null,
      documentType: '',

      userId: null,
      pagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
        sortBy: "",
      },
      startPhotoHandler: false,
      filter: "",
      columnsData: useTableColumns().usersListInsideClass,

    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount() {
    this.getUsersList();
  },
  methods: {
    captured(img, imgBlob, fileName) {
      this.step = 'initial'
      this.startPhotoHandler = false
      this.sendDocumentsToUserById({
        file: imgBlob,
        name: fileName,
      })
    },
    clkAddAttachment () {
      this.step = 'addAttachment'
      this.startPhotoHandler = true
    },
    cancelPhotoHandler () {
      this.startPhotoHandler = false
      this.step = 'initial'
    },
    selectUser(user, data){
      this.userId = data._id
      this.user = data
      // if (!clear) {
      //   this.userId = user._id
      //   this.user = user
      //   console.log(userId)
      // } else{
      //   this.userid = null
      //   this.user = null
      // }
    },
    nextPage(e) {
      this.pagination.page = e.pagination.page;
      this.pagination.sortBy = e.pagination.sortBy;
      this.pagination.rowsPerPage = e.pagination.rowsPerPage;
      this.getUsersList();
    },
    sendDocumentsToUserById (file){
      // const file = [{file: this.fileAttach, name:'document'}]
      console.log("🚀 ~ sendDocumentsToUserById ~ file:", file)
      const opt = {
        route : "/desktop/adm/sendFileToUserById",
        body : {
          type: this.documentType,
          userId: this.userId
        }
      };
      if (file.file) {
        opt.file = [ file ]
      }
      // if (this.documentType === 'Boleto' && this.barCode !== ''){
      //   opt.body.barCode = this.barCode
      // }
      // else if (this.documentType === 'Boleto' && this.barCode === ''){
      //   return this.$q.notify('Insíra o código de barras!')
      // }

      this.$q.loading.show()
      useFetch(opt).then((r) =>{
        this.$q.loading.hide()
        if(!r.error){
          this.$q.notify('Arquivo enviado!')
          this.selectUser(null, true)
          this.fileAttach = null
          this.barCode = ''
        }
        else{
          this.$q.notify('Falha ao enviar documento!')
          return
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
