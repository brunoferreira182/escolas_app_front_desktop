<template>
  <q-page-container class="no-padding">
    <q-page >
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">
          {{ userData.name }}
          <div class="text-caption">Dados de usuário</div>
        </div>
        <div class="col q-gutter-sm text-right">
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
            <q-input
              outlined
              readonly
              v-model="userData.email"
              label="E-mail"
            />
            <q-input
              outlined
              readonly
              v-model="userData.phone"
              label="Telefone"
            />
            <q-input
              outlined
              readonly
              v-model="userData.user "
              label="Usuário"
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
    </q-page>
  </q-page-container>
</template>
<script>
import { defineComponent } from 'vue'
import useFetch from '../../boot/useFetch'
export default defineComponent({
  name: 'UserDetail',
  data() {
    return {
      userData: {},
      permissions:[],
      allPermissions: [],
      checkedPermissionsList: [],
      userIdSQL: '',
      isActive: 0,
    }
  },
  mounted() {
    this.$q.loading.hide()
  },
  beforeMount() {
    this.getUserDetailById()
  },
  methods: {
    updateUserPermissions(value, evt, permission) {
      console.log('permission', permission)
      console.log('value', value)
      console.log('evt', evt)
      const isActive = value ? true : false
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

