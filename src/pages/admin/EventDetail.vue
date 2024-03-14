<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">
          {{ eventName}}
          <div class="text-caption">Detalhe da atividade</div>
        </div>
        <div class="col text-right q-gutter-x-sm">
          <q-btn
            v-if="isActive === 1"
            @click="dialogInactiveEvent = true"
            rounded
            outline
            color="red-8"
            unelevated
            no-caps
            class="q-pa-sm"
          >
            Inativar atividade
          </q-btn>
          <q-btn
            v-if="isActive === 0"
            @click="dialogInactiveEvent = true"
            rounded
            outline
            color="green-8"
            unelevated
            no-caps
            class="q-pa-sm"
          >
            Ativar atividade
          </q-btn>
          <q-btn
            @click="updateChildEvent"
            rounded
            color="primary"
            unelevated
            no-caps
          >
            {{
              $route.path === "/admin/eventDetail"
                ? "Salvar"
                : "Criar"
            }}
            atividade
          </q-btn>
        </div>
      </div>
      <q-separator class="q-mx-md" />
      <div class="row justify-around q-pa-md" >
        <div class="col-12 q-gutter-md" align="start">
          <div class="text-h5">
            Preencha os dados
          </div>
          <q-input
            outlined
            label="Nome da atividade"
            v-model="eventName"
            hint="Ex: Brincou, dormiu, comeu..."
          />
          <q-select
            use-input
            outlined
            label="Turmas"
            option-label="className"
            v-model="classSelected"
            :options="classesOptions"
            use-chips
            multiple
            input-debounce="0"
            :loading="false"
            :option-value="(item) => item.classId"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Nenhum resultado
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.className }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-input
            outlined
            label="Descrição"
            v-model="eventDescription"
          />
          <q-input
            outlined
            label="Adicionar intensidade"
            v-model="subTypeEvent"
          />
        </div>
        <q-dialog v-model="dialogInactiveEvent" @hide="dialogInactiveEvent = false">
          <q-card style="border-radius: 1rem">
            <q-card-section>
              <div class="text-h6 text-center">
                Tem certeza que deseja {{ isActive ? "inativar" : "ativar" }} essa
                atividade?
              </div>
            </q-card-section>
            <q-card-actions align="center">
              <q-btn
                flat
                label="Depois"
                no-caps
                color="primary"
                @click="dialogInactiveEvent"
              />
              <q-btn
                unelevated
                rounded
                label="Confirmar"
                no-caps
                color="primary"
                @click="isActive ? inactivateChildEvents() : activateChildEvent()"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </q-page>
  </q-page-container>
</template>
<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
export default defineComponent({
  name: "EventDetail",
  data() {
    return {
      eventName: '',
      eventDescription: '',
      isAdm: false,
      isActive: null,
      dialogInactiveEvent: false,
      classSelected: null,
      classesOptions: [],
      pagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
        sortBy: "",
      },
      subTypeEvent:[],
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount(){
    this.getChildEventDetailById()
    this.getClassesList()
  },
  methods: {
    getClassesList() {
      const page = this.pagination.page
      const rowsPerPage = this.pagination.rowsPerPage
      const searchString = this.filter
      const sortBy = this.pagination.sortBy
      const opt = {
        route: "/desktop/classes/getClassesList",
        body: {
          page: page,
          rowsPerPage: rowsPerPage,
          searchString: searchString,
          sortBy: sortBy,
        },
      };
      useFetch(opt).then((r) => {
        this.classesOptions = r.data.list
        r.data.count[0] ? this.pagination.rowsNumber = r.data.count[0].count : this.pagination.rowsNumber = 0
      });
    },
    getChildEventDetailById(){
      const opt = {
        route: "/desktop/adm/getChildEventDetailById",
        body: {
          childEventId: this.$route.query.childEventId
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente mais tarde.')
          return
        }
          this.eventName = r.data.name
          this.eventDescription = r.data.description
          this.classSelected = r.data.classesData
          this.isActive = r.data.isActive
      });
    },
    inactivateChildEvents() {
      const opt = {
        route: "/desktop/adm/inactivateChildEvents",
        body: {
          childEventId: this.$route.query.childEventId,
          status: 'inactive'
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente mais tarde.')
          return
        } this.$q.notify('Atividade inativada com sucesso!')
          this.$router.back()
      });
    },
    activateChildEvent() {
      const opt = {
        route: "/desktop/adm/activateChildEvent",
        body: {
          childEventId: this.$route.query.childEventId,
          status: 'active'
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente mais tarde.')
          return
        } this.$q.notify('Atividade ativada com sucesso!')
          this.$router.back()
      });
    },
    updateChildEvent() {
      const extractedData = this.classSelected.map(item => ({
        classId: item.classId,
        className: item.className
      }));
      const opt = {
        route: "/desktop/adm/updateChildEvent",
        body: {
          childEventId: this.$route.query.childEventId,
          name: this.eventName,
          classesSelected: extractedData,
          description: this.eventDescription,
          volume: this.subTypeEvent
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente mais tarde.')
          return
        } this.$q.notify('Atividade atualizada com sucesso!')
          this.$router.back()
      });
    },
  },
});
</script>
