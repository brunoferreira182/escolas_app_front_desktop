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
            label="Nome do cardápio"
            hint="Ex: Cardápio Feveireiro, semanal do dia"
            v-model="menuName"
          />
          <q-input
            outlined
            readonly
            :label="dateFormater()"
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
          <div class="text-subtitle">
            Insira o cardápio abaixo
          </div>
          <q-editor
            v-model="menuContent"
            min-height="5rem"
          />
        </div>
      </div>
    </q-page>
  </q-page-container>
</template>

<script>
import { format } from 'date-fns';
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
export default defineComponent({
  name: "CreateMenu",
  data() {
    return {
      menuName: '',
      menuContent: '',
      menuDate: null,
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  methods: {
    dateFormater(){
    if (this.menuDate && this.menuDate.from && this.menuDate.to){
        const fromDate = format(this.menuDate.from, 'dd/MM/yyyy');
        const toDate = format(this.menuDate.to, 'dd/MM/yyyy');
      return `Data do cardápio: ${fromDate} até ${toDate}`
    }else if (this.menuDate && this.menuDate !== null){
      const formattedDate = format(this.menuDate, 'dd/MM/yyyy');
      return `Data do cardápio: ${formattedDate}`
    }
    return `Data do cardápio `
  },
    createMenu() {
      if(this.menuName === '' || this.menuContent === '' || this.menuDate === ''){
        this.$q.notify('Preencha todos os campos para prosseguir.')
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
          name: this.menuName,
          content: this.menuContent,
          menuDate: this.menuDate
        },
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
