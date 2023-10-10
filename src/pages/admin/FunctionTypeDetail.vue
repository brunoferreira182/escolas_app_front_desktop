<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">
          {{ functionName}}
          <div class="text-caption">Detalhe da função</div>
        </div>
        <div class="col text-right q-gutter-x-sm">
          <q-btn
            v-if="isActive === 1"
            @click="dialogInactiveFunction = true"
            rounded
            outline
            color="red-8"
            unelevated
            no-caps
            class="q-pa-sm"
          >
            Inativar função
          </q-btn>
          <q-btn
            v-if="isActive === 0"
            @click="dialogInactiveFunction = true"
            rounded
            outline
            color="green-8"
            unelevated
            no-caps
            class="q-pa-sm"
          >
            Ativar função
          </q-btn>
          <q-btn
            @click="updateFunction"
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
            função
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
            label="Nome da função"
            hint="Ex: Representante de classe, professor(a)"
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
        <q-dialog v-model="dialogInactiveFunction" @hide="dialogInactiveFunction = false">
          <q-card style="border-radius: 1rem">
            <q-card-section>
              <div class="text-h6 text-center">
                Tem certeza que deseja {{ isActive ? "inativar" : "ativar" }} essa
                função?
              </div>
            </q-card-section>
            <q-card-actions align="center">
              <q-btn
                flat
                label="Depois"
                no-caps
                color="primary"
                @click="dialogInactiveFunction"
              />
              <q-btn
                unelevated
                rounded
                label="Confirmar"
                no-caps
                color="primary"
                @click="isActive ? inactivateFunction() : activateFunction()"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </q-page>
  </q-page-container>
</template>
<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
export default defineComponent({
  name: "functionTypeDetail",
  data() {
    return {
      functionName: '',
      functionDescription: '',
      isAdm: false,
      isActive: null,
      dialogInactiveFunction: false,
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount(){
    this.getFunctionDetailById()
  },
  methods: {
    getFunctionDetailById(){
      const opt = {
        route: "/desktop/adm/getFunctionDetailById",
        body: {
          functionId: this.$route.query.functionId
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente mais tarde.')
          return
        }
          this.isAdm = r.data.isAdm
          this.functionName = r.data.name
          this.functionDescription = r.data.description
          this.isActive = r.data.isActive
      });
    },
    inactivateFunction() {
      const opt = {
        route: "/desktop/adm/inactivateFunction",
        body: {
          functionId: this.$route.query.functionId,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente mais tarde.')
          return
        } this.$q.notify('Tipo de função inativada com sucesso!')
          this.$router.back()
      });
    },
    activateFunction() {
      const opt = {
        route: "/desktop/adm/activateFunction",
        body: {
          functionId: this.$route.query.functionId,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente mais tarde.')
          return
        } this.$q.notify('Tipo de função ativada com sucesso!')
          this.$router.back()
      });
    },
    updateFunction() {
      const opt = {
        route: "/desktop/adm/updateFunction",
        body: {
          functionId: this.$route.query.functionId,
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
        } this.$q.notify('Tipo de função atualizada com sucesso!')
          this.$router.back()
      });
    },
  },
});
</script>
