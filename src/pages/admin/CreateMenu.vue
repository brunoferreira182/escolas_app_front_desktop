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
          <div class="no-margin q-px-md text-caption"> Cardápio do dia</div>
          <q-input
            outlined
            label="Nome do cardápio"
            hint="Ex: Cardápio segunda-feira"
            v-model="menuName"
          />
          <q-input
            outlined
            label="Data do cardápio"
            type="date"
            v-model="menuDate"
          />
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
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
export default defineComponent({
  name: "CreateMenu",
  data() {
    return {
      menuName: '',
      menuContent: '',
      menuDate: '',
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  methods: {
    createMenu() {
      if(this.menuName === '' || this.menuContent === '' || this.menuDate === ''){
        this.$q.notify('Preencha todos os campos para prosseguir.')
        return
      }
      const opt = {
        route: "/desktop/adm/createMenu",
        body: {
          name: this.menuName,
          content: this.menuContent,
          date: this.menuDate
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
