<template>
<q-page-container class="no-padding">
  <q-page>
    <div class="q-pa-md q-ml-sm row justify-between">
      <div class="col-6 text-h5 text-capitalize">Rematrícula</div>
      <div class="col text-right q-gutter-x-sm">
        <q-btn
          v-if="registrationData.isActive === 1"
          @click="dialogInactiveFunction = true"
          rounded
          outline
          color="red-8"
          unelevated
          no-caps
          class="q-pa-sm"
        >
          Inativar rematrícula
        </q-btn>
        <q-btn
          v-if="registrationData.isActive === 0"
          @click="dialogInactiveFunction = true"
          rounded
          outline
          color="green-8"
          unelevated
          no-caps
          class="q-pa-sm"
        >
          Ativar rematrícula
        </q-btn>
        <q-btn
          @click="updateRegistration"
          rounded
          color="primary"
          unelevated
          no-caps
        >
          {{
            $route.path === "/admin/registrationDetail" ? "Salvar" : "Criar"
          }}
          rematrícula
        </q-btn>
      </div>
    </div>
    <q-separator class="q-mx-md" />
    <div class="row justify-around q-pa-md">
      <div class="col-12 q-gutter-md" align="start">
        <div class="text-h5">Dados</div>

        <q-input
          outlined
          label="Título"
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
      <q-dialog
        v-model="dialogInactiveFunction"
        @hide="dialogInactiveFunction = false"
      >
        <q-card style="border-radius: 1rem">
          <q-card-section>
            <div class="text-h6 text-center">
              Tem certeza que deseja
              {{ isActive ? "inativar" : "ativar" }} essa rematrícula?
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
              @click="isActive ? inactiveStatus() : activeStatus()"
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
name: "RegistrationDetail",
data() {
  return {
    registrationData: {
      title: "",
      description: "",
      initialDate: "",
      finalDate: "",
      periodRef: "",
    },
    isActive: null,
    dialogInactiveFunction: false,
    canSendMessagesInClassChat: false,
  };
},
mounted() {
  this.$q.loading.hide();
},
beforeMount(){
  this.getRegistrationDetailById()
},
methods: {
  updateRegistration() {
    const opt = {
      route: "/desktop/adm/updateRegistration",
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
      this.$q.loading.hide();
      if (!r.error) {
        this.registrationData = {};
        return;
      }
      this.$q.notify("Ocorreu um erro, tente novamente mais tarde.");
    });
  },
  getRegistrationDetailById() {
    const opt = {
      route: "/desktop/adm/getRegistrationDetailById",
      body: {
        registrationId: this.$route.query.registrationId,
      },
    };
    this.$q.loading.show();
    useFetch(opt).then((r) => {
      this.$q.loading.hide();
      if (!r.error) {
        this.registrationData = r.data
        this.isActive = r.data.isActive
        return;
      }
      this.$q.notify("Ocorreu um erro, tente novamente mais tarde.");
    });
  },
  inactiveStatus() {
    const opt = {
      route: "/desktop/adm/changeRegistrationStatus",
      body: {
        registrationId: this.$route.query.registrationId,
        isActive: 'inactive'
      },
    };
    this.$q.loading.show();
    useFetch(opt).then((r) => {
      this.$q.loading.hide();
      if (!r.error) {
        this.$q.notify("Rematrícula inativada!");
        this.getRegistrationDetailById()
        this.dialogInactiveFunction = false
        return;
      }
      this.$q.notify("Ocorreu um erro, tente novamente mais tarde.");
    });
  },
  activeStatus() {
    const opt = {
      route: "/desktop/adm/changeRegistrationStatus",
      body: {
        registrationId: this.$route.query.registrationId,
        isActive: 'active'
      },
    };
    this.$q.loading.show();
    useFetch(opt).then((r) => {
      this.$q.loading.hide();
      if (!r.error) {
        this.$q.notify("Rematrícula Ativada!");
        this.getRegistrationDetailById()
        this.dialogInactiveFunction = false
        return;
      }
      this.$q.notify("Ocorreu um erro, tente novamente mais tarde.");

    });
  },
 
},
});
</script>
