<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">
          Novo departamento
        </div>
        <div class="col text-right">
          <q-btn
            @click="clkSave"
            rounded
            color="primary"
            unelevated
            no-caps
            label="Salvar"
          />
        </div>
      </div>
      <q-separator class="q-mx-md" />
      <div class="row justify-around q-pa-md" >
        <div class="col-12 q-gutter-md" align="start">
          <!-- <div class="text-h5">
            Preencha os dados
          </div> -->
          <!-- <div class="no-margin q-px-md text-caption">Departamento</div> -->
          <q-input
            outlined
            v-model="departmentData.name"
            label="Nome"
          />
          <q-input
            outlined
            v-model="departmentData.description"
            label="Descrição"
          />
        </div>
      </div>

    </q-page>
  </q-page-container>
</template>

<script setup>
import useFetch from "../../boot/useFetch";
import { defineComponent } from "vue";
</script>
<script>


export default defineComponent({
  name: "NewDepartment",
  data() {
    return {
      departmentData: {
        name: '',
        description: ''
      }
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  methods: {
    async clkSave () {
      const opt = {
        route: "/desktop/adm/createDepartment",
        body: {
          departmentData: this.departmentData
        }
      }
      this.$q.loading.show()
      const r = await useFetch(opt)
      this.$q.loading.hide()
      if (r.error) return
      // this.$router.push('/admin/departmentDetail?departmentId=' + r.data.departmentId)
    }
  },
});
</script>
