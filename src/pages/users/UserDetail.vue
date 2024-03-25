<template>
  <q-page-container class="no-padding">
    <q-page >
      <div class="q-pa-md row justify-between">
        <q-btn
          icon="arrow_back_ios"
          flat
          dense
          @click="$router.back()"
          round
        >
          <q-tooltip>
            Voltar
          </q-tooltip>
        </q-btn>
        <div class="col-6 text-h5 text-capitalize">
          {{ userData.name }}
          <div class="text-caption">Dados de usuário</div>
        </div>
        <div class="col q-pt-sm q-gutter-sm text-right">
            <q-btn
            rounded
            no-caps
            unelevated
            color="primary"
            @click="updateUserData()">
              Salvar
            </q-btn>
          <q-chip
            v-if="userData.status"
            color="green-8"
            outline
            size="medium"
          >
            {{ userData.status.label }}
          </q-chip>
        </div>
      </div>
      <q-separator class="q-mx-md"></q-separator>
      <div class="row justify-between items-start">
        <div class="col-6 q-pa-md ">
          <div class="text-grey-8 text-h6">
            Informações
          </div>
          <div class="q-gutter-lg q-py-md" v-if="userData && userData !== ''">
            <q-avatar
              class="cursor-pointer"
              size="150px"
              @click="clkProfileImage"
            >
              <img :src="utils.makeFileUrl(userData.image)" />
            </q-avatar>
            <input type="file" id="profile-image-upload" hidden accept="image/png, image/jpeg"/>
            <q-input
              outlined
              v-model="userData.name"
              label="Nome"
            />
            <q-input
              outlined
              v-model="userData.document"
              label="CPF"
              mask="###.###.###-##"
            />
            <q-input
              outlined
              v-model="userData.phone"
              label="Telefone"
              mask="(##) #####-####"
            />
            <q-input
              outlined
              v-model="userData.email"
              label="Email"
            />
            <!-- mascara ta com 15 caracteres -->
            <q-input v-if="familiarChecked"
              outlined
              mask="###############"
              v-model="userData.registerNumber"
              label="Número de cadastro"
            />
          </div>
          <div v-else class="text-grey-8 q-ma-sm">
            Este usuário não possui dados compartilhados <q-icon name="warning" size="sm" color="yellow-8"/>
          </div>
        </div>
        <q-separator vertical />
        <div class="col-6 q-pa-md q-gutter-md">
          <div class="text-grey-8 text-h6 q-px-xs">Permissões:</div>
          <div  v-if="allPermissions && allPermissions.length">
            <div class="visions-field q-mt-none row">
              <div
                v-for="permission in allPermissions"
                :key="permission"
                class="col-12 q-my-xs"
              >
                <q-checkbox
                  @update:model-value="(value, evt ) => updateUserPermissions(value, evt, permission)"
                  :label="permission.label"
                  v-model="permission.checked"
                />
              </div>
            </div>
          </div>
          <div v-else class="text-grey-8">
            Este usuário não possui permissões <q-icon name="warning" size="sm" color="yellow-8"></q-icon>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-6 q-px-md">
          <div class="text-grey-8 text-h6 q-px-xs">Crianças vinculadas:
            <q-btn
              flat
              no-caps
              rounded
              icon="add"
              color="primary"
              @click="dialogInsertChild.open = true"
              label="Inserir"
            />
          </div>
          <div v-if="childrenData && childrenData.length">
            <q-item
              v-for="child in childrenData"
              :key="child"
              style="border-radius: 1rem;"
              class="bg-grey-3 q-ma-xs"
            >
              <q-item-section avatar>
                <q-icon
                  name="account_circle"
                  size="58px"
                  color="grey"
                  v-if="!child.childImage || child.childImage === ''"
                />
                <q-avatar  v-else>
                  <img :src="utils.makeFileUrl(child.childImage)"/>
                </q-avatar>
              </q-item-section>
              <q-item-section class="text-capitalize cursor-pointer" @click="clkChild(child)">
                <q-item-label>{{ child.childName }}</q-item-label>
                <q-item-label caption>{{ child.responsibleLabel }}</q-item-label>
              </q-item-section>
              <q-item-section side >
                <div class="text-grey-8 q-gutter-xs">
                  <q-btn
                    @click="clkOpenDialogDeleteChildren(child)"
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
            Nenhuma criança vinculada até o momento <q-icon name="warning" size="sm" color="yellow-8"></q-icon>
          </div>
        </div>
      </div>
      <q-dialog v-model="dialogInsertChild.open" @before-show="getUserRelationType()" @hide="childData = {}">
        <q-card style="border-radius: 1rem; width: 480px; padding: 10px">
          <div >
            <div class="text-h6 text-center">
              Adicionar criança
            </div>
            <q-card-section class="q-gutter-md">
              <q-select
                v-model="userSelected"
                outlined
                use-input
                label="Buscar criança"
                autofocus
                option-label="name"
                :options="childrenList"
                @filter="getChildren"
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
              <q-expansion-item
                style="border-radius: 1rem;"
                class="bg-grey-1"
                label="Não encontrou a criança? Clique aqui para inserir manualmente"
              >
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
              </q-expansion-item>
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
                @click="createRelation"
                rounded
                color="primary"
                no-caps
                unelevated
              />
            </q-card-actions>
          </div>
        </q-card>
      </q-dialog>
      <q-dialog v-model="dialogDeleteChildren.open" @hide="dialogDeleteChildren.data = {}">
        <q-card style="border-radius: 1rem; width: 480px; padding: 10px">
          <div >
            <div class="text-h6 text-center">
              Tem certeza que deseja remover {{ dialogDeleteChildren.data.childName }}?
            </div>
            <q-card-actions align="center">
              <q-btn
                label="Sair"
                @click="dialogDeleteChildren.open = false"
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
import { defineComponent } from 'vue'
import useFetch from '../../boot/useFetch'
import utils from "../../boot/utils";
export default defineComponent({
  name: 'UserDetail',
  data() {
    return {
      userData: {
        name:'',
        phone:'',
        document:'',
        email: '',
        registerNumber: '',
      },
      permissions:[],
      allPermissions: [],
      childrenData: [],
      checkedPermissionsList: [],
      familiarChecked: false,
      childrenList: [],
      userIdSQL: '',
      isActive: 0,
      userSelected: '',
      dialogInsertChild: {
        open: false,
        data: {},
      },
      dialogDeleteChildren: {
        open: false,
        data: {}
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
      relationTypeList: [],
      relationTypeSelected: '' ,
    }
  },
  mounted() {
    this.$q.loading.hide()
    const profileImage = document.getElementById('profile-image-upload')
    profileImage.onchange = () => {
      const selectedFile = profileImage.files[0];
      this.uploadProfileImage(selectedFile)
    }
  },
  beforeUnMount() {
    this.updateUserData()
  },
  beforeMount() {
    this.getUserDetailById()
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
        this.userData.image = r.data.image
      })
    },
    clkProfileImage () {
      const profileImage = document.getElementById('profile-image-upload')
      profileImage.click()
    },
    clkChild(child) {
      this.$router.push('/users/childDetail?userId=' + child.childId)
    },
    updateUserData() {
      const opt = {
        route: "/desktop/adm/updateUserData",
        body: {
          userId: this.$route.query.userId,
          name: this.userData.name,
          document: this.userData.document,
          phone: this.userData.phone,
          registerNumber: this.userData.registerNumber
        }
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        }
        this.$q.notify('Dados do usuário salvos')
      });
    },
    createChildAndRelation() {
      this.createChild().then((r) => {
        if (r.error) {
          this.$q.notify('Ocorreu um erro ao adicionar a criança. Tente novamente.')
          return
        }
        this.userSelected = r.data
        this.dialogInsertChild.open = false
        this.createRelation()
        this.$q.notify('Criança vinculada com sucesso.')
        this.userSelected = ''
        this.relationTypeSelected = ''
        this.getUserDetailById()
      })
    },
    createChild() {
      if (this.childData.name === ''
        || this.childData.birthDayDate === ''
        )
      {
        this.$q.notify('Preencha o nome e data de nascimento')
        return
      }
      const opt = {
        route: '/desktop/users/createChild',
        body: {
          childData: this.childData
        },
      }
      if(this.image.blob !== null){
        opt.file = [{ file: this.image.blob, name: 'userPhoto' }]
      }
      return useFetch(opt)
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify('Ocorreu um erro. Tente novamente.')
          return
        }

        this.$q.notify('Filho adicionado com sucesso.')
        this.openDialogCreateChild.open = false
      })
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
    clkOpenDialogDeleteChildren(child){
      this.dialogDeleteChildren.data = child
      this.dialogDeleteChildren.open = true
    },
    removeRelation(){
      const opt = {
        route: '/desktop/users/removeRelation',
        body: {
          childId: this.dialogDeleteChildren.data.childId
        },
      }
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if (r.error) {
          this.$q.notify('Ocorreu um erro. Tente novamente.')
          return
        }
        this.$q.notify('Filho deletado com sucesso.')
        this.dialogDeleteChildren.open = false
        this.getUserDetailById()
      })
    },
    getChildren(val, update, abort) {
      if(val.length < 3) {
        this.$q.notify('Digite no mínimo 3 caracteres')
        abort()
        return
      }
      const opt = {
        route: "/desktop/users/getChildren",
        body: {
          searchString: val,
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
        update(() => {
          this.childrenList = r.data;
        })
      });
    },
    createRelation() {
      if (this.userSelected === '' || this.relationTypeSelected === '')
      {
        this.$q.notify('Selecione a criança e o tipo de responsável')
        return
      }
      const opt = {
        route: '/desktop/users/createRelation',
        body: {
          responsibleId: this.$route.query.userId,
          childId: this.userSelected._id ? this.userSelected._id : this.userSelected,
          responsibleTypeId: this.relationTypeSelected._id
        },
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify('Ocorreu um erro. Tente novamente.')
          return
        }
        this.$q.notify('Filho adicionado com sucesso.')
        this.dialogInsertChild.open = false
        this.userSelected = ''
        this.relationTypeSelected = ''
        this.getUserDetailById()
      })
    },
    updateUserPermissions(value, evt, permission) {
      console.log(permission.id, 'permissio ind')
      const isActive = value ? 1 : 0
      console.log(isActive)
      const opt = {
        route: "/desktop/users/updateUserPermissions",
        body: {
          userId: this.userIdSQL,
          permissionId: permission.id,
          isActive
        }
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.getUserDetailById()
          utils.getPermissions()
        }
      });
    },
    getUserDetailById() {
      const opt = {
        route: "/desktop/users/getUserDetailById",
        body: {
          userId: this.$route.query.userId
        }
      };
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify("Ocorreu um erro, tente novamente por favor");
        } else {
          this.userData = r.data.userData
          this.childrenData = r.data.childData
          r.data.allPermissions ? this.allPermissions = r.data.allPermissions :
          this.allPermissions = [],
          this.userIdSQL = r.data.userId
          this.checkedPermissionsList = r.data.permissions
          this.allPermissions.forEach((all, i) => {this.allPermissions[i].checked = false;})
          this.allPermissions.forEach((all, i) => {
            this.checkedPermissionsList.forEach((checked) => {
              if (all.id === checked.id) {
                this.allPermissions[i].checked = true;
              }
              if(checked.id === 1){
                this.familiarChecked = true
              }
            });
          });
        }
      });
    },
  }
})
</script>
<style scoped>
.visions-field {
  border: 1px solid #c2c2c2;
  padding: 7px;
  border-radius: 0.2rem;
  max-height: 300px;
  overflow-y: auto;
}
</style>

