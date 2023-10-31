<template>
  <q-page-container class="no-padding">
    <q-page>
      <q-table
        flat class="bg-accent"
        title="Crianças"
        :columns="columnsData"
        :rows="childrenList"
        row-key="_id"
        @row-click="clkOpenUserDetail"
        virtual-scroll
        rows-per-page-label="Registros por página"
        no-data-label="Nenhum dado inserido até o momento"
        no-results-label="A pesquisa não retornou nenhum resultado"
        :rows-per-page-options="[10, 20, 30, 50]"
        :filter="filter"
        v-model:pagination="pagination"
        @request="nextPage">
        <template #top-right>
          <div class="row q-gutter-sm items-center text-right">
            <div class="col">
              <q-select
                outlined
                dense
                debounce="300"
                stack-label
                v-model="selectFilter"
                :options="selectStatus"
                @update:model-value="getChildrenList"
              />
            </div>
            <div class="col">
              <q-input
                @keyup="getChildrenList"
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
            <div class="col">
              <q-btn
                label="Adicionar criança"
                rounded
                unelevated
                color="primary"
                no-caps
                @click="openDialogCreateChild = true"
              />
            </div>
          </div>
        </template>
        <template #body-cell-document="props">
          <q-td :props="props">
            <div v-if="props.row.document">
              {{ props.row.document }}
            </div>
            <div v-else-if="!props.row.document">
              Não informado
            </div>
          </q-td>
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
      <q-dialog v-model="openDialogCreateChild" persistent>
        <q-card style="border-radius: 1rem; width: 480px; padding: 10px">
          <div >
            <div class="text-h6 text-center">
              Adicionar criança
            </div>
            <q-card-section class="q-gutter-md">
              <q-input
                label="Preencha o CPF"
                outlined
                mask="###.###.###-##"
                v-model="childData.document"
              />
              <q-input
                label="Preencha o nome"
                outlined
                v-model="childData.name"
              />
              <q-input
                label="Preencha a data de nascimento"
                outlined
                type="date"
                v-model="childData.birthdate"
              />
              <q-file
                v-model="image.blob"
                label="Clique para inserir foto"
                outlined
                clearable
                accept=".png, .jpg, image/*"
                max-files="1"
              >
                <template v-slot:prepend>
                  <q-icon name="photo_camera" />
                </template>
              </q-file>
            </q-card-section>
            <q-card-actions align="center">
              <q-btn
                label="Sair"
                @click="openDialogCreateChild = false"
                rounded
                color="primary"
                no-caps
                flat
              />
              <q-btn
                label="Concluir"
                @click="addChild"
                rounded
                color="primary"
                no-caps
                unelevated

              />
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
import { useTableColumns } from "stores/tableColumns";

export default defineComponent({
  name: "ChildrenList",
  data() {
    return {
      columnsData: useTableColumns().usersList,
      childrenList: [],
      selectStatus: ["Ativos", "Inativos"],
      filter: "",
      filterRow: [],
      selectFilter: null,
      openDialogCreateChild: false,
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
      childData: {
        name: '',
        document: '',
        birthdate: '',
      },
      image: {
        url: null,
        blob: null,
        name: null
      },
    };
  },
  beforeMount() {
    this.getChildrenList();
  },
  methods: {
    clkOpenUserDetail(e, r){
      const userId = r._id
      this.$router.push('/users/childDetail?userId=' + userId)
    },
    addChild() {
      if (this.childData.name === ''
        || this.childData.document === ''
        || this.childData.birthDayDate === ''
        || !this.image.blob)
      {
        this.$q.notify('Preencha todos os dados e insira uma foto')
        return
      }
      const opt = {
        route: '/desktop/adm/createChild',
        body: {
          childData: this.childData
        },
        file: [{ file: this.image.blob, name: 'userPhoto' }]
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify('Ocorreu um erro. Tente novamente.')
          return
        }
        this.$q.notify('Filho adicionado com sucesso.')
        this.openDialogCreateChild = false
        this.getChildrenList()
      })
    },
    nextPage(e) {
      this.pagination.page = e.pagination.page;
      this.pagination.sortBy = e.pagination.sortBy;
      this.pagination.rowsPerPage = e.pagination.rowsPerPage;
      this.getChildrenList();
    },
    getChildrenList() {
      const page = this.pagination.page
      const rowsPerPage = this.pagination.rowsPerPage
      const searchString = this.filter
      const sortBy = this.pagination.sortBy
      const opt = {
        route: "/desktop/users/getChildrenList",
        body: {
          page: page,
          rowsPerPage: rowsPerPage,
          searchString: searchString,
          sortBy: sortBy,
        },
      };
      if (this.selectFilter === "Ativos") {
        opt.body.isActive = 1;
      } else if (this.selectFilter === "Inativos") {
        opt.body.isActive = 0;
      }
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        this.childrenList = r.data.list
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
