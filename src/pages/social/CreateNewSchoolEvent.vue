<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">
          Novo evento
        </div>
        <div class="col text-right">
          <q-btn
            @click="createNewSchoolEvent"
            rounded
            color="primary"
            unelevated
            no-caps
          >
            {{
              $route.path === "/social/eventDetail"
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
            Preencha os dados
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
            mask="#.##"
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
    </q-page>
  </q-page-container>
</template>
<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
export default defineComponent({
  name: "CreateNewSchoolEvent",
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
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  methods: {
    createNewSchoolEvent() {
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
        route: "/desktop/social/createNewSchoolEvent",
        body: {
          eventName: this.eventName,
          eventDescription: this.eventDescription,
          requireParentsPermission: this.requireParentsPermission,
          eventDate: this.eventDate,
          paymentValue: this.paymentValue,
          deadlinePayment: this.deadlinePayment,
          type: this.eventTypeSelected
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
        } this.$q.notify('Evento criado com sucesso!')
          this.$router.back()
      });
    },
  },
});
</script>
