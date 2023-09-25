<template>
  <q-page-container class="no-padding">
    <q-page>
      <q-table 
        flat class="bg-accent" 
        title="Usuários aguardando aprovação" 
        :columns="columnsData" 
        :rows="usersList" 
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
              <q-select 
                outlined 
                dense 
                debounce="300" 
                stack-label
                v-model="selectFilter" 
                :options="selectStatus"
                @update:model-value="getUsersList"
              />
            </div>
            <div class="col">
              <q-input 
                @keyup="getUsersList" 
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
            <!-- <div>
              <q-btn 
                @click="$router.push('/admin/createOrganism')" 
                color="primary" 
                unelevated 
                class="q-pa-sm"
                no-caps 
                rounded 
                dense
                icon="add"
              >
                Criar Organismo
              </q-btn>
            </div> -->
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
      <q-dialog v-model="dialogOpenSolicitation.open" @hide="clearDialogSolicitation">
        <q-card style="border-radius: 1rem; width: 480px; padding: 10px">
          <div class="text-center" v-if="hideDiv">
            <img :src="gif" />
          </div>
          <div class="fade" v-if="!hideDiv">
            <div class="text-h6 text-center">
              Como deseja proceder com essa solicitação?
            </div>
            <q-card-actions align="center">
              <div class="row justify-center">
                <div class="col-10">
                  <q-btn 
                    v-for="btn in arrayButtons"
                    :key="btn"
                    :label="btn.label"
                    class="full-width q-ma-sm text-subtitle1"
                    :color="btn.color"
                    @click="changeUserStatus(btn)"
                    outline
                    no-caps
                    unelevated
                  />
                </div>
              </div>
            </q-card-actions>
          </div>
        </q-card>
      </q-dialog>
    </q-page>
  </q-page-container>
</template>
<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
import gif from 'assets/gif.gif'
import { useTableColumns } from "stores/tableColumns";

export default defineComponent({
  name: "UsersWaitingApprovalList",
  data() {
    return {
      gif,
      columnsData: useTableColumns().usersList,
      usersList: [],
      organismsConfigsNamesList: [],
      hideDiv: false,
      selectStatus: ["Ativos", "Inativos"],
      filter: "",
      filterRow: [],
      arrayButtons: [
        {label: 'Aprovar como pai', color: 'primary', callback: 'parentAproval'},
        {label: 'Aprovar como interno', color: 'primary', callback: 'internalApproval'},
        {label: 'Aprovar como ambos', color: 'primary', callback: 'bothApproval'},
        {label: 'Recusar', color: 'red-8', callback: 'refused'},
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
    this.getUsersList();
    this.getUserPermissionsOptions()
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
    nextPage(e) {
      this.pagination.page = e.pagination.page;
      this.pagination.sortBy = e.pagination.sortBy;
      this.pagination.rowsPerPage = e.pagination.rowsPerPage;
      this.getUsersList();
    },
    changeUserStatus(btn){
      const opt = {
        route: "/desktop/users/changeUserStatus",
        body: {
          userId: this.dialogOpenSolicitation.data.userId,
        },
      };
      switch(btn.callback){
        case 'parentAproval':
          opt.body.status = {label: 'Ativo', status: 'active'}
          opt.body.permissionIds = [1]
        break;
        case 'internalApproval':
          opt.body.status = {label: 'Ativo', status: 'active'}
          opt.body.permissionIds = [2]
        break;
        case 'bothApproval':
          opt.body.status = {label: 'Ativo', status: 'active'}
          opt.body.permissionIds = [1, 2]
        break;
        case 'refused':
          opt.body.status = {label: 'Recusado', status: 'refused'}
          opt.body.permissionIds = []
        break;
      }
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente por favor')
          return
        }
        this.hideDiv = true;
        setTimeout(() => {
          this.hideDiv = false;
          this.dialogOpenSolicitation.open = false
          this.getUsersList()
        }, 3800);
      })
    },
    getUserPermissionsOptions(){
      const opt = {
        route: "/desktop/users/getUserPermissionsOptions",
      };
      useFetch(opt).then((r) => {
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente por favor')
          return
        }
        this.userPermissionsOptions = r.data
      })
    },
    getUsersList() {
      const page = this.pagination.page
      const rowsPerPage = this.pagination.rowsPerPage
      const searchString = this.filter
      const sortBy = this.pagination.sortBy
      const opt = {
        route: "/desktop/users/getUsersList",
        body: {
          page: page,
          rowsPerPage: rowsPerPage,
          searchString: searchString,
          sortBy: sortBy,
          status: 'waitingApproval'
        },
      };
      if (this.selectFilter === "Ativos") {
        opt.body.isActive = 1;
      } else if (this.selectFilter === "Inativos") {
        opt.body.isActive = 0;
      }
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        this.usersList = r.data.list
        r.data.count[0] ? this.pagination.rowsNumber = r.data.count[0].count : this.pagination.rowsNumber = 0
      });
    },
    clearDialogSolicitation(){
      this.dialogOpenSolicitation.open = false
      this.hideDiv = false
    },
  },
});
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active no <2.1.8 */ {
  opacity: 0;
}
.disabled-row{
  pointer-events: none;
  opacity: 0.5;
}
.flex-center{
  justify-content: flex-start;
}
</style>
