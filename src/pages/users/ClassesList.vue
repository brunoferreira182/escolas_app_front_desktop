<template>
  <q-page-container class="no-padding">
    <q-page>
      <q-table
        flat class="bg-accent"
        title="Turmas"
        :columns="columnsData"
        :rows="classesList"
        row-key="_id"
        @row-click="clkOpenSolicitation"
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
              v-if="props.row.status && props.row.status.status === 'active'"
              color="green-8"
              size="14px"
            >
              Ativo
            </q-chip>
            <q-chip
              outline
              v-if="props.row.status && props.row.status.status === 'waitingApproval'"
              color="yellow-8"
              size="14px"
            >
              Aguardando aprovação
            </q-chip>
            <q-chip
              outline
              v-else-if="props.row.status && props.row.status.status === 'refused'"
              color="red-8"
              size="14px"
            >
              Recusado
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
    clkOpenSolicitation(e, r){
      switch(!r.status || r.status.status){
        case 'active':
          this.$q.notify('O usuário está ativo')
        break
        case 'refused':
          this.$q.notify('A solicitação já foi recusada')
        break;
        case 'waitingApproval':
          this.dialogOpenSolicitation.data = r
          this.dialogOpenSolicitation.open = true
        break
      }
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
          descending: 'waitingApproval'
        },
      };
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
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
