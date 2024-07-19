<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">Rematrícula</div>
        <div class="col text-right q-gutter-x-sm">
          <!-- <q-btn
            @click="updateRegistration"
            rounded
            color="primary"
            unelevated
            no-caps
          >
            {{
              $route.path === "/admin/registrationDetail" ? "Salvar" : "Criar"
            }}
            rematrícula
          </q-btn> -->
        </div>
      </div>
      <q-separator class="q-mx-md" />
      <div class="row justify-start q-pa-md">
        <div class="col-8 q-gutter-md" align="start">
          <div class="text-h5">Crianças</div>
          <q-list>
            <q-item v-for="(child, index) in registrationRequestData"
              :key="child"
              style="background-color:darkgrey; border-radius: 1rem; margin: 6px;"
            >
              <q-item-section avatar>
                <q-avatar>
                  <img :src="utils.makeFileUrl(child.childImage)">
                </q-avatar>
              </q-item-section>
              <q-item-section class="text-capitalize">
                {{ child.childName }}
              </q-item-section>
              <q-item-section>
                <q-btn
                  class="q-mr-xs"
                  flat
                  rounded
                  no-caps
                  color="primary"
                  :label="addFileButtonText"
                  @click="clkAddAttachment(index)"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <q-dialog
          v-model="dialogInactiveFunction"
          @hide="dialogInactiveFunction = false"
        >
          <q-card style="border-radius: 1rem">
            <q-card-section>
              <div class="text-h6 text-center">
                Tem certeza que deseja
                {{ isActive ? "inativar" : "ativar" }} essa rematrícula?
              </div>
            </q-card-section>
            <q-card-actions align="center">
              <q-btn
                flat
                label="Depois"
                no-caps
                color="primary"
                @click="dialogInactiveFunction"
              />
              <q-btn
                unelevated
                rounded
                label="Confirmar"
                no-caps
                color="primary"
                @click="isActive ? inactiveStatus() : activeStatus()"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <PhotoHandler
          :start="startPhotoHandler"
          :camera="true"
          :gallery="true"
          :documents="true"
          :noCrop="true"
          @captured="captured"
          @cancel="cancelPhotoHandler"
        />
      </div>
    </q-page>
  </q-page-container>
</template>

<script setup>
import utils from '../../boot/utils'
</script>

<script>
import useFetch from "../../boot/useFetch";
import PhotoHandler from '../../components/PhotoHandler.vue'
import { defineComponent } from "vue";
export default defineComponent({
  components: {
    PhotoHandler
  },
  name: "RegistrationsRequestedDetail",
  data() {
    return {
      registrationRequestData: [],
      isActive: null,
      dialogInactiveFunction: false,
      startPhotoHandler: false,
      canSendMessagesInClassChat: false,
      fileSelected: null,
      addFileButtonText: 'Clique para inserir o boleto',
      currentChildIndex: null, // Adiciona essa linha
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount(){
    this.getRegistrationRequestedDetailById()
  },
  methods: {
    captured(img, imgBlob, fileName) {
      this.step = 'initial'
      this.startPhotoHandler = false
      this.fileSelected = {
        file: imgBlob,
        name: fileName
      }
      this.addFileButtonText = fileName

      if (this.currentChildIndex !== null) {
        this.registrationRequestData[this.currentChildIndex].file = this.fileSelected;
      }
    },
    clkAddAttachment(index) {
      this.currentChildIndex = index; // Define o índice da criança atual
      this.step = 'addAttachment'
      this.startPhotoHandler = true
    },
    cancelPhotoHandler() {
      this.startPhotoHandler = false
      this.step = 'initial'
    },
    updateRegistration() {
      const opt = {
        route: "/desktop/adm/updateRegistration",
        body: {
          regRequestId: this.$route.query.regRequestId,
          title: this.registrationData.title,
          initialDate: this.registrationData.initialDate,
          finalDate: this.registrationData.finalDate,
          periodRef: this.registrationData.periodRef,
          description: this.registrationData.description,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        if (!r.error) {
          this.$q.notify('Rematrícula atualizada!')
          this.getRegistrationRequestedDetailById()
          return;
        }
        this.$q.notify("Ocorreu um erro, tente novamente mais tarde.");
      });
    },
    getRegistrationRequestedDetailById() {
      const opt = {
        route: "/desktop/adm/getRegistrationRequestedDetailById",
        body: {
          regRequestId: this.$route.query.regRequestId,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        if (!r.error) {
          this.registrationRequestData = r.data.childData
          return;
        }
        this.$q.notify("Ocorreu um erro, tente novamente mais tarde.");
      });
    },
    inactiveStatus() {
      const opt = {
        route: "/desktop/adm/changeRegistrationStatus",
        body: {
          regRequestId: this.$route.query.regRequestId,
          isActive: 'inactive'
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        if (!r.error) {
          this.$q.notify("Rematrícula inativada!");
          this.getRegistrationRequestedDetailById()
          this.dialogInactiveFunction = false
          return;
        }
        this.$q.notify("Ocorreu um erro, tente novamente mais tarde.");
      });
    },
    activeStatus() {
      const opt = {
        route: "/desktop/adm/changeRegistrationStatus",
        body: {
          regRequestId: this.$route.query.regRequestId,
          isActive: 'active'
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        if (!r.error) {
          this.$q.notify("Rematrícula Ativada!");
          this.getRegistrationRequestedDetailById()
          this.dialogInactiveFunction = false
          return;
        }
        this.$q.notify("Ocorreu um erro, tente novamente mais tarde.");
      });
    },
  },
});
</script>
