<template>
  <q-page-container class="no-padding">
    <q-page>
      <q-table
        flat class="bg-accent"
        title="Solicitações em aberto"
        :columns="columnsData"
        :rows="solicitations"
        row-key="_id"
        @row-click="clkSolicitation"
        virtual-scroll
        rows-per-page-label="Registros por página"
        no-data-label="Nenhum dado inserido até o momento"
        no-results-label="A pesquisa não retornou nenhum resultado"
        :rows-per-page-options="[10, 20, 30, 50]"
        :filter="filter"
        v-model:pagination="pagination"
        @request="nextPage"
      >
        <template #body-cell-status="props">
          <q-td :props="props">
            <q-chip
              outline
              :color="`${ props.row.status === 'inTreatment' ? 'green-8' : 'yellow-8'}`"
              size="14px"
            >
              {{  props.row.status === 'inTreatment' ? 'Em aberto' : 'Não lido' }}
            </q-chip>
            <!-- <q-chip
              outline
              v-if="props.row.isActive === 0"
              color="red-8"
              size="14px"
            >
              Inativo
            </q-chip> -->
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
  name: "SolicitationsOpened",
  data() {
    return {
      gif,
      columnsData: useTableColumns().solicitationsOpenedList,
      solicitations: [],
      filter: "",
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
  },
  beforeMount() {
    this.getSolicitations();
  },
  methods: {
    clkSolicitation (a, b) {
      this.$router.push('/departments/solicitationDetails?solicitationId=' + b.solicitationId)
    },
    async getSolicitations () {
      const opt = {
        route: "/desktop/solicitations/getSolicitations",
        body: {
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage,
          searchString: this.filter,
          sortBy: this.pagination.sortBy,
          isActive: '1',
          status: ['notRead', 'inTreatment']
        },
      };
      const r = await useFetch(opt)
      this.solicitations = r.data.list
      this.pagination.rowsNumber = r.data.count
      this.pagination.page++
    },
    nextPage(e) {
      this.pagination.page = e.pagination.page;
      this.pagination.sortBy = e.pagination.sortBy;
      this.pagination.rowsPerPage = e.pagination.rowsPerPage;
      this.getSolicitations();
    },
  },
});
</script>
