<template>
  <q-page-container class="no-padding">
    <q-page>
          <div class="row no-margin-top q-pl-lg justify-between">
            <h5 dense> Lista de presença</h5>
            <div class="row items-center q-pr-lg q-gutter-sm ">
              <q-input
                outlined
                dense
                @input="getChildrenByClass()"
                type="date"
                v-model= "filterDate"
                label= "Escolha a data"
              />
              <q-input
                @keyup="getChildrenByClass()"
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
              style="min-width: 105px;"
              outlined dense
              v-model="classFilter"
              :options="classesList"
              option-value="className"
              option-label="className"
              label="Turmas"
              />
            </div>
          </div>
          <q-tab-panel>
            <div class="q-pa-md">
              <q-table
                flat
                :rows="attendance"
                :columns="columns"
                row-key="_id"
                virtual-scroll
                no-data-label="Nenhum dado inserido até o momento"
                no-results-label="A pesquisa não retornou nenhum resultado"
                :rows-per-page-options="[0]"
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
          </q-tab-panel>
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
      classFilter: {className: ''},
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
      classesList: [],
      attendance: []
    };
  },
  beforeMount() {
    this.getChildrenByClass()
    this.getClassesList()
  },
  watch: {
    filterDate: {
      handler(newDate, oldDate) {
        if (newDate !== oldDate) {
          this.getChildrenByClass();
        }
      },
    },
    classFilter: {
      handler(newFilter, oldFilter) {
        if (newFilter.className !== oldFilter.className) {
          this.getChildrenByClass();
        }
      },
    },
  },
  methods: {
    async getChildrenByClass(){
      const opt = {
        route :  '/desktop/users/getAttendanceList',
        body : {
          filterDate: this.filterDate,
          page : this.pagination.page,
          rowsPerPage : 50,
          searchString : this.filter,
          classFilter : this.classFilter.className
        },
      }
      console.log('body',opt);
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(!r.data){
          this.$q.notify(r.error)
          return
        }
        this.$q.loading.hide()
        this.attendance = r.data[0].list
        console.log('filtro de turma', this.classFilter.className);
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
            className: classItem.className,
        }))
        this.classesList = list
        this.pagination.rowsNumber = r.data.count[0]?.count || 0;
        console.log('lista de turma',this.classesList);
      });
    }
  }
})
  </script>
