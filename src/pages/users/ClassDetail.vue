<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">
          {{ classData.name }}
          <div class="text-caption">Detalhe da classe</div>
        </div>
        <div class="col text-right q-gutter-x-sm">
          <q-btn
            v-if="isActive === 1"
            @click="dialogInactiveClass = true"
            rounded
            outline
            color="red-8"
            unelevated
            no-caps
            class="q-pa-sm"
          >
            Inativar classe
          </q-btn>
          <q-btn
            v-if="isActive === 0"
            @click="dialogInactiveClass = true"
            rounded
            outline
            color="green-8"
            unelevated
            no-caps
            class="q-pa-sm"
          >
            Ativar classe
          </q-btn>
          <q-btn
            rounded
            color="primary"
            unelevated
            no-caps
          >
            {{
              $route.path === "/users/classDetail"
                ? "Salvar"
                : "Criar"
            }}
            turma
          </q-btn>
        </div>
      </div>
      <q-separator class="q-mx-md" />
      <q-tabs
        v-model="tab"
        dense
        no-caps
        class="text-grey q-py-sm"
        active-color="primary"
        indicator-color="primary"
        inline-label
        align="justify"
        narrow-indicator
      >
        <q-tab name="infos" label="Informações"/>
        <q-tab name="manageClass" label="Gerenciar turma" />
        <!-- <q-tab
          name="solicitations"
          label="Solicitações"
        /> -->
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="infos">
          <div class="row justify-around q-pa-md" >
            <div class="col-12 q-gutter-md" align="start">
              <q-select
                outlined
                label="Tipo"
                option-label="label"
                emit-value
                map-options
                :option-value="(item) => item.type"
                v-model="typeSelected"
                hint="Especifique se a turma é semestral ou anual"
                :options="classType"
              />
              <q-select
                v-if="typeSelected === 'semesterly'"
                outlined
                label="Semestre da turma"
                option-label="label"
                emit-value
                map-options
                :option-value="(item) => item.semester"
                v-model="semesterSelected"
                hint="Informe o semestre"
                :options="classSemester"
              />
              <q-input
                v-if="typeSelected === 'semesterly' || typeSelected === 'yearly'"
                outlined
                label="Ano"
                hint="Informe o ano vigente"
                v-model="yearSelected"
              />
            </div>
            <q-dialog v-model="dialogInactiveClass" @hide="dialogInactiveClass = false">
              <q-card style="border-radius: 1rem">
                <q-card-section>
                  <div class="text-h6 text-center">
                    Tem certeza que deseja {{ isActive ? "inativar" : "ativar" }} essa
                    classe?
                  </div>
                </q-card-section>
                <q-card-actions align="center">
                  <q-btn
                    flat
                    label="Depois"
                    no-caps
                    color="primary"
                    @click="dialogInactiveClass"
                  />
                  <q-btn
                    unelevated
                    rounded
                    label="Confirmar"
                    no-caps
                    color="primary"
                    @click="isActive ? inactivateClassById() : activateClassById()"
                  />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </div>
        </q-tab-panel>
        <q-tab-panel name="manageClass" class="no-padding">
          <div class="row justify-around q-pa-md" >
            <div class="col-6 q-gutter-md" align="start">
              <div class="text-h5 q-mt-lg">
                Alunos
                <q-btn icon="history" flat color="primary">
                  <q-tooltip>Histórico</q-tooltip>
                </q-btn>
              </div>
              <q-item
                style="border-radius: 0.5rem;"
                class="bg-grey-3 q-ma-xs"
                dense
              >
                <q-item-section avatar>
                  <q-avatar rounded>
                    <img src="https://cdn.quasar.dev/img/avatar.png" />
                  </q-avatar>
                </q-item-section>
                <q-item-section class="text-wrap" lines="2">
                  nome
                  <div class="text-caption text-grey-7" >
                    Data início:
                    222222
                  </div>
                  <div
                    class="text-caption text-grey-7"
                  >
                    Data Fim: 123123
                  </div>
                </q-item-section>
                <q-item-section side >
                  <div class="text-grey-8 q-gutter-xs">
                    <q-btn
                      @click="insertObservation(user)"
                      class="gt-xs"
                      size="12px"
                      color="secondary"
                      flat
                      dense
                      round
                      icon="library_books"
                    >
                      <q-tooltip> Observações </q-tooltip>
                    </q-btn>
                    <q-btn
                      @click="deleteUserFromFunction(user)"
                      class="gt-xs"
                      size="12px"
                      color="red-8"
                      flat
                      dense
                      round
                      icon="delete"
                    >
                      <q-tooltip> Deletar usuário da turma </q-tooltip>
                    </q-btn>
                  </div>
                </q-item-section>
              </q-item>
              <q-list>
              </q-list>
            </div>
            <q-separator vertical />
            <div class="col-6 q-gutter-md" align="start">
              <q-table
                flat
                class="bg-accent"
                title="Usuários"
                :columns="columnsData"
                :rows="usersList"
                row-key="_id"
                @row-click="clkManageUser"
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
                        @keyup="getChildrenNotInClass"
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
                  </div>
                </template>
              </q-table>
            </div>
          </div>
          <q-dialog v-model="dialogInsertStudent.open" @hide="clearDialog()">
            <q-card style="border-radius: 1rem">
              <q-card-section>
                <div class="text-h6 text-center">
                  Deseja confirmar a inserção deste aluno na turma?
                </div>
              </q-card-section>
              <q-card-actions align="center">
                <q-btn
                  flat
                  label="Depois"
                  no-caps
                  color="primary"
                  @click="clearDialog"
                />
                <q-btn
                  unelevated
                  rounded
                  label="Confirmar"
                  no-caps
                  color="primary"
                  @click="addChildToClass"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </q-tab-panel>
      </q-tab-panels>
    </q-page>
  </q-page-container>
</template>
<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
import { useTableColumns } from "stores/tableColumns";
export default defineComponent({
  name: "ClassDetail",
  data() {
    return {
      columnsData: useTableColumns().usersListInsideClass,
      tab: 'infos',
      classData: {
        name: '',
      },
      filter: "",
      dialogInactiveClass: false,
      yearSelected: '',
      semesterSelected: '',
      typeSelected: '',
      isActive: null,
      classType: [
        { label: 'Anual', type: 'yearly' },
        { label: 'Semestral', type: 'semesterly' },
      ],
      classSemester: [
        { label: 'Semestre 1', semester: 1},
        { label: 'Semestre 2', semester: 2 },
      ],
      pagination: {
        page: 1,
        rowsPerPage: 100,
        rowsNumber: 0,
        sortBy: "",
      },
      dialogInsertStudent: {
        open: false,
        data: {}
      },
      usersList: [],
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount() {
    this.getClassDetailById()
    this.getChildrenNotInClass()
  },
  methods: {
    clearDialog(){
      this.dialogInsertStudent.open = false
      this.dialogInsertStudent.data = {}
    },
    clkManageUser(e, r){
      this.dialogInsertStudent.data = r
      this.dialogInsertStudent.open = true
    },
    nextPage(e) {
      this.pagination.page = e.pagination.page;
      this.pagination.sortBy = e.pagination.sortBy;
      this.pagination.rowsPerPage = e.pagination.rowsPerPage;
      this.getChildrenNotInClass();
    },
    addChildToClass() {
      const opt = {
        route: "/desktop/classes/addChildToClass",
        body: {
          childId: this.dialogInsertStudent.data.childId,
          classId: this.$route.query.classId
        },
      };
      useFetch(opt).then((r) => {
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente mais tarde.')
          return
        }else{
          this.clearDialog()
          this.$q.notify('Usuário inserido na turma')
          this.getChildrenNotInClass()
        }
      });
    },
    getChildrenNotInClass() {
      const page = this.pagination.page
      const rowsPerPage = this.pagination.rowsPerPage
      const searchString = this.filter
      const sortBy = this.pagination.sortBy
      const opt = {
        route: "/desktop/classes/getChildrenNotInClass",
        body: {
          page: page,
          rowsPerPage: rowsPerPage,
          searchString: searchString,
          sortBy: sortBy,
        },
      };
      useFetch(opt).then((r) => {
        this.usersList = r.data[0].list
        r.data[0].count[0] ? this.pagination.rowsNumber = r.data[0].count[0].count : this.pagination.rowsNumber = 0
      });
    },
    getClassDetailById() {
      const opt = {
        route: "/desktop/classes/getClassDetailById",
        body: {
          classId: this.$route.query.classId
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente mais tarde.')
          return
        }
        this.isActive = r.data.isActive
        if(r.data.classData.type === 'semesterly'){
          this.typeSelected = 'semesterly'
          this.classData.name = r.data.className
          this.yearSelected = r.data.classData.yearSelected
          this.semesterSelected = r.data.classData.semesterSelected
        }else if(r.data.classData.type === 'yearly'){
          this.typeSelected = 'yearly'
          this.classData.name = r.data.className
          this.yearSelected = r.data.classData.yearSelected
        }
      });
    },
    activateClassById() {
      console.log('cuzinho moreno')
      const opt = {
        route: "/desktop/classes/activateClassById",
        body: {
          classId: this.$route.query.classId
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente mais tarde.')
          return
        } this.$q.notify('Classe inativada com sucesso!')
          this.$router.back()
      });
    },
    inactivateClassById() {
      console.log('cuzinho moreno')
      const opt = {
        route: "/desktop/classes/inactivateClassById",
        body: {
          classId: this.$route.query.classId
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente mais tarde.')
          return
        } this.$q.notify('Classe inativada com sucesso!')
          this.$router.back()
      });
    },
  },
});
</script>
