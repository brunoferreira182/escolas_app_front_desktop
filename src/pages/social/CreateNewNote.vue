<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">
          Novo recado
        </div>
        <div class="col text-right">
          <q-btn
            @click="createNote"
            rounded
            color="primary"
            unelevated
            no-caps
          >
            {{
              $route.path === "/social/noteDetail"
                ? "Salvar"
                : "Criar"
            }}
            Recado
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
            label="Nome do recado"
            v-model="noteData.noteName"
          />
          <q-input
            outlined
            label="Descrição"
            autogrow
            v-model="noteData.noteDescription"
          />
          <q-select
            outlined
            label="Tempo de duração do recado"
            option-label="label"
            emit-value
            map-options
            :option-value="(item) => item.type"
            v-model="noteData.date"
            :options="noteExpirationTime"
            hint="Informe quanto tempo o recado ficará visível"
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
  name: "CreateNewNote",
  data() {
    return {
      noteData: {
        noteName: '',
        noteDescription: '',
        date: '',
      },
      noteExpirationTime: [
        { label: '12 horas',type:'12 horas' },
        { label: '1 dia', type:'1 dia' },
        { label: '2 dias',type:'2 dias' },
        { label: '7 dias',type:'7 dias'},
      ],
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  methods: {
    createNote() {
      if(this.noteData.noteName === '' || this.noteData.noteDescription === '' || this.noteData.date === ''){
        this.$q.notify('Preencha todos os campos para prosseguir')
        return
      }
      const opt = {
        route: "/desktop/social/createNote",
        body: {
          noteData: this.noteData,
          resume: {
            title:  this.noteData.noteName,
            noteDescription: this.noteData.noteDescription,
            noteDate: this.noteData.date,
          }
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(!r.error){
          this.$q.notify('Recado criado com sucesso!')
          this.$router.back()
          return
        }
        this.$q.notify('Ocorreu um erro, tente novamente mais tarde.')
      });
    },
  },
});
</script>
