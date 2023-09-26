<template>
  <q-page-container class="no-padding">
    <q-page>
      <q-table
        flat class="bg-accent"
        title="Turmas"
        :columns="columnsData"
        :rows="classesList"
        row-key="_id"
        @row-click="clkOpenClassDetail"
        virtual-scroll
        rows-per-page-label="Registros por página"
        no-data-label="Nenhum dado inserido até o momento"
        no-results-label="A pesquisa não retornou nenhum resultado"
        :rows-per-page-options="[10, 20, 30, 50]"
        :filter="filter"
        v-model:pagination="pagination"
        @request="nextPage">
        <template #top-right>
          <div class="flex row q-gutter-sm items-center text-right">
            <div class="col">
              <q-select
                outlined
                dense
                label="Filtro"
                debounce="300"
                v-model="selectFilter"
                :options="selectStatus"
                @update:model-value="getClassesList"
              ></q-select>
            </div>
            <div class="col">
              <q-input
                @keyup="getClassesList"
                outlined
                dense
                debounce="300"
                v-model="filter"
                placeholder="Procurar"
              >
                <template #append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="col text-right">
              <q-btn
                @click="$router.push('/users/CreateClass')"
                color="primary"
                unelevated
                no-caps
                rounded
                icon="add"
                class="q-pa-sm"
                label="Nova turma"
                />
            </div>
          </div>
        </template>
        <template #body-cell-status="props">
          <q-td :props="props">
            <q-chip
              outline
              v-if="props.row.isActive === 1"
              color="green-8"
              size="14px"
            >
              Ativo
            </q-chip>
            <q-chip
              outline
              v-if="props.row.isActive === 0"
              color="red-8"
              size="14px"
            >
              Inativo
            </q-chip>
          </q-td>
        </template>
      </q-table>
    </q-page>
  </q-page-container>
</template>
<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
import gif from 'assets/gif.gif'
import { useTableColumns } from "stores/tableColumns";

export default defineComponent({
  name: "ClassesList",
  data() {
    return {
      gif,
      columnsData: useTableColumns().classesList,
      classesList: [],
      organismsConfigsNamesList: [],
      hideDiv: false,
      selectStatus: ["Ativos", "Inativos"],
      filter: "",
      filterRow: [],
      arrayButtons: [
        {label: 'Aprovar como criança', color: 'primary', callback: 'childApproval'},
        {label: 'Aprovar como pai', color: 'primary', callback: 'parentAproval'},
        {label: 'Aprovar como interno', color: 'primary', callback: 'internalApproval'},
        {label: 'Aprovar como ambos', color: 'primary', callback: 'bothApproval'},
        {label: 'Recusar', color: 'red-8', callback: 'refused'},
      ],
      filterBtns: [
        {label: 'Filtrar por pais', color: 'cyan-8', callback: 'parent'},
        {label: 'Filtrar por crianças', color: 'pink-8', callback: 'child'},
      ],
      selectFilter: null,
      dialogOpenSolicitation: {
        open: false,
        data: {},
      },
      pagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
        sortBy: "",
      },
      userPermissionsOptions: [],
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount() {
    this.getClassesList();
  },
  methods: {
    clkOpenClassDetail(e, r){
      const classId = r._id
      this.$router.push('/users/classDetail?classId=' + classId)
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
      switch(this.selectFilter){
        case 'Ativos:':
          opt.body.isActive = 1
        break;
        case 'Inativos:':
          opt.body.isActive = 0
        break;
      }
      useFetch(opt).then((r) => {
        this.classesList = r.data.list
        r.data.count[0] ? this.pagination.rowsNumber = r.data.count[0].count : this.pagination.rowsNumber = 0
      });
    },
    nextPage(e) {
      this.pagination.page = e.pagination.page;
      this.pagination.sortBy = e.pagination.sortBy;
      this.pagination.rowsPerPage = e.pagination.rowsPerPage;
      this.getClassesList();
    },
  },
});
</script>
