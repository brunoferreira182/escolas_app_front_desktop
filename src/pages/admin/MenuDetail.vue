<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5">
          {{ menuName }}
          <!-- {{ menuDate.from }} a {{ menuDate.to}} -->
          <div class="text-caption">Detalhe do cardápio</div>
        </div>
        <div class="col text-right q-gutter-x-sm">
          <q-btn
            v-if="isActive === 1"
            @click="dialogInactiveMenu = true"
            rounded
            outline
            color="red-8"
            unelevated
            no-caps
          >
            Inativar cardápio
          </q-btn>
          <q-btn
            v-if="isActive === 0"
            @click="dialogInactiveMenu = true"
            rounded
            outline
            color="green-8"
            unelevated
            no-caps
          >
            Ativar cardápio
          </q-btn>
          <q-btn
            @click="updateMenu"
            rounded
            color="primary"
            unelevated
            no-caps
          >
            {{
              $route.path === "/admin/menuDetail"
                ? "Salvar"
                : "Criar"
            }}
            cardápio
          </q-btn>
        </div>
      </div>
      <q-separator class="q-mx-md" />
      <div class="row justify-around q-pa-md" >
        <div class="col-12 q-gutter-md" align="start">
          <q-img :src="utils.makeFileUrl(fileAttach.filename)" v-if="fileAttach"/>
        </div>
      </div>
      <q-dialog v-model="dialogInactiveMenu" @hide="dialogInactiveMenu = false">
        <q-card style="border-radius: 1rem">
          <q-card-section>
            <div class="text-h6 text-center">
              Tem certeza que deseja {{ isActive ? "inativar" : "ativar" }} esse
              cardápio?
            </div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Depois"
              no-caps
              color="primary"
              @click="dialogInactiveMenu = false"
            />
            <q-btn
              unelevated
              rounded
              label="Confirmar"
              no-caps
              color="primary"
              @click="isActive ? inactiveMenu() : activeMenu()"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page>
  </q-page-container>
</template>
<script>
import { defineComponent } from "vue";
import { format } from 'date-fns';
import useFetch from "../../boot/useFetch";
import utils from '../../boot/utils'
export default defineComponent({
  name: "MenuDetail",
  data() {
    return {
      utils,
      menuName: '',
      fileAttach: null,
      // menuContent: '',
      menuDate: null,
      formattedDate: '',
      isActive: null,
      dialogInactiveMenu: false,
    };
  },
  mounted() {
    this.$q.loading.hide();
    this.getMenuDetailById()
  },
  methods: {
  inactiveMenu() {
    const opt = {
      route: "/desktop/adm/inactiveMenu",
      body: {
        menuId: this.$route.query.menuId
      },
    };
    this.$q.loading.show();
    useFetch(opt).then((r) => {
      this.$q.loading.hide()
      if(r.error){
        this.$q.notify('Ocorreu um erro, tente novamente mais tarde.')
        return
      } this.$q.notify('Cardápio inativado com sucesso!')
        this.$router.back()
      });
    },
  activeMenu() {
    const opt = {
      route: "/desktop/adm/activeMenu",
      body: {
        menuId: this.$route.query.menuId
      },
    };
    this.$q.loading.show();
    useFetch(opt).then((r) => {
      this.$q.loading.hide()
      if(r.error){
        this.$q.notify('Ocorreu um erro, tente novamente mais tarde.')
        return
      } this.$q.notify('Cardápio ativado com sucesso!')
      this.$router.back()
    });
  },
  getMenuDetailById() {
    const opt = {
      route: "/desktop/adm/getMenuDetailById",
      body: {
        menuId: this.$route.query.menuId
      },
    };
    this.$q.loading.show();
    useFetch(opt).then((r) => {
      this.$q.loading.hide()
      if(r.error){
        this.$q.notify('Ocorreu um erro, tente novamente mais tarde.')
        return
      }
      // this.menuName = r.data.name
      // this.menuContent = r.data.content
      console.log(r.data.date,'data')
      this.menuDate = r.data.date
      this.fileAttach = r.data.file
      this.isActive = r.data.isActive
      this.formatDate()
    });
    
  },
  async formatDate(){
    if (this.menuDate && this.menuDate.from && this.menuDate.to){
        const fromDate = format(this.menuDate.from, 'dd/MM/yyyy');
        const toDate = format(this.menuDate.to, 'dd/MM/yyyy');
      this.menuName = `${fromDate} até ${toDate}`
    }
    // else if (this.menuDate && this.menuDate !== null){
    //   const formattedDate = format(this.menuDate, 'dd/MM/yyyy');
    //   return `${formattedDate}`
    // }
  },
  updateMenu() {
    if(this.menuDate.from ==='' && this.menuDate.from ===''){
      this.$q.notify('Preencha a data de uso do cardápio.')
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
    // if(this.menuName === '' || this.menuContent === '' || this.menuDate === ''){
    //   this.$q.notify('Preencha todos os campos para prosseguir.')
    //   return
    // }
    const file = [{file: this.fileAttach, Name:'menu'}]
    const opt = {
      route: "/desktop/adm/updateMenu",
      body: {
        // name: this.menuName,
        // content: this.menuContent,
        menuDate: this.menuDate,
        menuId: this.$route.query.menuId
      },
    };
    if(this.fileAttach !== null) opt.file= file
    this.$q.loading.show();
    useFetch(opt).then((r) => {
      this.$q.loading.hide()
      if(r.error){
        this.$q.notify('Ocorreu um erro, tente novamente mais tarde.')
        return
      } this.$q.notify('Cardápio atualizado com sucesso!')
        this.$router.back()
    });
  },
  },
});
</script>
