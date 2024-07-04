<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md row justify-between">
        <q-btn
          icon="arrow_back_ios"
          flat
          dense
          @click="$router.back()"
        >
          <q-tooltip>
            Voltar
          </q-tooltip>
        </q-btn>
        <div class="col-6 text-h5 text-capitalize">
          {{ departmentData?.departmentData.name }}
          <div class="text-caption">Detalhe do departamento</div>
        </div>
        <div class="col text-right q-gutter-x-sm">
          <q-btn
            v-if="departmentData?.isActive === 1"
            @click="dialogInactiveDepartment = true"
            rounded
            outline
            color="red-8"
            unelevated
            no-caps
            class="q-pa-sm"
          >
            Inativar departamento
          </q-btn>
          <q-btn
            v-if="departmentData?.isActive === 0"
            @click="dialogInactiveDepartment = true"
            rounded
            outline
            color="green-8"
            unelevated
            no-caps
            class="q-pa-sm"
          >
            Ativar departamento
          </q-btn>
          <q-btn
            rounded
            color="primary"
            unelevated
            @click="clkSave"
            no-caps
            label="Salvar"
          />
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
        <q-tab name="users" label="Pessoas"/>
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="infos" v-if="departmentData">
          <div class="row justify-around q-pa-md" >
            <div class="col-12 q-gutter-md" align="start">

              <q-input
                outlined
                label="Nome"
                v-model="departmentData.departmentData.name"
              />
              <q-input
                outlined
                label="Nome"
                v-model="departmentData.departmentData.description"
              />
            </div>

          </div>
        </q-tab-panel>
        <q-tab-panel name="users" class="no-padding">
          <div class="row justify-around q-pa-md" >
            <div class="col-6 q-gutter-md" align="start">
              <div class="row q-pt-md">
                <div class="col-6 text-h5">Usuários</div>
              </div>
              <div v-if="departmentData?.users">
                <q-item
                  v-for="user in departmentData.users"
                  :key="user._id"
                  style="border-radius: 0.5rem;"
                  class="bg-grey-4 q-ma-sm"
                >
                  <q-item-section avatar>
                      <q-avatar>
                        <img :src="utils.makeFileUrl(user.image)">
                      </q-avatar>
                    </q-item-section>
                  <q-item-section
                    class="text-wrap cursor-pointer"
                    lines="2"
                    @click="clkUser(user)"
                  >
                    {{ user.name }}
                  </q-item-section>
                  <q-item-section side >
                    <div class="text-grey-8 q-gutter-xs">
                      <q-btn
                        @click="clkRemoveUserFromDepartment(user)"
                        class="gt-xs"
                        size="12px"
                        color="red-8"
                        flat
                        dense
                        round
                        icon="delete"
                      >
                        <q-tooltip>Remover usuário do departamento</q-tooltip>
                      </q-btn>
                    </div>
                  </q-item-section>
                </q-item>
              </div>
            </div>
            <q-separator vertical />
            <div class="col-6 q-gutter-md" align="start">
              <q-table
                v-if="users"
                flat class="bg-accent"
                :columns="columnsData"
                row-key="_id"
                virtual-scroll
                rows-per-page-label="Registros por página"
                no-data-label="Nenhum dado inserido até o momento"
                no-results-label="A pesquisa não retornou nenhum resultado"
                :rows-per-page-options="[10, 20, 30, 50]"
                :filter="filter"
                :rows="users"
                @row-click="clkUserInList"
                :virtual-scroll-item-size="48"
                v-model:pagination="pagination"
                @request="nextPage">
                <template #top-right>
                  <div class="flex row q-gutter-sm items-center text-right">
                    <div class="col" >
                      <q-input
                        @keyup="getUsers()"
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

        </q-tab-panel>
      </q-tab-panels>

      <q-dialog v-model="dialogInactiveDepartment" @hide="dialogInactiveDepartment = false">
        <q-card style="border-radius: 1rem" class="app-font">
          <q-card-section>
            <div class="text-h6 text-center">
              Tem certeza que deseja {{ departmentData.isActive === 1 ? "inativar" : "ativar" }}?
            </div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Não"
              no-caps
              color="primary"
              @click="dialogInactiveDepartment = false"
            />
            <q-btn
              unelevated
              rounded
              label="Confirmar"
              no-caps
              color="primary"
              @click="departmentData.isActive === 1 ? updateDepartmentStatus('inactive') : updateDepartmentStatus('active')"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="dialogRemoveUserfromDepartment.open">
        <q-card style="border-radius: 1rem"  class="app-font">
          <q-card-section>
            <div class="text-h6 text-center">
              Deseja remover o usuário do departamento?
            </div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Não"
              no-caps
              color="primary"
              @click="dialogRemoveUserfromDepartment.open = false"
            />
            <q-btn
              unelevated
              rounded
              label="Confirmar"
              no-caps
              color="primary"
              @click="removeUsersFromDepartment"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog v-model="dialogAddUserToDepartment.open">
        <q-card style="border-radius: 1rem" class="app-font">
          <q-card-section>
            <div class="text-h6 text-center">
              Confirma a inserção deste usuário no departamento?
            </div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Não"
              no-caps
              color="primary"
              @click="dialogAddUserToDepartment.open = false"
            />
            <q-btn
              unelevated
              rounded
              label="Confirmar"
              no-caps
              color="primary"
              @click="addUserToDepartment"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

    </q-page>
  </q-page-container>
</template>

<script setup>
import useFetch from "../../boot/useFetch";
import { defineComponent } from "vue";
import { useTableColumns } from "stores/tableColumns";
import utils from '../../boot/utils'
</script>
<script>


export default defineComponent({
  name: "DepartmentDetail",
  data() {
    return {
      tab: 'infos',
      departmentData: null,
      users: null,
      columnsData: useTableColumns().usersListInsideClass,
      dialogInactiveDepartment: false,
      dialogRemoveUserfromDepartment: {
        open: false,
        data: null
      },
      dialogAddUserToDepartment: {
        open: false,
        data: null
      },
      pagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
        sortBy: "",
      },
      filter: ''
    };
  },
  beforeMount () {
    this.getDepartmentDetail()
    this.getUsers()
  },
  mounted() {
    this.$q.loading.hide();
  },
  methods: {
    async clkRemoveUserFromDepartment (user) {
      this.dialogRemoveUserfromDepartment.data = user
      this.dialogRemoveUserfromDepartment.open = true
    },
    async getUsers() {},
    async clkUserInList (e, user) {
      this.dialogAddUserToDepartment.data = user
      this.dialogAddUserToDepartment.open = true
    },
    async updateDepartmentStatus(status){
      const opt = {
        route: "/desktop/adm/updateDepartmentStatus",
        body: {
          departmentId: this.$route.query.departmentId
        }
      }
      if(status === 'active'){
        opt.body.isActive = 1
      }else{
        opt.body.isActive = 0
      }
      this.$q.loading.show()
      const r = await useFetch(opt)
      this.$q.loading.hide()
      if (r.error) return
      this.getDepartmentDetail()
      this.$q.notify(status === 'active' ? 'Departamento ativo com sucesso' : 'Departamento inativado com sucesso')
      this.dialogInactiveDepartment = false
    },
    async removeUsersFromDepartment () {
      const opt = {
        route: "/desktop/adm/removeUserFromDepartment",
        body: {
          departmentUserId: this.dialogRemoveUserfromDepartment.data.departmentUserId
        }
      }
      this.$q.loading.show()
      const r = await useFetch(opt)
      this.$q.loading.hide()
      this.dialogRemoveUserfromDepartment.open = false
      if (r.error) return
      this.getDepartmentDetail()
    },
    async addUserToDepartment () {
      const opt = {
        route: "/desktop/adm/addUserToDepartment",
        body: {
          userId: this.dialogAddUserToDepartment.data.userId,
          departmentId: this.$route.query.departmentId
        }
      }
      this.$q.loading.show()
      const r = await useFetch(opt)
      this.$q.loading.hide()
      this.dialogAddUserToDepartment.open = false
      if (r.error) return
      this.getDepartmentDetail()
    },
    async getUsers() {
      const opt = {
        route: "/desktop/adm/getUsers",
        body: {
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage,
          searchString: this.filter,
          sortBy: this.pagination.sortBy,
          permissionFilter: 40 // permissao dos deptos
        },
      };
      const r = await useFetch(opt)
      this.users = r.data[0].list
      r.data[0].count[0] ? this.pagination.rowsNumber = r.data[0].count[0].count : this.pagination.rowsNumber = 0
    },
    nextPage(e) {
      this.pagination.page = e.pagination.page;
      this.pagination.sortBy = e.pagination.sortBy;
      this.pagination.rowsPerPage = e.pagination.rowsPerPage;
      this.getUsers()
    },
    async getDepartmentDetail () {
      const opt = {
        route: "/desktop/adm/getDepartmentDetail",
        body: {
          departmentId: this.$route.query.departmentId
        }
      }
      this.$q.loading.show()
      const r = await useFetch(opt)
      this.$q.loading.hide()
      if (r.error) return
      this.departmentData = r.data
    },
    async clkSave () {
      const opt = {
        route: "/desktop/adm/updateDepartment",
        body: {
          departmentId: this.$route.query.departmentId,
          departmentData: this.departmentData.departmentData
        }
      }
      this.$q.loading.show()
      const r = await useFetch(opt)
      this.$q.loading.hide()
      if (r.error) return
      this.$q.notify('Departamento atualizado com sucesso')
      this.getDepartmentDetail()
    }
  },
});
</script>
