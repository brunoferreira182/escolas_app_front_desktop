<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">
          {{ noteData.noteName }}
        </div>
        <div class="col text-right q-gutter-x-sm">
          <q-btn
            v-if="isActive === 1"
            @click="dialogInactiveNote = true"
            rounded
            outline
            color="red-8"
            unelevated
            no-caps
            class="q-pa-sm"
          >
            Inativar recado
          </q-btn>
          <q-btn
            v-if="isActive === 0"
            @click="dialogInactiveNote = true"
            rounded
            outline
            color="green-8"
            unelevated
            no-caps
            class="q-pa-sm"
          >
            Ativar recado
          </q-btn>
          <q-btn
            @click="updateNote"
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
      <q-dialog v-model="dialogInactiveNote" @hide="dialogInactiveNote = false">
        <q-card style="border-radius: 1rem">
          <q-card-section>
            <div class="text-h6 text-center">
              Tem certeza que deseja {{ isActive ? "inativar" : "ativar" }} esse
              recado?
            </div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Depois"
              no-caps
              color="primary"
              @click="dialogInactiveNote"
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
  name: "NoteDetail",
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
      isActive: null,
      dialogInactiveNote: false,
    };
  },
  mounted() {
    this.$q.loading.hide();
    this.getNoteDetailById()
  },
  methods: {
    getNoteDetailById() {
      const opt = {
        route: "/desktop/social/getNoteDetailById",
        body: {
          noteId: this.$route.query.noteId
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente mais tarde.')
          return
        }this.noteData = r.data
        this.noteData.date = r.data.remaningDate
        this.isActive = r.data.isActive
      });
    },
    changeStatusSchoolEvent() {
      const opt = {
        route: "/desktop/social/changeNoteStatus",
        body: {
          noteId: this.$route.query.noteId
        },
      };
      switch(this.isActive){
        case 1:
          opt.body.isActive = 0
        break;
        case 0:
          opt.body.isActive = 1
        break;
      }
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente mais tarde.')
          return
        }
          this.$q.notify('Nota atualizada com sucesso')
          this.$router.back()
      });
    },
    updateNote() {
      if(this.noteData.noteName === '' || this.noteData.noteDescription === '' || this.noteData.date === ''){
        this.$q.notify('Preencha todos os campos para prosseguir')
        return
      }
      const opt = {
        route: "/desktop/social/updateNote",
        body: {
          noteData: this.noteData,
          noteId: this.$route.query.noteId
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente mais tarde.')
          return
        } this.$q.notify('Recado criado com sucesso!')
          this.$router.back()
      });
    },
  },
});
</script>
