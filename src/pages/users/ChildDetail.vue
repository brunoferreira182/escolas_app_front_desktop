<template>
  <q-page-container class="no-padding">
    <q-page >
      <div class= "row no-wrap q-pa-md">
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
          {{ childData.name }}
          <div class="text-caption">Dados da criança</div>
        </div>
        <div class="col q-pt-sm q-gutter-sm text-right">
          <q-btn
            icon= "calendar_month"
            rounded
            no-caps unelevated color="primary"
            @click="dialog=true"
            label="Calendário"
          />
          <q-btn
            rounded
            no-caps unelevated color="primary"
            @click="updateChildData()"
          >
            Salvar
          </q-btn>
        </div>
      </div>
      <q-separator class="q-mx-md"></q-separator>
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
        <q-tab name="info" label="Informações"/>
        <q-tab name="classPresence" label="Presença" @click="getChildAttendance"/>
      </q-tabs>
      <q-separator class="q-mx-md"></q-separator>
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="info" class="no-padding">
        <div class="row justify-between items-start">
          <div class="col-6 q-pa-md ">
            <div class="row justify-between text-grey-8 text-h6">
              Informações
            </div>
            <div class="q-gutter-lg q-py-md" v-if="childData && childData !== ''">
              <q-avatar
                class="cursor-pointer"
                size="150px"
                @click="clkProfileImage"
              >
                <img :src="utils.makeFileUrl(childData.image)"/>
              </q-avatar>
              <input type="file" id="profile-image-upload" hidden  accept="image/png, image/jpeg"/>
              <q-input
                outlined
                v-model="childData.name"
                label="Nome"
              />
              <q-input
                outlined
                v-model="childData.document"
                mask="###.###.###-##"
                label="CPF"
              />
              <q-input
                outlined
                type="date"
                v-model="childData.birthdate"
                label="Data de nascimento"
              />
            </div>
            <div v-else class="text-grey-8 q-ma-sm">
              Este usuário não possui dados compartilhados
              <q-icon name="warning" size="sm" color="yellow-8"/>
            </div>
          </div>
          <q-separator vertical />
          <div class="col-6 q-pa-md q-gutter-md">
            <div class="text-grey-8 text-h6 q-px-xs">Responsáveis:
              <q-btn
                flat
                no-caps
                rounded
                icon="add"
                color="primary"
                @click="dialogInsertResponsable = true"
                label="Inserir"
              />
            </div>
            <div v-if="responsibleData && responsibleData.length">
              <q-item
                v-for="resp in responsibleData"
                :key="resp"
                style="border-radius: 1rem;"
                class="bg-grey-3 q-ma-xs"
              >
                <q-item-section avatar>
                  <q-icon
                    name="account_circle"
                    size="58px"
                    color="grey"
                    v-if="!resp.responsibleImage || resp.responsibleImage === ''"
                  />
                  <q-avatar  v-else>
                    <img :src="utils.makeFileUrl(resp.responsibleImage)"/>
                  </q-avatar>
                </q-item-section>
                <q-item-section class="text-capitalize cursor-pointer" @click="clkResponsible(resp)">
                  <q-item-label>{{ resp.responsibleName }}</q-item-label>
                  <q-item-label caption class="text-grey-8">{{ resp.responsibleLabel }}</q-item-label>
                </q-item-section>
                <q-item-section side >
                  <div class="text-grey-8 q-gutter-xs">
                    <q-btn
                      @click="clkOpenDialogDeleteResponsable(resp)"
                      class="gt-xs"
                      size="12px"
                      color="red-8"
                      flat
                      dense
                      round
                      icon="delete"
                    >
                      <q-tooltip> Deletar </q-tooltip>
                    </q-btn>
                  </div>
                </q-item-section>
              </q-item>
            </div>
            <div v-else class="text-grey-8 q-px-sm">
              Esta criança ainda não possui responsáveis vinculados
              <q-icon name="warning" size="sm" color="yellow-8"></q-icon>
            </div>
          </div>
        </div>
        </q-tab-panel>
        <q-tab-panel name="classPresence" class="no-padding">
            <q-dialog v-model="dialog" persistent>
              <q-card no-padding>
                  <q-date v-model="filterDate" :locale="myLocale" mask="YYYY-MM-DD" range>
                    <q-card-actions align="right">
                      <q-btn flat label="Fechar" color="primary" v-close-popup="cancelEnabled"/>
                    </q-card-actions>
                  </q-date>
              </q-card>
            </q-dialog>

            <div class="q-pa-md">
              <q-table
                flat
                bordered
                :rows="attendance"
                :columns="columns"
                row-key="_id"
                virtual-scroll
                no-data-label="Nenhum dado inserido até o momento"
                no-results-label="A pesquisa não retornou nenhum resultado"
                :rows-per-page-options="[10, 20, 30, 50]"
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
      </q-tab-panels>
      <!--  -->
      <q-dialog v-model="dialogInsertResponsable" @hide="clearInsertResponsableDialog()" @before-show="getUserRelationType()">
        <q-card style="border-radius: 1rem; width: 480px; padding: 10px">
          <div class="text-h6 text-center">
            Adicionar
          </div>
          <q-card-section class="q-gutter-md">
            <q-select
              v-model="userSelected"
              outlined
              use-input
              label="Buscar responsável"
              autofocus
              option-label="name"
              :options="parentList"
              @filter="getUsers"
              :option-value="(item) => item"
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
                    <q-item-label>{{ scope.opt.name }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.document }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-select
              v-model="relationTypeSelected"
              outlined
              label="Tipo de responsável"
              autofocus
              option-label="label"
              :options="relationTypeList"
              :option-value="(item) => item"
              hint="Informe o vínculo parental com a criança"
            />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              label="Sair"
              @click="dialogInsertResponsable = false"
              rounded
              color="primary"
              no-caps
              flat
            />
            <q-btn
              label="Concluir"
              @click="createRelation"
              rounded
              color="primary"
              no-caps
              unelevated
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog v-model="dialogDeleteResponsable.open" @hide="dialogDeleteResponsable.data = {}" >
        <q-card style="border-radius: 1rem; width: 480px; padding: 10px">
          <div >
            <div class="text-h6 text-center">
              Tem certeza que deseja remover {{ dialogDeleteResponsable.data.responsibleName }}?
            </div>
            <q-card-actions align="center">
              <q-btn
                label="Sair"
                @click="dialogDeleteResponsable.open = false"
                rounded
                color="primary"
                no-caps
                flat
              />
              <q-btn
                label="Confirmar"
                @click="removeRelation"
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

<script setup>
import utils from '../../boot/utils'
</script>

<script>
import { defineComponent, ref } from 'vue'
import { useTableColumns } from "stores/tableColumns";
import useFetch from '../../boot/useFetch'
export default defineComponent({
  name: 'ChildDetail',
  data() {
    return {
      dialog: false,
      tab:'info',
      columns: useTableColumns().attendanceList,
      filterDate: '',
      attendance: [],
      userData: {},
      responsibleData:[],
      parentList:[],
      relationTypeSelected: '',
      relationTypeList: [],
      userIdSQL: '',
      isActive: 0,
      userSelected: '',
      dialogInsertResponsable: false,
      childData: {
        name: '',
        document: '',
        birthdate: '',
      },
      dialogDeleteResponsable: {
        data: {},
        open: false
      },
      pagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
        sortBy: "",
      },
      myLocale: {
        /* starting with Sunday */
        days: 'Domingo_Segunda_Terça_Quarta_Quinta_Sexta_Sábado'.split('_'),
        daysShort: 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
        months: 'Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro'.split('_'),
        monthsShort: 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez'.split('_'),
        firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
        format24h: true,
        pluralDay: 'dias'
      }
    }
  },
  beforeMount() {
    this.getChildDetailById()
  },
  mounted () {
    const profileImage = document.getElementById('profile-image-upload')
    profileImage.onchange = () => {
      const selectedFile = profileImage.files[0];
      this.uploadProfileImage(selectedFile)
    }
  },
  watch:{
    filterDate: {
      handler(newDate, oldDate) {
        if (newDate !== oldDate) {
          this.getChildAttendance();
        }
      },
    },
  },
  methods: {
    uploadProfileImage (image) {
      const opt = {
        route: '/desktop/users/updateProfileImage',
        body: {
          userId: this.$route.query.userId
        },
        file: [ { file: image, name: image.name } ]
      }
      useFetch(opt).then(r => {
        this.childData.image = r.data.image
      })
    },
    clkProfileImage () {
      const profileImage = document.getElementById('profile-image-upload')
      profileImage.click()
    },
    clkResponsible(resp) {
      this.$router.push('/users/userDetail?userId=' + resp.responsibleId)
    },
    clkOpenDialogDeleteResponsable(resp){
      this.dialogDeleteResponsable.data = resp
      this.dialogDeleteResponsable.open = true
    },
    clearInsertResponsableDialog(){
      this.userSelected = ''
      this.relationTypeSelected = ''
      this.dialogInsertResponsable = false
    },
    openCalendar() {
      this.$refs.calendarPopup.show();
    },
    closeCalendar() {
      this.$refs.calendarPopup.hide();
    },
    getUserRelationType(){
      const opt = {
        route: "/desktop/users/getUserRelationType",
      };
      useFetch(opt).then((r) => {
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente por favor')
          return
        }
        this.relationTypeList = r.data
      })
    },
    removeRelation(){
      const opt = {
        route: '/desktop/users/removeRelation',
        body: {
          responsibleId: this.dialogDeleteResponsable.data._id
        },
      }
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if (r.error) {
          this.$q.notify('Ocorreu um erro. Tente novamente.')
          return
        }
        this.$q.notify('Responsável deletado com sucesso.')
        this.dialogDeleteResponsable.open = false
        this.getChildDetailById()
      })
    },
    async getChildAttendance(){
    const opt = {
      route :  '/desktop/users/getAttendanceByChildId',
      body : {
        childId: this.$route.query.userId,
        filterDate: this.filterDate,
        page : this.pagination.page,
        rowsPerPage : 10
      },
    }
    this.$q.loading.show()
    useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(!r.data){
          this.$q.notify('deu merda.')
          return
        }
        this.$q.loading.hide()
        this.attendance = r.data
        console.log('lalalala', this.attendance)
        console.log('BASDASBDKBASala', this.filterDate)
        console.log('BASDASBDKBASala', this.filterDate)
      })
    },
    createRelation() {
      if (this.userSelected === '' || this.relationTypeSelected === '')
      {
        this.$q.notify('Selecione o responsável e o tipo')
        return
      }
      const opt = {
        route: '/desktop/users/createRelation',
        body: {
          responsibleTypeId: this.relationTypeSelected._id,
          responsibleId: this.userSelected._id,
          childId: this.$route.query.userId
        },
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify('Ocorreu um erro. Tente novamente.')
          return
        }
        this.$q.notify('Responsável adicionado com sucesso.')
        this.clearInsertResponsableDialog()
        this.getChildDetailById()
      })
    },
    getUsers(val, update, abort) {
      if(val.length < 3) {
        this.$q.notify('Digite no mínimo 3 caracteres')
        abort()
        return
      }
      const opt = {
        route: "/desktop/users/getUsers",
        body: {
          searchString: val,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        update(() => {
          this.parentList = r.data;
        })
      });
    },
    updateChildData() {
      const opt ={
        route:"/desktop/users/updateChildData",
        body:{
          childId: this.$route.query.userId,
          name: this.childData.name,
          document: this.childData.document,
          birthdate: this.childData.birthdate
        }
      }
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
          return
        }else {
          this.$q.notify('Dados atualizados com sucesso')
          this.getChildDetailById()
        }
      });
    },
    getChildDetailById() {
      const opt = {
        route: "/desktop/users/getChildDetailById",
        body: {
          userId: this.$route.query.userId
        }
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.childData = r.data.userData
          this.responsibleData = r.data.responsibleData
        }
      });
    },
  }
})
</script>

