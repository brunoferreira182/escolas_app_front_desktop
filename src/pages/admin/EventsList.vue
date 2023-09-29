<template>
  <q-page-container class="no-padding">
    <q-page>
      <q-table
        flat class="bg-accent"
        title="Atividades"
        :columns="columnsData"
        :rows="eventsList"
        row-key="_id"
        @row-click="clkOpenEventDetail"
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
                @keyup="getChildEvents"
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
                @click="$router.push('/admin/createEvent')"
                color="primary"
                unelevated
                no-caps
                rounded
                icon="add"
                class="q-pa-sm"
                label="Nova atividade"
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
              v-else-if="props.row.isActive === 0"
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
import { useTableColumns } from "stores/tableColumns";

export default defineComponent({
  name: "EventsList",
  data() {
    return {
      columnsData: useTableColumns().eventsList,
      eventsList: [],
      organismsConfigsNamesList: [],
      hideDiv: false,
      selectStatus: ["Ativos", "Inativos"],
      filter: "",
      filterRow: [],
      buttonsUser: [
        {label: 'Aprovar como pai', color: 'primary', type: 'user', callback: 'parentAproval'},
        {label: 'Aprovar como interno', color: 'primary', type: 'user', callback: 'internalApproval'},
        {label: 'Aprovar como ambos', color: 'primary', type: 'user', callback: 'bothApproval'},
        {label: 'Recusar', color: 'red-8', type: 'user', callback: 'refused'},
      ],
      buttonsChild: [
        {label: 'Aprovar como criança', color: 'primary', type:'child', callback: 'childApproval'},
        {label: 'Recusar', color: 'red-8', type: 'child', callback: 'refused'},
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
      selectedFilters: {
        parent: false,
        child: false,
      },
      userPermissionsOptions: [],
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount() {
    this.getChildEvents();
  },
  methods: {
    clkOpenEventDetail(e, r){
      const childEventId = r._id
      this.$router.push('/admin/eventDetail?childEventId=' + childEventId)
    },
    nextPage(e) {
      this.pagination.page = e.pagination.page;
      this.pagination.sortBy = e.pagination.sortBy;
      this.pagination.rowsPerPage = e.pagination.rowsPerPage;
      this.getChildEvents();
    },
    getChildEvents() {
      const page = this.pagination.page
      const rowsPerPage = this.pagination.rowsPerPage
      const searchString = this.filter
      const sortBy = this.pagination.sortBy
      const opt = {
        route: "/desktop/adm/getChildEvents",
        body: {
          page: page,
          rowsPerPage: rowsPerPage,
          searchString: searchString,
          sortBy: sortBy,
        },
      };
      useFetch(opt).then((r) => {
        this.eventsList = r.data[0].list
        r.data[0].count[0] ? this.pagination.rowsNumber = r.data[0].count[0].count : this.pagination.rowsNumber = 0
      });
    },

  },
});
</script>
