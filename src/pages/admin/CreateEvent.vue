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
          <q-select
            use-input
            outlined
            label="Selecione as turmas"
            option-label="className"
            v-model="classSelected"
            :options="classesOptions"
            use-chips
            multiple
            input-debounce="0"
            :loading="false"
            :option-value="(item) => item._id"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Nenhum resultado
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.className }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-input
            outlined
            label="Descrição (Opcional)"
            v-model="eventDescription"
          />
          <q-input
            outlined
            label="Adicionar um subtipo de atividade"
            hint="Ex: Muito, pouco, nada..."
            @keydown.enter="addActivitySubtype"
            v-model="eventActivitySubtypeName"
          >
            <template v-slot:after>
              <q-btn round dense flat color="primary" icon="add"  @click="addActivitySubtype" />
            </template>
          </q-input>
          <q-chip
            v-for="(item, index) in activitySubtypes"
            :key="index"
            removable
            @remove="activitySubtypes.splice(index, 1)"
            color="primary"
            text-color="white"
            :label="item"
          />
          <!-- <q-btn
            label="Adicionar status"
            color="primary"
            no-caps
            unelevated
            rounded
            @click="addSubType"
          /> -->
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
      classesOptions: [],
      classSelected: null,
      activitySubtypes: [],
      eventActivitySubtypeName: '',
      pagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
        sortBy: "",
      },
    };
  },
  mounted() {
    this.$q.loading.hide();
    this.getClassesList()
  },
  methods: {
    addActivitySubtype () {
      if (this.eventActivitySubtypeName === '') {
        this.$q.notify('Preencha o campo para adicionar um subtipo de atividade.')
        return
      }
      this.activitySubtypes.push(this.eventActivitySubtypeName)
      this.eventActivitySubtypeName = ''
    },
    getClassesList() {
      const page = this.pagination.page
      const rowsPerPage = this.pagination.rowsPerPage
      const searchString = this.filter
      const sortBy = this.pagination.sortBy
      const opt = {
        route: "/desktop/classes/getClassesList",
        body: {
          page: page,
          rowsPerPage: rowsPerPage,
          searchString: searchString,
          sortBy: sortBy,
        },
      };
      useFetch(opt).then((r) => {
        this.classesOptions = r.data.list
        r.data.count[0] ? this.pagination.rowsNumber = r.data.count[0].count : this.pagination.rowsNumber = 0
      });
    },
    createChildEvents() {
      const extractedData = this.classSelected.map(item => ({
        classId: item._id,
        className: item.className
      }));
      if(this.eventName === ''){
        this.$q.notify('Preencha todos os campos para prosseguir.')
        return
      }
      const opt = {
        route: "/desktop/adm/createChildEvents",
        body: {
          name: this.eventName,
          classesSelected: extractedData,
          description: this.eventDescription,
          activitySubtypes: this.activitySubtypes
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
