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
          {{ classData.name }}
          <div class="text-caption">Detalhe da classe</div>
        </div>
        <div class="col text-right q-gutter-x-sm">
          <q-btn
            label="Clonar turma"
            rounded
            outline
            color="purple-8"
            icon="content_copy"
            unelevated
            no-caps
            @click="dialogCloneClass.open = true"
          />
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
            @click="updateClassDetail"
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
        <q-tab name="manageClass" label="Gerenciar turma"/>
        <q-tab name="classPresence" label="Lista de presença"/>
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="infos">
          <div class="row justify-around q-pa-md" >
            <div class="col-12 q-gutter-md" align="start">
              <q-avatar
                class="cursor-pointer"
                size="150px"
                @click="clkProfileImage"
                square
              >
                <img :src="utils.makeFileUrl(classData.image)"/>
              </q-avatar>
              <q-input
                v-if="typeSelected === 'semesterly' || typeSelected === 'yearly'"
                outlined
                label="Turma"
                hint="Nome da turma"
                v-model="classData.name"
              />
              <q-select
                outlined
                label="Tipo"
                option-label="label"
                emit-value
                map-options
                :option-value="(item) => item.type"
                v-model="typeSelected"
                hint="Semestral ou anual"
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
                hint="Semestre"
                :options="classSemester"
              />
              <q-input
                v-if="typeSelected === 'semesterly' || typeSelected === 'yearly'"
                outlined
                label="Ano"
                hint="Ano vigente"
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
              <div class="row q-pt-md">
                <div class="col-6">
                  <div class="text-h5">
                    {{ selectedFilter === 'Aluno' || selectedFilter.type === 'child' ? 'Alunos' : 'Usuários'}}
                    <q-btn icon="history" flat color="primary">
                      <q-tooltip>Histórico</q-tooltip>
                    </q-btn>
                  </div>
                </div>
                <div class="col-6">
                  <q-select
                    outlined
                    dense
                    label="Filtro"
                    debounce="300"
                    v-model="selectedFilter"
                    :options="filterUserOrChildOptions"
                    :option-value="(item) => item.type"
                    @update:model-value="selectedFilter.type === 'user' ? getUsers() : getChildrenNotInClass()"
                  ></q-select>
                </div>
              </div>
              <div v-if="selectedFilter.type === 'user'">
                <q-item
                  v-for="child in users"
                  :key="child._id"

                  style="border-radius: 0.5rem;"
                  class="bg-grey-4 q-ma-sm"
                >
                  <q-item-section avatar>
                      <q-avatar>
                        <img :src="utils.makeFileUrl(child.image)">
                      </q-avatar>
                    </q-item-section>
                  <q-item-section
                    class="text-wrap cursor-pointer"
                    lines="2"
                    @click="clkUserInClass(child)"
                  >
                    {{ child.userName }}
                    <div class="text-caption">
                      {{ child.userFunction }}
                    </div>
                  </q-item-section>
                  <q-item-section side >
                    <div class="text-grey-8 q-gutter-xs">
                      <q-btn
                        @click="insertObservation(child)"
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
                        @click="clkOpenDialogRemoveUserFromClass(child)"
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
              </div>
              <div v-else-if="selectedFilter === 'Aluno' || selectedFilter.type === 'child'">
                <q-item
                  v-for="child in childrenInClassList"
                  :key="child._id"
                  style="border-radius: 0.5rem;"
                  class="bg-grey-4 q-ma-sm"
                >
                  <q-item-section avatar>
                      <q-avatar>
                        <img :src="utils.makeFileUrl(child.image)">
                      </q-avatar>
                    </q-item-section>
                  <q-item-section
                    class="text-wrap cursor-pointer"
                    lines="2"
                    @click="clkUserInClass(child)"
                  >
                    {{ child.userName }}
                  </q-item-section>
                  <q-item-section side >
                    <div class="text-grey-8 q-gutter-xs">
                      <q-btn
                        @click="clkOpenDialogInsertFamilyMember(child)"
                        class="gt-xs"
                        size="12px"
                        color="blue-8"
                        flat
                        dense
                        round
                        icon="family_restroom"
                      >
                        <q-tooltip>
                          Definir  um familiar para representante de turma
                        </q-tooltip>
                      </q-btn>
                      <q-btn
                        @click="insertObservation(child)"
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
                        @click="clkOpenDialogRemoveUserFromClass(child)"
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
              </div>
            </div>
            <q-separator vertical />
            <div class="col-6 q-gutter-md" align="start">
              <q-table
                flat class="bg-accent"
                :columns="columnsData"
                row-key="_id"
                virtual-scroll
                rows-per-page-label="Registros por página"
                no-data-label="Nenhum dado inserido até o momento"
                no-results-label="A pesquisa não retornou nenhum resultado"
                :rows-per-page-options="[10, 20, 30, 50]"
                :filter="filter"
                :title="selectedFilter.type === 'user' ? 'Adicionar usuário' : 'Adicionar aluno'"
                :rows="usersList"
                @row-click="clkManageChildOrUser"
                :virtual-scroll-item-size="48"
                v-model:pagination="pagination"
                @request="nextPage">
                <template #top-right>
                  <div class="flex row q-gutter-sm items-center text-right">
                    <div class="col" >
                      <q-input
                        v-if="selectedFilter.type === 'user' || selectedFilter === 'Usuário'"
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
                      <q-input
                        v-else-if="selectedFilter.type === 'child' || selectedFilter === 'Aluno'"
                        @keyup="getChildrenNotInClass()"
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
          <q-dialog v-model="dialogRemoveUserInClass.open" @hide="clearDialog()">
            <q-card style="border-radius: 1rem">
              <q-card-section>
                <div class="text-h6 text-center">
                  Deseja deletar este {{ dialogRemoveUserInClass.type === 'child' ? 'aluno' : 'usuário' }} da classe?
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
                  @click="removeUsersFromClass"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <q-dialog v-model="dialogManageUserOrChild.open" @hide="clearDialog()" @before-show="dialogManageUserOrChild.type === 'user' ? getFunctions() : ''">
            <q-card style="border-radius: 1rem">
              <q-card-section>
                <div class="text-h6 text-center">
                  Deseja confirmar a inserção deste {{ dialogManageUserOrChild.data.childId ? 'aluno' : 'usuário' }} na turma?
                </div>
              </q-card-section>
              <q-card-section v-if="dialogManageUserOrChild.type === 'user'">
                <q-select
                  v-model="functionSelected"
                  outlined
                  label="Nome da função"
                  option-label="name"
                  hint="Informe a função do usuário"
                  map-options
                  emit-value
                  :options="functionsOptions"
                  :option-value="(item) => item._id"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        Nenhum resultado
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
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
                  @click="addUserToClass"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <q-dialog v-model="dialogInsertFamilyMemberIntoClass.open" @hide="clearDialog()" @before-show="getChildParents() || getFunctions()">
            <q-card style="border-radius: 1rem">
              <q-card-section>
                <div class="text-h6 text-center">
                  Selecione um familiar de {{ dialogInsertFamilyMemberIntoClass.data.userName }} para inserir como representante de turma
                </div>
              </q-card-section>
              <q-card-section class="q-gutter-md">
                <q-select
                  v-model="familiarSelected"
                  outlined
                  label="Nome do familiar"
                  option-label="responsibleName"
                  hint="Selecione o familiar que será representante de classe"
                  map-options
                  emit-value
                  :options="childFamilyOptions"
                  :option-value="(item) => item.responsibleId"
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
                        <q-item-label>{{ scope.opt.responsibleName }}</q-item-label>
                        <q-item-label caption>{{ scope.opt.responsibleLabel }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
                <q-select
                  v-model="functionSelected"
                  outlined
                  label="Nome da função"
                  option-label="name"
                  hint="Informe a função do usuário"
                  map-options
                  emit-value
                  :options="functionsOptions"
                  :option-value="(item) => item._id"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        Nenhum resultado
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
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
                  @click="addFamiliarIntoClass"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </q-tab-panel>
        <q-tab-panel name="classPresence" class="no-padding">
          <q-input
            class="q-px-md q-mx-md"
            @input="getChildrenByClass"
            type="date"
            v-model= "filterDate"
            label= "Escolha a data"
          />
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
      </q-tab-panels>
      <q-dialog v-model="dialogCloneClass.open" >
        <q-card style="border-radius: 1rem; width: 100%" class="text-center">
          <q-card-section>
            <h6 class="text-center q-ma-none">Atenção</h6>
          </q-card-section>
          <q-card-section>
            <div class="text-subtitle1">
              Selecione os dados a ser clonados
            </div>
          </q-card-section>
          <q-card-section>
            <q-checkbox
              v-for="option in cloneOptions"
              :key="option.value"
              v-model="selectedOptions"
              :val="option.value"
              :label="option.label"
              @update:model-value="selectCloneOptions(option.value)"
            />
          </q-card-section>
          <q-card-section>
            <q-item
              v-for="(u, uindex) in dialogCloneClass.usersCloneList"
              :key="uindex"

              style="border-radius: 0.5rem;"
              class="bg-grey-4 q-ma-sm"
            >
              <q-item-section avatar>
                <q-avatar>
                  <img :src="utils.makeFileUrl(u.image)">
                </q-avatar>
              </q-item-section>
              <q-item-section
                class="text-wrap cursor-pointer"
                lines="2"
                @click="clkUserInClass(u)"
              >
                {{ u.userName }}
                <div class="text-caption">
                  {{ u.userFunction }}
                </div>
              </q-item-section>
              <q-item-section side >
                <div class="text-grey-8 q-gutter-xs">
                  <q-btn
                    @click="dialogCloneClass.usersCloneList.splice(uindex, 1)"
                    class="gt-xs"
                    size="12px"
                    color="red-8"
                    flat
                    dense
                    round
                    icon="delete"
                  >
                    <q-tooltip> Deletar usuário da lista </q-tooltip>
                  </q-btn>
                </div>
              </q-item-section>
            </q-item>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn no-caps color="red-8" outline rounded unelevated>
              Cancelar
            </q-btn>
            <q-btn no-caps color="primary" rounded unelevated @click="createClonedClass">
              Confirmar
            </q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
      <PhotoHandler
        :start="startPhotoHandler"
        :camera="true"
        :gallery="true"
        :documents="false"
        :noCrop="false"
        @captured="captured"
        @cancel="cancelPhotoHandler"
      />
    </q-page>
  </q-page-container>
</template>

<script setup>
import utils from '../../boot/utils'
import PhotoHandler from '../../components/PhotoHandler.vue'
</script>

<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
import { useTableColumns } from "stores/tableColumns";
export default defineComponent({
  name: "ClassDetail",
  data() {
    return {
      utils,
      columns: useTableColumns().attendanceList,
      columnsData: useTableColumns().usersListInsideClass,
      tab: 'infos',
      classData: {
        name: '',
      },
      dialogCloneClass: {
        open: false,
        usersCloneList: [],
        classCloneName: '',
        classCloneType: '',
        semesterSelected: ''
      },
      selectedOptions: [],
      cloneOptions: [
        { label: 'Nome da turma', value: 'className' },
        { label: 'Tipo', value: 'classType' },
        { label: 'Professores', value: 'teachers' }
      ],
      familiarSelected: '',
      filter: "",
      dialogInactiveClass: false,
      yearSelected: '',
      selectedFilter: 'Aluno',
      functionsOptions: [],
      functionSelected: '',
      semesterSelected: '',
      typeSelected: '',
      isActive: null,
      classImg: null,
      filterUserOrChildOptions: [
        {label: 'Aluno', type: 'child'},
        {label: 'Usuário', type: 'user'},
      ],
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
        rowsPerPage: 10,
        rowsNumber: 0,
        sortBy: "",
      },
      dialogManageUserOrChild: {
        open: false,
        type: '',
        data: {}
      },
      dialogRemoveUserInClass: {
        open: false,
        type: '',
        data: {}
      },
      dialogInsertFamilyMemberIntoClass: {
        open: false,
        data: {}
      },
      users: [],
      childFamilyOptions: [],
      childrenInClassList: [],
      usersList: [],
      filterDate: '',
      attendance: [],
      startPhotoHandler: false,
      fileSelected: null
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount() {
    this.getClassDetailById()
    this.getChildrenByClass()
    this.getChildrenNotInClass()
  },
  watch: {
    filterDate: {
      handler(newDate, oldDate) {
        if (newDate !== oldDate) {
          this.getChildrenByClass();
        }
      },
    },
  },
  methods: {
    selectCloneOptions(option) {
      const isSelected = this.selectedOptions.includes(option);
      switch(option) {
        case 'teachers':
          if (isSelected) {
            this.dialogCloneClass.usersCloneList.push(...this.users);
          } else {
            this.dialogCloneClass.usersCloneList = [];
          }
          break;
        case 'className':
          if (isSelected) {
            this.dialogCloneClass.classCloneName = this.classData.name;
          } else {
            this.dialogCloneClass.classCloneName = '';
          }
          break;
        case 'classType':
          if (isSelected) {
            this.dialogCloneClass.classCloneType = this.typeSelected;
          } else {
            this.dialogCloneClass.classCloneType = '';
          }
          break;
      }
    },
    async createClonedClass(){
      console.log(this.dialogCloneClass,'opkafdposakpdos')
      const opt = {
        route: '/desktop/classes/createClonedClass',
        body: {
          className: this.dialogCloneClass.classCloneName,
          classData: {},
          classClonedId: this.$route.query.classId,
          users: this.dialogCloneClass.usersCloneList
        }
      }
      switch(this.typeSelected){
        case 'semesterly':
          opt.body.classData.type = 'semesterly'
          opt.body.classData.semesterSelected = this.semesterSelected
          opt.body.classData.yearSelected = this.yearSelected
        break;
        case 'yearly':
          opt.body.classData.type = 'yearly'
          opt.body.classData.yearSelected = this.yearSelected
        break;
      }
      this.$q.loading.show()
      const r = useFetch(opt)
      this.$q.loading.hide()
      if(!r.error){
        console.log(r, 'OPKDOPSAKD')
        this.$q.notify('Turma clonada com sucesso!')

      }

      console.log(r, 'rerrrrrere')
    },
    clkProfileImage () {
      this.startPhotoHandler = true
    },
    captured(img, imgBlob, fileName) {
      this.startPhotoHandler = false
      this.fileSelected = {
        file: imgBlob,
        name: fileName
      }
      this.uploadProfileImage()
    },
    uploadProfileImage (image) {
      const opt = {
        route: '/desktop/classes/updateClassImage',
        body: {
          classId: this.$route.query.classId
        },
        file: [ this.fileSelected ]
      }
      useFetch(opt).then(r => {
        this.classData.image = r.data.image
      })
    },
    cancelPhotoHandler () {
      this.startPhotoHandler = false
    },
    async getChildrenByClass(){
      const opt = {
        route :  '/desktop/classes/getAttendanceByClass',
        body : {
          classId : this.$route.query.classId,
          filterDate: this.filterDate,
          page : this.pagination.page,
          rowsPerPage : 50
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
      })
    },
    clkUserInClass (user) {
      let route
      if (user.type === 'child') route = '/users/userDetail?userId='
      else if (user.type === 'user') route = '/users/childDetail?userId='
      this.$router.push(route + user.userId)
    },
    clkOpenDialogInsertFamilyMember(child){
      this.dialogInsertFamilyMemberIntoClass.open = true
      this.dialogInsertFamilyMemberIntoClass.data = child
    },
    clearDialog(){
      this.dialogInsertFamilyMemberIntoClass.open = false
      this.dialogInsertFamilyMemberIntoClass.data = {}
      this.familiarSelected = ''
      this.dialogManageUserOrChild.open = false
      this.dialogManageUserOrChild.type = ''
      this.functionSelected = ''
      this.dialogRemoveUserInClass.type = ''
      this.dialogRemoveUserInClass.open = false
      this.dialogRemoveUserInClass.data = {}
      this.dialogManageUserOrChild.data = {}
    },
    clkManageChildOrUser(e, r){
      this.dialogManageUserOrChild.data = r
      this.dialogManageUserOrChild.open = true
      switch(r.userId || r.childId){
        case r.userId:
          this.dialogManageUserOrChild.type = 'user'
        break;
        case r.childId:
          this.dialogManageUserOrChild.type = 'child'
        break;
      }
    },
    nextPage(e) {
      this.pagination.page = e.pagination.page;
      this.pagination.sortBy = e.pagination.sortBy;
      this.pagination.rowsPerPage = e.pagination.rowsPerPage;
      if(this.selectedFilter.type === 'user' || this.selectedFilter === 'Usuário'){
        this.getUsers()
      }else if(this.selectedFilter.type === 'child' || this.selectedFilter === 'Aluno'){
        this.getChildrenNotInClass();
      }
    },
    getChildParents() {
      const opt = {
        route: "/desktop/users/getChildParents",
        body: {
          userId: this.dialogInsertFamilyMemberIntoClass.data.userId,
          page: 1,
          rowsPerPage: 1000,
        },
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(r.error){
          this.$q.notify('Ocorreu um erro ao tentar exibir os familiares, tente novamente mais tarde.')
          return
        }else{
          this.childFamilyOptions = r.data.parents
        }
      });
    },
    getUsersByPermissionId() {
      const opt = {
        route: "/desktop/classes/getUsersByPermissionId",
        body: {
          permissionId: 2,
          page: 1,
          rowsPerPage: 1000,
        },
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(r.error){
          this.$q.notify('Ocorreu um erro ao tentar exibir funções, tente novamente mais tarde.')
          return
        }else{
          this.functionsOptions = r.data
        }
      });
    },
    clkOpenDialogRemoveUserFromClass(child){
      console.log(child)
      this.dialogRemoveUserInClass.data = child
      this.dialogRemoveUserInClass.open = true
      switch(child.type){
        case 'user':
          this.dialogRemoveUserInClass.type = 'user'
        break;
        case 'child':
          this.dialogRemoveUserInClass.type = 'child'
        break;
      }
    },
    removeUsersFromClass() {
      const opt = {
        route: "/desktop/classes/removeUsersFromClass",
        body: {
          classId: this.$route.query.classId
        },
      };
      switch(this.dialogRemoveUserInClass.type){
        case 'user':
          opt.body.type = 'user'
          opt.body.userId = this.dialogRemoveUserInClass.data.userId
          opt.body.functionId = this.dialogRemoveUserInClass.data.functionId
        break;
        case 'child':
          opt.body.userId = this.dialogRemoveUserInClass.data.userId
          opt.body.type = 'child'
        break;
      }
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(r.error){
          this.$q.notify('Ocorreu um erro ao tentar exibir funções, tente novamente mais tarde.')
          return
        }else{
          if(this.dialogRemoveUserInClass.type === 'user'){
            this.$q.notify('Usuário removido com sucesso' )
            this.clearDialog()
            this.getUsers()
            this.getClassDetailById()
            return
          }
          this.getClassDetailById()
          this.clearDialog()
          this.$q.notify('Aluno removido com sucesso' )
          this.getChildrenNotInClass()
        }
      });
    },
    updateClassDetail() {
      const files = [{file:this.classImg,name:'classImg'}]
      const opt = {
        route: "/desktop/classes/updateClassDetail",
        body: {
          classId: this.$route.query.classId,
          className: this.classData.name,
          classData: {},
        },
        file: null
      };
      if(this.classImg !== null){
        opt.file = files
      }
      switch(this.typeSelected){
        case 'semesterly':
          opt.body.classData.type = 'semesterly'
          opt.body.classData.semesterSelected = this.semesterSelected
          opt.body.classData.yearSelected = this.yearSelected
        break;
        case 'yearly':
          opt.body.classData.type = 'yearly'
          opt.body.classData.yearSelected = this.yearSelected
        break;
      }
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente mais tarde.')
          return
        }else{
          this.$q.notify('Turma atualizada com sucesso!')
          this.getClassDetailById()
        }
      });
    },
    addFamiliarIntoClass() {
      if(this.familiarSelected === 'user' || this.functionSelected === ''){
        this.$q.notify('Para adicionar um representante na turma, é necessário selecioná-lo primeiro e informar sua função')
        return
      }
      const opt = {
        route: "/desktop/classes/addUserToClass",
        body: {
          type: 'user',
          classId: this.$route.query.classId,
          userId: this.familiarSelected,
          functionId: this.functionSelected
        },
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente mais tarde.')
          return
        }else{
          this.getUsers()
          this.$q.notify('Familiar inserido na turma')
          this.getClassDetailById()
          this.clearDialog()
        }
      });
    },
    addUserToClass() {
      if(this.dialogManageUserOrChild.type === 'user' && this.functionSelected === ''){
        this.$q.notify('Para adicionar um usuário na turma, é necessário especificar sua função nela.')
        return
      }
      const opt = {
        route: "/desktop/classes/addUserToClass",
        body: {
          classId: this.$route.query.classId,
        },
      };
      switch(this.dialogManageUserOrChild.type){
        case 'child':
          opt.body.userId = this.dialogManageUserOrChild.data.childId
          opt.body.type = 'child'
        break;
        case 'user':
          opt.body.userId = this.dialogManageUserOrChild.data.userId
          opt.body.type = 'user'
          opt.body.functionId = this.functionSelected
        break;
      }
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente mais tarde.')
          return
        }else{
          if(this.dialogManageUserOrChild.type === 'child'){
            this.getChildrenNotInClass()
            this.$q.notify('Aluno inserido na turma')
            this.getClassDetailById()
            this.clearDialog()
          }else if(this.dialogManageUserOrChild.type === 'user'){
            this.getUsersByPermissionId()
            this.$q.notify('Usuário inserido na turma')
            this.getClassDetailById()
            this.clearDialog()
          }
        }
      });
    },
    getFunctions() {
      const page = this.pagination.page
      const rowsPerPage = this.pagination.rowsPerPage
      const searchString = this.filter
      const sortBy = this.pagination.sortBy
      const opt = {
        route: "/desktop/classes/getFunctions",
        body: {
          page: 1,
          rowsPerPage: rowsPerPage,
          searchString: searchString,
          sortBy: sortBy,
        },
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        this.functionsOptions = r.data
      });
    },
    async getUsers() {
      const page = this.pagination.page
      const rowsPerPage = this.pagination.rowsPerPage
      const searchString = this.filter
      const sortBy = this.pagination.sortBy
      const opt = {
        route: "/desktop/classes/getUsers",
        body: {
          page: page,
          rowsPerPage: rowsPerPage,
          searchString: searchString,
          sortBy: sortBy,
        },
      };
      this.$q.loading.show()
      const r = await useFetch(opt)
        this.$q.loading.hide()
        this.usersList = r.data[0].list
        r.data[0].count[0] ? this.pagination.rowsNumber = r.data[0].count[0].count : this.pagination.rowsNumber = 0
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
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        this.usersList = r.data.list
        r.data.count[0] ? this.pagination.rowsNumber = r.data.count[0].count : this.pagination.rowsNumber = 0
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
        this.users.push(...r.data.users.filter((item) => item.type === 'user'))
        this.childrenInClassList.push(...r.data.users.filter((item) => item.type === 'child'))
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
        this.classData.image = r.data.classImage
      });
    },
    activateClassById() {
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

<style scoped>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style>
