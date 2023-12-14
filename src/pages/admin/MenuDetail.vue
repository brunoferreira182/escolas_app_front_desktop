<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">
          {{ menuName}}
          <div class="text-caption">Detalhe do cardápio</div>
        </div>
        <div class="col text-right q-gutter-x-sm">
          <q-btn
            v-if="isActive === 1"
            @click="dialogInactiveMenu = true"
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
            @click="dialogInactiveMenu = true"
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
            @click="updateMenu"
            rounded
            color="primary"
            unelevated
            no-caps
          >
            {{
              $route.path === "/admin/menuDetail"
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
            Dados
          </div>
          <q-input
            outlined
            label="Nome do cardápio"
            hint="Ex: Cardápio segunda-feira"
            v-model="menuName"
          />
          <q-input
            outlined
            label="Data do cardápio"
            type="date"
            v-model="menuDate"
          />
          <div class="text-subtitle">
            Insira o cardápio abaixo
          </div>
          <q-editor
            v-model="menuContent"
            min-height="5rem"
          />
        </div>
      </div>
      <q-dialog v-model="dialogInactiveMenu" @hide="dialogInactiveMenu = false">
        <q-card style="border-radius: 1rem">
          <q-card-section>
            <div class="text-h6 text-center">
              Tem certeza que deseja {{ isActive ? "inativar" : "ativar" }} esse
              cardápio?
            </div>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn
              flat
              label="Depois"
              no-caps
              color="primary"
              @click="dialogInactiveMenu = false"
            />
            <q-btn
              unelevated
              rounded
              label="Confirmar"
              no-caps
              color="primary"
              @click="isActive ? inactiveMenu() : activeMenu()"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page>
  </q-page-container>
</template>
<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
export default defineComponent({
  name: "MenuDetail",
  data() {
    return {
      menuName: '',
      menuContent: '',
      menuDate: '',
      isActive: null,
      dialogInactiveMenu: false,
    };
  },
  mounted() {
    this.$q.loading.hide();
    this.getMenuDetailById()
  },
  methods: {
    inactiveMenu() {
      const opt = {
        route: "/desktop/adm/inactiveMenu",
        body: {
          menuId: this.$route.query.menuId
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente mais tarde.')
          return
        } this.$q.notify('Cardápio inativado com sucesso!')
          this.$router.back()
      });
    },
    activeMenu() {
      const opt = {
        route: "/desktop/adm/activeMenu",
        body: {
          menuId: this.$route.query.menuId
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente mais tarde.')
          return
        } this.$q.notify('Cardápio ativado com sucesso!')
          this.$router.back()
      });
    },
    getMenuDetailById() {
      const opt = {
        route: "/desktop/adm/getMenuDetailById",
        body: {
          menuId: this.$route.query.menuId
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente mais tarde.')
          return
        }this.menuName = r.data.name
        this.menuContent = r.data.content
        this.menuDate = r.data.date
        this.isActive = r.data.isActive
      });
    },
    getMenuDetailById() {
      const opt = {
        route: "/desktop/adm/getMenuDetailById",
        body: {
          menuId: this.$route.query.menuId
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente mais tarde.')
          return
        }this.menuName = r.data.name
        this.menuContent = r.data.content
        this.menuDate = r.data.date
        this.isActive = r.data.isActive
      });
    },
    updateMenu() {
      if(this.menuName === '' || this.menuContent === '' || this.menuDate === ''){
        this.$q.notify('Preencha todos os campos para prosseguir.')
        return
      }
      const opt = {
        route: "/desktop/adm/updateMenu",
        body: {
          name: this.menuName,
          content: this.menuContent,
          date: this.menuDate,
          menuId: this.$route.query.menuId
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente mais tarde.')
          return
        } this.$q.notify('Cardápio atualizado com sucesso!')
          this.$router.back()
      });
    },
  },
});
</script>
