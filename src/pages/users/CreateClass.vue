<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">
          Nova turma
        </div>
        <div class="col text-right">
          <q-btn
            @click="createNewClass"
            rounded
            color="primary"
            unelevated
            no-caps
          >
            {{
              $route.path === "/users/classDetail"
                ? "Salvar"
                : "Criar"
            }}
            Turma
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
            label="Nome da turma"
            v-model="classData.name"
          />
          <q-select
            outlined
            label="Tipo"
            option-label="label"
            emit-value
            map-options
            :option-value="(item) => item.type"
            v-model="typeSelected"
            hint="Especifique se a turma é semestral ou anual"
            :options="classType"
          />
          <q-select
            v-if="typeSelected === 'semesterly'"
            outlined
            label="Semestre da turma"
            option-label="label"
            emit-value
            map-options
            :option-value="(item) => item.semester"
            v-model="semesterSelected"
            hint="Informe o semestre"
            :options="classSemester"
          />
          <q-input
            v-if="typeSelected === 'semesterly' || typeSelected === 'yearly'"
            outlined
            label="Ano"
            hint="Informe o ano vigente"
            v-model="yearSelected"
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
  name: "CreateClass",
  data() {
    return {
      classData: {
        name: '',
      },
      yearSelected: '',
      semesterSelected: '',
      typeSelected: '',
      classType: [
        { label: 'Anual', type: 'yearly' },
        { label: 'Semestral', type: 'semesterly' },
      ],
      classSemester: [
        { label: 'Semestre 1', semester: 1},
        { label: 'Semestre 2', semester: 2 },
      ],
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  methods: {
    createNewClass() {
      const opt = {
        route: "/desktop/classes/createNewClass",
        body: {
          className: this.classData.name,
          classData: {}
        },
      };
      switch(this.typeSelected){
        case 'semesterly':
          opt.body.classData.type = 'semesterly'
          opt.body.classData.semesterSelected = this.semesterSelected
          opt.body.classData.yearSelected = this.yearSelected
        break;
        case 'yearly':
          opt.body.classData.type = 'yearly'
          opt.body.classData.yearSelected = this.yearSelected
        break;
      }
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente mais tarde.')
          return
        } this.$q.notify('Classe criada com sucesso!')
          this.$router.back()
      });
    },
  },
});
</script>
