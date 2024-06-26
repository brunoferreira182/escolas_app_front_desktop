<template>
  <q-page-container class="no-padding">
    <q-page>
      <q-table
        flat class="bg-accent"
        title="Departamentos"
        :columns="columnsData"
        :rows="departmentsList"
        row-key="_id"
        @row-click="clkDepartment"
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
            <!-- <div class="col">
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
            </div> -->
            <div class="col text-right">
              <q-btn
                @click="$router.push('/admin/newDepartment')"
                color="primary"
                unelevated
                no-caps
                rounded
                icon="add"
                class="q-pa-sm"
                label="Novo departamento"
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
  name: "DepartmentsList",
  data() {
    return {
      gif,
      columnsData: useTableColumns().departmentsList,
      departmentsList: [],
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
    this.getDepartments();
  },
  methods: {
    clkDepartment(e, r) {
      this.$router.push('/admin/departmentDetail?departmentId=' + r.departmentId)
    },
    async getDepartments () {
      const opt = {
        route: "/desktop/adm/getDepartments",
        body: {
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage,
          searchString: this.filter,
          sortBy: this.pagination.sortBy,
        },
      };
      const r = await useFetch(opt)
      this.departmentsList = r.data.list
      this.pagination.page++
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
