<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">
          Novo tipo de função
        </div>
        <div class="col text-right">
          <q-btn
            @click="createFunction"
            rounded
            color="primary"
            unelevated
            no-caps
          >
            {{
              $route.path === "/admin/functionTypeDetail"
                ? "Salvar"
                : "Criar"
            }}
            tipo de função
          </q-btn>
        </div>
      </div>
      <q-separator class="q-mx-md" />
      <div class="row justify-around q-pa-md" >
        <div class="col-12 q-gutter-md" align="start">
          <div class="text-h5">
            Preencha os dados
          </div>
          <q-input
            outlined
            label="Nome do tipo de função"
            v-model="functionName"
          />
          <q-input
            outlined
            label="Descrição"
            v-model="functionDescription"
          />
          <q-checkbox
            label="Este usuário é administrador ?"
            v-model="isAdm"
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
  name: "CreateFunctionType",
  data() {
    return {
      functionName: '',
      functionDescription: '',
      isAdm: false
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  methods: {
    createFunction() {
      if(this.functionName === '' || this.functionDescription === ''){
        this.$q.notify('Preencha todos os campos para prosseguir.')
        return
      }
      const opt = {
        route: "/desktop/adm/createFunction",
        body: {
          functionName: this.functionName,
          functionDescription: this.functionDescription,
          isAdm: this.isAdm
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente mais tarde.')
          return
        } this.$q.notify('Tipo de função criada com sucesso!')
          this.$router.back()
      });
    },
  },
});
</script>
