<template>
  <q-page-container class="no-padding">
    <q-page>
      <q-table
        flat class="bg-accent"
        title="Cardápios"
        :columns="columnsData"
        :rows="menuList"
        row-key="_id"
        @row-click="clkOpenMenuDetail"
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
                @keyup="getMenuList"
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
                @click="$router.push('/admin/createMenu')"
                color="primary"
                unelevated
                no-caps
                rounded
                icon="add"
                class="q-pa-sm"
                label="Novo cardápio"
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
import { format } from 'date-fns';
import useFetch from "../../boot/useFetch";
import { useTableColumns } from "stores/tableColumns";

export default defineComponent({
  name: "MenuList",
  data() {
    return {
      columnsData: useTableColumns().menuList,
      menuList: [],
      selectStatus: ["Ativos", "Inativos"],
      filter: "",
      filterRow: [],
      selectFilter: null,
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
    this.getMenuList();
  },
  methods: {
    clkOpenMenuDetail(e, r){
      const menuId = r._id
      this.$router.push('/admin/menuDetail?menuId=' + menuId)
    },
    nextPage(e) {
      this.pagination.page = e.pagination.page;
      this.pagination.sortBy = e.pagination.sortBy;
      this.pagination.rowsPerPage = e.pagination.rowsPerPage;
      this.getMenuList();
    },
    getMenuList() {
      const page = this.pagination.page
      const rowsPerPage = this.pagination.rowsPerPage
      const searchString = this.filter
      const sortBy = this.pagination.sortBy
      const opt = {
        route: "/desktop/adm/getMenuList",
        body: {
          page: page,
          rowsPerPage: rowsPerPage,
          searchString: searchString,
          sortBy: sortBy,
        },
      };
      useFetch(opt).then((r) => {
        this.menuList = r.data[0].list
        r.data[0].count[0] ? this.pagination.rowsNumber = r.data[0].count[0].count : this.pagination.rowsNumber = 0

        this.menuList.forEach((menu) => {
          if (menu.date && menu.date.from && menu.date.to) {
            // Range date format sempre verificar o objeto inteiro
            const formattedFrom = format(menu.from, 'dd/MM/yyyy');
            const formattedTO = format(menu.to, 'dd/MM/yyyy');
            menu.date.from = formattedFrom
            menu.date.to = formattedTO
          } else {
            // Single date format
            const formattedList = format(menu, 'dd/MM/yyyy');
            menu.date =
          }

        })
      });
    },

  },
});
</script>
