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
                @click="sendDocumentsToUserById"
                rounded
                label="Enviar"
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
          <q-input
            v-if="documentType === 'Outros'"
            outlined
            debounce="300"
            v-model="documentTypeEdited"
            label="Informe o nome do arquivo"
          />

          <div v-if= "documentType === 'Boleto' && documentType !== ''" >
            <q-input outlined v-model= "barCode" label= "Código de barras"/>
          </div>
          <q-btn
            class="q-mr-xs"
            flat
            no-caps
            color="primary"
            :label="addFileButtonText"
            @click="clkAddAttachment"
          />
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
        </div>
      </div>

      <PhotoHandler
        :start="startPhotoHandler"
        :camera="true"
        :gallery="true"
        :documents="true"
        :noCrop="true"
        @captured="captured"
        @cancel="cancelPhotoHandler"
      />
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
        'Boleto', 'Outros'
      ],
      documentTypeEdited: '',
      fileSelected: null,
      addFileButtonText: 'Clique para inserir um arquivo',
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
      this.fileSelected = {
        file: imgBlob,
        name: fileName
      }
      this.addFileButtonText = fileName
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
    async sendDocumentsToUserById (file){
      if (!this.fileSelected) {
        this.$q.notify('Insira um arquivo.')
        return
      }
      if (this.documentType === 'Boleto' && this.barCode === ''){
        this.$q.notify('Insíra o código de barras!')
        return
      }
      if(this.documentType === 'Outros'){this.documentType = this.documentTypeEdited}
      const opt = {
        route : "/desktop/adm/sendFileToUserById",
        body : {
          type: this.documentType,
          userId: this.userId,
          resume: {
            title:  this.documentType,
          }
        },
        file: [ this.fileSelected ]
      };
      if (this.documentType === 'Boleto'){
        opt.body.barCode = this.barCode
        opt.body.resume.barCode = this.barCode
      }
      this.$q.loading.show()
      const r = await useFetch(opt)
      this.$q.loading.hide()
      if (!r.error) {
        this.$q.notify('Arquivo enviado!')
        this.selectUser(null, true)
        this.fileSelected = null
        this.addFileButtonText = 'Clique para inserir um arquivo'
        this.documentType = ''
        this.barCode = ''
        return
      }
      this.$q.notify('Falha ao enviar documento!')
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
