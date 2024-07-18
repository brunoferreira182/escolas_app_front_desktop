<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">
          Rematrícula
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
            @click="createRegistration"
            rounded
            color="primary"
            unelevated
            no-caps
          >
            {{
              $route.path === "/admin/registrationDetail"
                ? "Salvar"
                : "Criar"
            }}
            rematrícula
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
            label="Título"
            hint="Ex: Representante de classe, professor(a)"
            v-model="registrationData.title"
          />
          <q-input
            outlined
            label="Descrição"
            v-model="registrationData.description"
          />
          <q-input
            outlined
            type="date"
            label="Data início"
            mask="##/##/####"
            v-model="registrationData.initialDate"
          />
          <q-input
            outlined
            type="date"
            mask="##/##/####"
            label="Data fim"
            v-model="registrationData.finalDate"
          />
          <q-input
            outlined
            label="Período de referência"
            v-model="registrationData.periodRef"
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
  name: "NewRegistration",
  data() {
    return {
      registrationData: {
        title:'',
        description:'',
        initialDate:'',
        finalDate:'',
        periodRef:'',
      },
      isActive: null,
      dialogInactiveFunction: false,
      canSendMessagesInClassChat: false
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  methods: {
    createRegistration(){
      const opt = {
        route: "/desktop/adm/createRegistration",
        body: {
          title: this.registrationData.title,
          initialDate: this.registrationData.initialDate,
          finalDate: this.registrationData.finalDate,
          periodRef: this.registrationData.periodRef,
          description: this.registrationData.description,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(!r.error){
          this.registrationData = {}
          this.$q.notify('Rematrícula criada com sucesso!')
          const registrationId = r.data
          this.$router.push('/registrationDetail?registrationId=' + registrationId)
          return
        }
        this.$q.notify('Ocorreu um erro, tente novamente mais tarde.')
      });
    },
  },
});
</script>
