<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="row no-margin-top q-pl-lg justify-between">
        <h5 dense> Lista de presença</h5>
        <div class="row items-center q-pr-lg q-gutter-sm ">
          <q-input
            outlined
            dense
            @input="getAttendance"
            type="date"
            v-model= "filterDate"
            label= "Escolha a data"
          />
          <q-input
            @keyup="getAttendance"
            outlined
            dense
            v-model="filter"
            placeholder="Procurar"
            style="max-width: 160px;"
          >
            <template #append>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-select
            style="min-width: 106px;"
            outlined dense
            v-model="classFilter"
            :options="classesList"
            option-value="className"
            label="Turmas"
          />
        </div>
      </div>
      <div class="q-pa-md">
        <q-table
          flat
          :rows="attendance"
          :columns="columns"
          row-key="_id"
          virtual-scroll
          no-data-label="Nenhum dado inserido até o momento"
          no-results-label="A pesquisa não retornou nenhum resultado"
          :rows-per-page-options="[10, 20, 30, 50]"
          v-model:pagination="pagination"
          @request="nextPage"
        >
          <template #body-cell-attendance="props">
            <q-td :props="props">
              <q-badge color="red" v-if="props.row.childAttendanceType === 'absent'">
                Ausente
              </q-badge>
              <q-badge color="green" v-else>
                Presente
              </q-badge>
            </q-td>
          </template>
        </q-table>
      </div>
    </q-page>
  </q-page-container>
</template>

<script setup>
import utils from '../../boot/utils'
</script>

<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
import { useTableColumns } from "stores/tableColumns";

export default defineComponent({
  name: "AttendanceList",
  data() {
    return {
      classFilter: {id:'', className: "-"},
      classesList: [],
      utils,
      columns: useTableColumns().attendanceListClasses,
      filter: "",
      pagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
        sortBy: "",
      },
      filterDate: '',
      attendance: []
    };
  },
  beforeMount() {
    this.getAttendance()
    this.getClassesList()
  },
  watch: {
    filterDate: {
      handler(newDate, oldDate) {
        if (newDate !== oldDate) {
          this.getAttendance();
        }
      },
    },
    classFilter: {
      handler(newFilter, oldFilter) {
        if (newFilter.id !== oldFilter.id) {
          this.getAttendance();
        }
      },
    },
  },
  methods: {
    getAttendance(){
      const opt = {
        route :  '/desktop/users/getAttendanceList',
        body : {
          page : this.pagination.page,
          rowsPerPage : this.pagination.rowsPerPage,
          filterDate: this.filterDate,
          searchString : this.filter,
          classFilter : this.classFilter.id
        },
      }
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        this.attendance = r.data.list
        r.data.count[0] ? this.pagination.rowsNumber = r.data.count[0].count : this.pagination.rowsNumber = 0
      })
    },
    getClassesList() {
      const opt = {
        route: "/desktop/classes/getClassesList",
        body: {
          page : this.pagination.page,
          rowsPerPage : this.pagination.rowsPerPage,
          searchString : this.classFilter,
          sortBy: this.pagination.sortBy,
        }
      }
      this.$q.loading.show()
      useFetch(opt).then(r => {
        this.$q.loading.hide()
        const list = r.data.list.map(classItem => ({
            id: classItem._id,
            className: classItem.className
        }))
        this.classesList = list
        this.pagination.rowsNumber = r.data.count[0]?.count || 0;
      });
    },
    nextPage(e) {
      this.pagination.page = e.pagination.page;
      this.pagination.sortBy = e.pagination.sortBy;
      this.pagination.rowsPerPage = e.pagination.rowsPerPage;
      this.getAttendance();
    },
  }
})
  </script>
