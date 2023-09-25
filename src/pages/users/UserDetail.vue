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
            color="green-8"
            outline
            size="md"
          >
            {{ userData.status.label }}
          </q-chip>
        </div>
      </div>
      <q-separator class="q-mx-md"></q-separator>
      <div class="row justify-center items-start">
        <div class="col-12 q-pa-md q-gutter-md">
          <div class="text-h4">Informações</div>
          <div class="text-h5">
            E-mail: {{ userData.email }}
          </div>
          <div class="text-h5">
            Telefone: {{ userData.phone }}
          </div>
          <div class="text-h5">
            Usuário: {{ userData.user }}
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
    }
  },
  mounted() {
    this.$q.loading.hide()
  },
  beforeMount() {
    this.getUserDetailById()
  },
  methods: {
    getUserDetailById() {
      const opt = {
        route: "/desktop/users/getUserDetailById",
        body: {
          userId: this.$route.query.userId
        }
      };
      useFetch(opt).then((r) => {
        this.userData = r.data
      });
    },
  }
})
</script>

