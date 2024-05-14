<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">
          Novo cardápio
        </div>
        <div class="col text-right">
          <q-btn
            @click="createMenu"
            rounded
            color="primary"
            unelevated
            no-caps
          >
            {{
              $route.path === "/admin/eventDetail"
                ? "Salvar"
                : "Criar"
            }}
            Cardápio
          </q-btn>
        </div>
      </div>
      <q-separator class="q-mx-md" />
      <div class="row justify-around q-pa-md" >
        <div class="col-12 q-gutter-md" align="start">
          <div class="text-h5">
            Preencha os dados
          </div>
          <div class="no-margin q-px-md text-caption"> Cardápio</div>
          <q-input
            outlined
            readonly
            :label=" label"
          >
            <template v-slot:append>
              <q-icon class="q-pa-md cursor-pointer" name="event">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="menuDate" range>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <div>
            <q-btn
              class="q-mr-xs"
              flat
              no-caps
              color="primary"
              :label="buttonText"
              @click="clkAddAttachment"
            />
          </div>
          <!-- <div class="text-subtitle">
            Insira o cardápio abaixo
          </div>
          <q-file color="teal" filled v-model="fileAttach" label="Escolher arquivo">
            <template v-slot:prepend>
              <q-icon name="cloud_upload" />
            </template>
          </q-file> -->
        </div>
      </div>

      <PhotoHandler
        :start="startPhotoHandler"
        :camera="true"
        :gallery="true"
        :documents="true"
        :noCrop="false"
        @captured="captured"
        @cancel="cancelPhotoHandler"
      />

    </q-page>
  </q-page-container>
</template>

<script setup>
import { format } from 'date-fns';
import useFetch from "../../boot/useFetch";
import PhotoHandler from '../../components/PhotoHandler.vue'
import { defineComponent } from "vue";
</script>
<script>


export default defineComponent({
  name: "CreateMenu",
  data() {
    return {
      // menuName: '',
      // menuContent: '',
      menuDate: {
        from: '',
        to: ''
      },
      fileSelected: null,
      label: '',
      buttonText: 'Escolher arquivo',
      startPhotoHandler: false
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  watch:{
    menuDate:{
      handler: 'dateFormater',
      deep: true
    }
  },
  methods: {
    captured(img, imgBlob, fileName) {
      console.log(img, imgBlob, fileName, 'auauau')
      this.startPhotoHandler = false
      this.fileSelected = {
        file: imgBlob,
        name: fileName
      }
      this.buttonText = fileName
    },
    clkAddAttachment () {
      this.startPhotoHandler = true
    },
    cancelPhotoHandler () {
      this.startPhotoHandler = false
    },
    dateFormater(){
      if (this.menuDate && this.menuDate.from && this.menuDate.to){
        const fromDate = format(this.menuDate.from, 'dd/MM/yyyy');
        const toDate = format(this.menuDate.to, 'dd/MM/yyyy');
        this.label= `Data do cardápio: ${fromDate} até ${toDate}`
      }else if (this.menuDate && this.menuDate !== null){
        const formattedDate = format(this.menuDate, 'dd/MM/yyyy');
        this.label= `Data do cardápio: ${formattedDate}`
      }
    },
    createMenu() {
      if(this.menuDate.from === '' || this.menuDate.to === ''){
        this.$q.notify('Preencha a Data de aplicação do cardápio!')
        return
      }
      if (this.menuDate && this.menuDate.from && this.menuDate.to) {
        // Range date format sempre verificar o objeto inteiro
        this.menuDate.from = format(this.menuDate.from, 'yyyy/MM/dd');
        this.menuDate.to = format(this.menuDate.to, 'yyyy/MM/dd');
      } else {
        // Single date format
        this.menuDate = format(this.menuDate, 'yyyy/MM/dd');
      }
      const opt = {
        route: "/desktop/adm/createMenu",
        body: {
          menuDate: this.menuDate
        },
        file: [ this.fileSelected ]
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente mais tarde.')
          return
        } this.$q.notify('Cardápio criado com sucesso!')
          this.$router.back()
      });
    },
  },
});
</script>
