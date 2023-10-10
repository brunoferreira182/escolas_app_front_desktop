<template>
  <q-layout class="app-font" view="lHh LpR LFf" id="idMainLayout">
    <div class="">
      <div class="col-11">
        <q-header>
          <q-toolbar class="bg-grey-3 text-primary" id="idMainToolbar">
            <q-btn
              flat
              dense
              round
              icon="menu"
              aria-label="Menu"
              @click="clkDrawer"
            />
            <q-toolbar-title class="text-primary">
              Escolas App
            </q-toolbar-title>
            <q-input
              dense
              dark
              standout
              v-model="filterValue"
              input-class="text-left"
              class="q-mx-md text-primary"
              color="primary"
            >
              <template #:append>
                <q-icon
                  v-if="filterValue === ''"
                  name="search"
                  color="primary"
                />
                <q-icon
                  v-else
                  name="clear"
                  class="cursor-pointer"
                  @click="
                    filterValue = '';
                    searchResult = [];
                  "
                  color="primary"
                />
              </template>
            </q-input>
            <div class="q-mr-md">
              <q-btn auto-close icon="notifications" dense flat>
                <q-badge
                  v-if="statusNotificationsList.length > 0"
                  floating
                  color="teal"
                >
                  {{
                    statusNotificationsList.length >= 10
                      ? "+" + statusNotificationsList.length
                      : statusNotificationsList.length
                  }}
                </q-badge>
                <q-menu anchor="bottom left" class="app-font" no-padding>
                  <q-list separator>
                    <q-item
                      v-for="notification in statusNotificationsList"
                      :key="notification._id"
                      clickable
                      v-close-popup
                      style="min-width: 320px; padding: 0px"
                      @click="clkOpenExpenseDetail(notification)"
                    >
                      <q-item-section class="q-pa-sm">
                        <q-item-label v-if="notification.apelidoDespesa !== ''">
                          {{ notification.apelidoDespesa }}
                        </q-item-label>
                        <q-item-label v-else> Despesa sem nome </q-item-label>
                        <q-item-label caption>
                          Novo status: {{ notification.status.label }}
                        </q-item-label>
                      </q-item-section>
                      <q-item-section
                        side
                        class="q-mr-md text-grey text-caption"
                        v-if="dateDay === notification.createdAtOnlyDate"
                      >
                        {{ notification.createdAtLocale.slice(11, 16) }}
                      </q-item-section>
                      <q-item-section
                        side
                        v-else
                        class="q-mr-sm q-mt-xs text-grey text-caption"
                      >
                        {{ dateDay.slice(0, 5) }}
                      </q-item-section>
                    </q-item>
                    <q-item
                      v-if="statusNotificationsList.length === 0"
                      clickable
                      v-close-popup
                      style="min-width: 300px; padding: 0px"
                    >
                      <q-item-section class="q-pa-md">
                        <div class="row items-center justify-center">
                          <div class="col-2">
                            <q-icon
                              name="notifications_off"
                              size="30px"
                              color="orange-6"
                            ></q-icon>
                          </div>
                          <div class="col-8">Não há notificações</div>
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      style="min-height: 60px"
                      @click="$router.push('/notifications')"
                    >
                      <q-item-section>
                        <q-item-label class="text-center text-primary">
                          Mostrar todas as notificações
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
            <div class="q-mr-md">
              <q-btn icon="home" dense flat @click="$router.push('/')">
                <q-tooltip anchor="bottom left" :offset="[10, 10]">
                  Ir para tela home
                </q-tooltip>
              </q-btn>
            </div>
            <div>
              <q-btn icon="logout" dense flat @click="$router.push('/login')">
                <q-tooltip anchor="bottom left" :offset="[10, 10]">
                  Desconectar-se
                </q-tooltip>
              </q-btn>
            </div>
          </q-toolbar>
        </q-header>
        <q-drawer
          v-model="leftDrawerOpen"
          show-if-above
          :width="300"
          class="bg-grey-3"
        >
          <div class="fit row justify-start" >
            <div class="col-3 gradient text-white text-center">
              <q-list>
                <q-item
                  :active="activeRightDrawer === item.id"
                  active-class="bg-grey-3 text-primary "
                  class="q-py-md text-center q-px-none"
                  :style="
                    i === indexMenu1 + 1
                      ? 'border-radius: 0 15px 0 0'
                      : i === indexMenu1 - 1
                      ? 'border-radius: 0 0 15px 0'
                      : ''
                  "
                  @click="clkItem(item, i)"
                  v-for="(item, i) in permissions"
                  :key="item.id"
                  clickable
                  v-ripple
                >
                  <q-item-section class="">
                    <q-item-label>
                      <q-icon
                        size="2rem"
                        :name="item.icon"
                        :color="
                          activeRightDrawer === item.id
                            ? 'primary'
                            : 'bg-accent'
                        "
                      >
                        <q-tooltip>
                          {{ item.label }}
                        </q-tooltip>
                      </q-icon>
                    </q-item-label>

                    <q-item-label class="text-caption">{{
                      item.nick
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
              <q-list>
                <q-item
                  class=" q-pa-none"
                  :style="
                    indexMenu1 === permissions.length - 1
                      ? 'border-radius: 0 15px 0 0'
                      : ''
                  "
                >
                </q-item>
              </q-list>
            </div>
            <div class="col-9">
              <DrawerLogo
              />
              <q-list class="q-mx-xs q-gutter-y-xs">
                <q-item
                  class="redondo"
                  v-for="item in options"
                  :key="item.route"
                  clickable
                  v-ripple
                  :active="active === item.label"
                  active-class="bg-blue-grey-2 text-primary"
                  @click="clkOptionMenu(item)"
                >
                  <q-item-section v-if="active === item.label" avatar>
                    <q-icon :name="item.icon" color="primary" />
                  </q-item-section>
                  <q-item-section v-else avatar>
                    <q-icon :name="item.icon" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ item.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </q-drawer>

        <q-page-container class="bg-grey-3">
          <q-scroll-area
            class="bg-white"
            :style="'height: ' + heightRouterView + 'px; border-radius: 15px;'"
          >
            <router-view
              :permissions="permissions"
              :drawer="leftDrawerOpen"
              :style="'height: ' + heightRouterView + 'px; border-radius: 15px;'"
              class="q-pa-sm"
            />
          </q-scroll-area>
        </q-page-container>
      </div>
    </div>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";
import DrawerLogo from "../components/DrawerLogo.vue";
import utils from "../boot/utils";
import { date, dom } from "quasar";
const { height } = dom;
export default defineComponent({
  name: "MainLayout",
  components: {
    DrawerLogo,
  },
  data() {
    return {
      indexMenu1: 0,
      statusNotificationsList: [],
      drawer: false,
      drawerRight: true,
      drawerData: true,
      filterValue: "",
      userInfo: "",
      activeMenu: "",
      permissions: [],
      leftDrawerOpen: true,
      active: "",
      activeRightDrawer: 1,
      options: [],
      dateNow: Date.now(),
      dateDay: date.formatDate(Date.now(), "DD/MM/YYYY"),
      dateTime: date.formatDate(Date.now(), "HH:mm"),
      heightRouterView: 0,
    };
  },
  mounted() {
    this.$q.loading.hide();
    this.heightRouterView =
      height(document.getElementById("idMainLayout")) -
      height(document.getElementById("idMainToolbar"));
  },
  beforeMount() {
    this.userInfo = utils.presentUserInfo();
    if (!this.userInfo || !this.userInfo.token) {
      this.$router.push("/login");
      return;
    }
    utils.getPermissions().then((r) => {
      this.permissions = r.data;
      this.permissions[0].id ? this.activeRightDrawer = this.permissions[0].id  : this.activeRightDrawer = 0
      if (
        this.$route.path === "/" ||
        this.$route.path === "/plans" ||
        this.$route.path === "/plans/home"
      ) {
        this.options = utils.getDrawerOptions("plans");
        this.active = this.options[0].label;
      } else {
        this.options = utils.getDrawerOptions(this.$route.path.split("/")[1]);
      }
      this.permissions.forEach((element) => {
        if (this.$route.path.split("/")[1] === element.role.toLowerCase()) {

          this.activeRightDrawer = element.id;
          this.indexMenu1 = this.permissions.indexOf(element);
        }
      });
      this.options.forEach((element) => {
        if (this.$route.fullPath === element.route) {
          this.active = element.label;
        }
      });
    });
    // this.getStatusNotifications()
    this.drawerData = this.drawer;
  },
  watch: {
    $route() {
      let existe = false;
      this.options.forEach((element) => {
        if (this.$route.path === element.route) {
          existe = true;
        }
      });
      if (!existe) {
        this.active = false;
      }
    },
  },
  methods: {
    async getCompanyColors() {
      await this.$logoAndColors.getFromServer(this.userInfo.cId);
      return;
    },
    clkOptionMenu(item) {
      this.$router.push(item.route);
      this.active = item.label;
    },
    clkDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    clkItem(item, i) {
      this.indexMenu1 = i;
      this.activeRightDrawer = item.id;
      this.$router.push("/" + item.role.toLowerCase());
      this.options = utils.getDrawerOptions(item.role.toLowerCase());
    },
    clkMenu(menuItem, i) {
      this.activeMenu = i;
      this.$router.push(menuItem.route);
    },
  },
});
</script>

<style scoped>
.gradient {
  transition: opacity 0.5s;
  background-image: linear-gradient(to bottom, #2c3393, #2675c3, #04acf3);

  background-size: 100%;
  background-repeat: repeat;
}
.borda-redonda {
  border-radius: 0 15px 15px 0;
}
.redondo {
  border-radius: 50px;
}
</style>
