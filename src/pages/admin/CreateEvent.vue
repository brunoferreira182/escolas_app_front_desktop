<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">
          Nova atividade
        </div>
        <div class="col text-right">
          <q-btn
            @click="createChildEvents"
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
            Atividade
          </q-btn>
        </div>
      </div>
      <q-separator class="q-mx-md" />
      <div class="row justify-around q-pa-md" >
        <div class="col-12 q-gutter-md" align="start">
          <div class="text-h5">
            Preencha os dados
          </div>
          <div class="no-margin q-px-md text-caption"> Atividade realizada por aluno</div>
          <q-input
            outlined
            label="Nome da atividade"
            hint="Ex: Brincou, dormiu, comeu..."
            v-model="eventName"
          />
          <q-input
            outlined
            label="Descrição"
            hint="Ex: Brincou com os colegas, Tirou soneca, Comeu todo o Almoço..."
            v-model="eventDescription"
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
  name: "CreateEvent",
  data() {
    return {
      eventName: '',
      eventDescription: '',
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  methods: {
    createChildEvents() {
      if(this.eventName === '' || this.eventDescription === ''){
        this.$q.notify('Preencha todos os campos para prosseguir.')
        return
      }
      const opt = {
        route: "/desktop/adm/createChildEvents",
        body: {
          name: this.eventName,
          description: this.eventDescription,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente mais tarde.')
          return
        } this.$q.notify('Evento criado com sucesso!')
          this.$router.back()
      });
    },
  },
});
</script>
