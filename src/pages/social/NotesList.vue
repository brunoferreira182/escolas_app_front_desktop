<template>
  <q-page-container class="no-padding">
    <q-page>
      <q-table
        flat
        class="bg-accent"
        title="Recados"
        :columns="columnsData"
        :rows="notesList"
        row-key="_id"
        @row-click="clkOpenNoteDetail"
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
                @keyup="getNotes"
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
            <!-- <div class="col">
              <q-select dense outlined
                :options= "types"
                v-model= "type"
                emit-value
                map-options
                label="tipo"
              >
              </q-select>
            </div> -->
            <div class="col text-right">
              <q-btn
                @click="$router.push('/social/createNewNote')"
                color="primary"
                unelevated
                no-caps
                rounded
                icon="add"
                class="q-pa-sm"
                label="Novo recado"
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
  name: "NotesList",
  data() {
    return {
      columnsData: useTableColumns().notesList,
      notesList: [],
      selectStatus: ["Ativos", "Inativos"],
      filter: "",
      // types: [
      //   {
      //     label: "Privado",
      //     value: "userNote"
      //   },
      //   {
      //     label: "Escolar",
      //     value: "schoolNote"
      //   },
      //   {
      //     label: "Todos",
      //     value: 'all'
      //   }
      // ],
      // type: '',
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
    this.getNotes();
  },
  methods: {
    clkOpenNoteDetail(e, r){
      const noteId = r._id
      this.$router.push('/social/noteDetail?noteId=' + noteId)
    },
    nextPage(e) {
      this.pagination.page = e.pagination.page;
      this.pagination.sortBy = e.pagination.sortBy;
      this.pagination.rowsPerPage = e.pagination.rowsPerPage;
      this.getNotes();
    },
    getNotes() {
      const page = this.pagination.page
      const rowsPerPage = this.pagination.rowsPerPage
      const searchString = this.filter
      const sortBy = this.pagination.sortBy
      const opt = {
        route: "/desktop/social/getNotes",
        body: {
          page: page,
          rowsPerPage: rowsPerPage,
          searchString: searchString,
          sortBy: sortBy,
        },
      };
      useFetch(opt).then((r) => {
        this.notesList = r.data.list
        r.data.count[0] ? this.pagination.rowsNumber = r.data.count[0].count : this.pagination.rowsNumber = 0
      });
    },
  },
});
</script>
