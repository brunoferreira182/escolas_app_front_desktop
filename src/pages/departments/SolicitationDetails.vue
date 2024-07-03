<template>
  <q-page-container class="no-padding no-margin">
    <q-page >
      <div class="row q-px-md q-gutter-md items-center">
        <div class="col q-pa-md text-left text-h5">
          Detalhe solicitação
        </div>
      </div>
      <q-separator class="q-mx-sm " />
      <div class="row align-center">
        <div class="col-3 q-ma-sm" style="height: 84.85vh;">
          <q-list v-if="solicitationDetails" >
            <q-item>
              <q-item-section>
                <q-item-label caption>Aberto por</q-item-label>
                <q-item-label>{{ solicitationDetails.openedBy }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption>Departamento</q-item-label>
                <q-item-label>{{ solicitationDetails.departmentName }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption>Criado em</q-item-label>
                <q-item-label>{{ solicitationDetails.createdAt }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="solicitationDetails.childName">
              <q-item-section>
                <q-item-label caption>Para a criança</q-item-label>
                <q-item-label>{{ solicitationDetails.childName }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption>Status</q-item-label>
                <q-item-label>
                  <q-badge v-if="solicitationDetails.status === 'notRead'" color="red" label="Não tratada"/>
                  <q-badge v-else-if="solicitationDetails.status === 'inTreatment'" color="primary" label="Em tratamento"/>
                  <q-badge v-else-if="solicitationDetails.status === 'closed'" color="green" label="Fechada"/>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <div class="q-mt-lg q-mx-sm text-center" v-if="solicitationDetails?.status !== 'closed'">
            <q-btn
              label="Trocar depto."
              color="primary"
              unelevated
              rounded
              no-caps
              class="full-width q-mb-sm"
            >
              <q-menu>
                <q-list style="min-width: 100px">
                  <q-item-label header>Escolha o departamento</q-item-label>
                  <q-separator spaced />
                  <q-item
                    clickable
                    v-for="department in departments"
                    :key="department.departmentId"
                    @click="clkChgDepartment(department)"
                  >
                    <q-item-section>{{ department.name }}</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
            <q-btn
              label="Fechar solicitação"
              color="warning"
              unelevated
              rounded
              no-caps
              class="full-width"
              @click="clkCloseSolicitation"
            />
          </div>
        </div>
        <q-separator vertical />
        <div class="col q-pa-sm q-mr-md " style="position:relative; ">
        <q-scroll-area ref="chatscrollarea" style="height: 100%;padding-bottom: 75px;" >
          <div style="display: flex; flex-direction: column; width: 100%; padding-inline: 10px;">

            <q-chat-message
              v-for="message in messages"
              :key="message.messageId"
              text-color="white"
              :sent="message.sent"
            >
              <div>
                <p class="text-subtitle text-grey-8">
                  {{ message.createdBy.name }}
                </p>
                <div
                  v-if="message.messageFile"
                  @click="downloadFile(message.messageFile)"
                  class="cursor-pointer"
                >
                  <img
                    v-if="message.messageFile.mimetype && message.messageFile.mimetype.includes('image')"
                    style="border-radius:0.5rem; max-width: 260px;"
                    :src="utils.attachmentsAddress() + message.messageFile.filename"
                  >
                  <span
                    v-else
                    style="display:flex;align-items: center;"
                  >
                    <span>{{ message.messageFile.originalname }}</span>
                  </span>
                </div>
                {{message.messageText}}
                <div v-if="message.createdAt">{{ message.hour }}</div>
              </div>
            </q-chat-message>

          </div>
        </q-scroll-area>

        <div
          style="display: flex; "
          class="fixed-bot items-center q-gutter-sm q-px-sm q-ma-sm bg-grey-3 "
          v-if="solicitationDetails?.status !== 'closed'"
        >
          <q-input
            v-if="inputStatus === 'message'"
            @keyup.enter="insertNewMessage"
            v-model="newMessage"
            bg-color="white"
            class="q-ma-sm full-width"
            outlined
            :readonly="!messages"
          />
          <q-file
            v-if="inputStatus === 'file'"
            ref="filepicker"
            outlined
            bg-color="white"
            v-model="currentFile"
            label="Clique aqui para escolher um arquivo"
          />
          <q-btn
            v-if="newMessage.length === 0 && inputStatus === 'message'"
            @click="startPhotoHandler = true"
            round
            color="primary"
            icon="attach_file"
            :disabled="!messages"
          />
          <q-btn
            v-if="inputStatus === 'file'"
            @click="inputStatus = 'message';currentFile = null"
            round
            color="primary"
            icon="close"
          />
          <q-btn
            v-if="newMessage.length > 0 || currentFile !== null"
            @click="insertNewMessage"
            round
            color="primary"
            icon="send"
          />
        </div>
      </div>

      </div>

      <q-dialog v-model="dialogConfirm.open">
        <q-card>
          <q-card-section class="row items-center q-pb-none text-h6">
            Confirma?
          </q-card-section>
          <q-card-section>
            {{ dialogConfirm.text }}
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Fechar" no-caps color="primary" @click="dialogConfirm.open = false" />
            <q-btn flat label="Confirma" no-caps color="primary" @click="clkConfirmDialog" />
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
    </q-page>
  </q-page-container>
</template>

<script setup>
import PhotoHandler from '../../components/PhotoHandler.vue'
</script>

<script>
import utils from "../../boot/utils"
import useFetch from '../../boot/useFetch'


export default {
  name: 'SolicitationDetails',
  data() {
    return {
      inputStatus: 'message',
      currentFile: {},
      messages: null,
      newMessage: '',
      utils,
      solicitationDetails: null,
      page: 0,
      departments: [],
      dialogConfirm: {
        open: false,
        text: '',
        type: '',
        data: null
      },
      startPhotoHandler: false
    }
  },
  beforeMount() {
    this.getSolicitationDetails()
    this.getSolicitationMessages()
    this.getCompanyDepartments()
  },
  beforeUnmount() {
    // if (this.socket && this.socket.messages) this.socket.messages.disconnect()
    // if (this.socket && this.socket.resume) this.socket.resume.disconnect()
  },
  methods: {
    downloadFile (file) {
      console.log(file, 'aqui')
      utils.downloadFile({
        filename: file.filename,
        mimetype: file.mimetype,
        originalname: file.originalname
      })
    },
    captured(img, imgBlob, fileName) {
      this.startPhotoHandler = false
      this.fileSelected = {
        file: imgBlob,
        name: fileName
      }
      // this.newMessage = fileName
      this.insertNewMessage()
    },
    cancelPhotoHandler () {
      this.startPhotoHandler = false
    },
    async closeSolicitation () {
      const opt = {
        route: "/desktop/solicitations/changeSolicitationStatus",
        body: {
          solicitationId: this.$route.query.solicitationId,
          status: 'closed'
        },
      }
      this.$q.loading.show()
      const r = await useFetch(opt)
      this.$q.loading.hide()
      if (r.error) return
      this.$q.notify('Status alterado com sucesso')
      this.getSolicitationDetails()
      this.getSolicitationMessages()
    },
    async chgDepartment () {
      const opt = {
        route: "/desktop/solicitations/changeSolicitationDepartment",
        body: {
          solicitationId: this.$route.query.solicitationId,
          departmentId: this.dialogConfirm.data.departmentId
        },
      }
      this.$q.loading.show()
      const r = await useFetch(opt)
      this.$q.loading.hide()
      if (r.error) return
      this.$q.notify('Departamento alterado com sucesso')
      this.$router.back()
    },
    clkConfirmDialog () {
      this.dialogConfirm.open = false
      this[this.dialogConfirm.type]()
    },
    clkCloseSolicitation () {
      this.dialogConfirm = {
        open: true,
        text: `A solicitação será fechada definitivamente`,
        type: 'closeSolicitation',
        data: null
      }
    },
    clkChgDepartment (department) {
      this.dialogConfirm = {
        open: true,
        text: `Deseja realmente trocar o departamento para ${department.name}?`,
        type: 'chgDepartment',
        data: department
      }
    },
    async getCompanyDepartments () {
      const opt = {
        route: "/desktop/adm/getDepartments",
        body: {
          page: 1,
          rowsPerPage: 1000,
        },
      }
      const r = await useFetch(opt)
      if (r.error) return
      this.departments = r.data.list
    },
    async insertNewMessage () {
      const opt = {
        route: "/desktop/solicitations/newMessage",
        body: {
          solicitationId: this.$route.query.solicitationId,
          message: this.newMessage,
          type: 'workerMessage'
        },
      }
      if (this.fileSelected) {
        opt.file = [this.fileSelected]
      }
      const r = await useFetch(opt)
      if (r.error) return
      this.newMessage = ''
      this.fileSelected = null
      this.getSolicitationMessages()
    },
    
    async getSolicitationMessages (fPosix, lPosix, fromAnswer) {
      const opt = {
        route: "/desktop/solicitations/getSolicitationMessages",
        body: {
          solicitationId: this.$route.query.solicitationId,
          firstPosix: fPosix,
          lastPosix: lPosix,
          fromAnswer: fromAnswer,
          page: this.page
        },
      }
      const r = await useFetch(opt)
      if (r.error) return
      this.messages = r.data
      this.scrollToBottom()
    },
    async getSolicitationDetails () {
      const opt = {
        route: "/desktop/solicitations/getSolicitationDetails",
        body: {
          solicitationId: this.$route.query.solicitationId
        },
      }
      const r = await useFetch(opt)
      if (r.error) return
      this.solicitationDetails = r.data
    },
    scrollToBottom () {
      this.$nextTick(() => {
        this.$refs.chatscrollarea.setScrollPercentage('vertical',2)
      })
    },

  }
}
</script>

<style scoped>
.class-name-border{
  border-radius: 2rem;
}
.fixed-bot {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}
</style>

