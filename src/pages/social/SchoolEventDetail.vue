<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">
          {{ eventName }}
        </div>
        <div class="col text-right q-gutter-x-sm">
          <q-btn
            v-if="isActive === 1"
            @click="dialogInactiveEvent = true"
            rounded
            outline
            color="red-8"
            unelevated
            no-caps
            class="q-pa-sm"
          >
            Inativar evento
          </q-btn>
          <q-btn
            v-if="isActive === 0"
            @click="dialogInactiveEvent = true"
            rounded
            outline
            color="green-8"
            unelevated
            no-caps
            class="q-pa-sm"
          >
            Ativar evento
          </q-btn>
          <q-btn
            @click="updateSchoolEvent"
            rounded
            color="primary"
            unelevated
            no-caps
          >
            {{
              $route.path === "/social/schoolEventDetail"
                ? "Salvar"
                : "Criar"
            }}
            Evento
          </q-btn>
        </div>
      </div>
      <q-separator class="q-mx-md" />
      <div class="row justify-around q-pa-md" >
        <div class="col-12 q-gutter-md" align="start">
          <div class="text-h5">
            Dados do evento
          </div>
          <q-input
            outlined
            label="Nome do evento"
            v-model="eventName"
          />
          <q-input
            outlined
            label="Descrição"
            v-model="eventDescription"
          />
          <q-input
            outlined
            type="date"
            label="Data do evento"
            v-model="eventDate"
          />
          <q-input
            outlined
            prefix="R$"
            fill-mask="0"
            reverse-fill-mask
            label="Valor do evento"
            v-model="paymentValue"
          />
          <q-input
            outlined
            type="date"
            label="Data final para pagamento"
            v-model="deadlinePayment"
          />
          <q-select
            outlined
            label="Tipo de anúncio"
            option-label="label"
            emit-value
            map-options
            :option-value="(item) => item.type"
            v-model="eventTypeSelected"
            :options="exibitionEventType"
            hint="Informe o tipo de exibição deste evento, se será postado no feed ou em forma de story"
          />
          <q-file
            label="Foto para evento - Clique aqui para escolher uma imagem"
            outlined
            v-model="eventImg"
          />
          <q-checkbox
            label="Requer autorização dos pais?"
            v-model="requireParentsPermission"
          />
        </div>
      </div>
      <q-dialog v-model="dialogInactiveEvent" @hide="dialogInactiveEvent = false">
        <q-card style="border-radius: 1rem">
          <q-card-section>
            <div class="text-h6 text-center">
              Tem certeza que deseja {{ isActive ? "inativar" : "ativar" }} essa
              atividade?
            </div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Depois"
              no-caps
              color="primary"
              @click="dialogInactiveEvent"
            />
            <q-btn
              unelevated
              rounded
              label="Confirmar"
              no-caps
              color="primary"
              @click="changeStatusSchoolEvent"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page>
  </q-page-container>
</template>
<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
export default defineComponent({
  name: "SchoolEventDetail",
  data() {
    return {
      eventName: '',
      eventDescription: '',
      requireParentsPermission: false,
      eventDate: '',
      paymentValue: '',
      deadlinePayment: '',
      eventImg: null,
      eventTypeSelected: '',
      exibitionEventType: [
        {label: 'Feed', type:'feed'},
        {label: 'Story', type:'story'},
      ],
      isActive: null,
      dialogInactiveEvent: false,
    };
  },
  mounted() {
    this.$q.loading.hide();
    this.getSchoolEventDetail()
  },
  methods: {
    getSchoolEventDetail() {
      const opt = {
        route: "/desktop/social/getSchoolEventDetail",
        body: {
          schoolEventId: this.$route.query.schoolEventId
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente mais tarde.')
          return
        }
          this.eventName = r.data.eventName,
          this.eventDescription = r.data.eventDescription,
          this.requireParentsPermission = r.data.requireParentsPermission,
          this.eventDate = r.data.eventDate,
          this.paymentValue = r.data.paymentValue,
          this.isActive = r.data.isActive
          this.deadlinePayment = r.data.deadlinePayment,
          this.eventTypeSelected = r.data.eventTypeSelected
      });
    },
    changeStatusSchoolEvent() {
      const opt = {
        route: "/desktop/social/changeStatusSchoolEvent",
        body: {
          schoolEventId: this.$route.query.schoolEventId
        },
      };
      switch(this.isActive){
        case 1:
          opt.body.isActive = 'inactive'
        break;
        case 0:
          opt.body.isActive = 'active'
        break;
      }
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente mais tarde.')
          return
        }
          this.$router.back()
      });
    },
    updateSchoolEvent() {
      const files = [{file:this.eventImg,name:'eventImg'}]
      if(
        this.eventName === '' ||
        this.eventDescription  === '' ||
        this.eventDate === '' ||
        this.paymentValue === '' ||
        this.deadlinePayment === '' ||
        this.eventTypeSelected === ''
      ){
        this.$q.notify('Preencha todos os campos para prosseguir')
        return
      }
      const opt = {
        route: "/desktop/social/updateSchoolEvent",
        body: {
          eventName: this.eventName,
          eventDescription: this.eventDescription,
          requireParentsPermission: this.requireParentsPermission,
          eventDate: this.eventDate,
          paymentValue: this.paymentValue,
          deadlinePayment: this.deadlinePayment,
          type: this.eventTypeSelected,
          schoolEventId: this.$route.query.schoolEventId
        },
        file: null
      };
      if(this.eventImg !== null){
        opt.file = files
      }
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente mais tarde.')
          return
        } this.$q.notify('Evento atualizado com sucesso!')
          this.$router.back()
      });
    },
  },
});
</script>
