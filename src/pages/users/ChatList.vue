<template>
  <q-page-container class="no-padding no-margin">
    <q-page >
      <div class="row q-px-md q-gutter-md items-center">
        <div class="col q-pa-md text-left text-h5">
          Chat de Turmas
        </div>
        <!-- botões ao lado do título -->
        <!-- <div class="col text-right">
          <div class="row justify-center items-center">
            <div class="col">
            </div>
            <div class="col">
            </div>
          </div>
        </div> -->
      </div>
      <q-separator class="q-mx-" />
      <div class="row">
        <div class="col-5 q-ma-md">
            <!-- <q-input v-model="search" @keyup="getUsersList()" outlined dense type="search" class="q-mx-sm"
              placeholder="Buscar usuários">
              <template v-slot:append>
                <q-icon name="search" @click="getUsersList()"/>
              </template>
            </q-input> -->
            <q-list v-if="resumeMessagesList">
              <q-scroll-area style="height: 84.85vh;">
                <q-item
                  class="q-px-none q-py-sm"
                  v-for="(item, i) in resumeMessagesList"
                  :key="i"
                  clickable
                  @click="openClassChat(resumeMessagesList[i]._id)"
                >
                  <q-item-section avatar class="q-pl-sm">
                    <q-avatar>
                      <q-img src="../../assets/default-avatar.svg"></q-img>
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-subtitle1">
                      {{ item.className }}
                    </q-item-label>
                    <q-item-label class="text-grey-7">
                      <div v-if="item.lastMessage">
                        {{ item.lastMessage.messageData.message }}
                      </div>
                      <!-- <div v-else>
                        <div v-if="item.lastMessage.file">
                          <i>{{ item.lastMessage.file.includes('image') ? 'Enviou uma imagem' : 'Enviou um arquivo.' }}</i>

                        </div>
                      </div> -->
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side class="q-mr-md">
                    <q-item-label caption>
                      {{ item.lastMessage.createdAt.createdAtLocale.split(' ')[1].slice(0, 5) }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-scroll-area>
            </q-list>
            <!-- <div v-else
              class="text-center q-mt-xl text-subtitle1 q-mx-md text-grey-8">
              Não foram encontrados clientes.
            </div> -->
        </div>
        <q-separator vertical />
        <div class="col q-pa-sm q-ma-sm"
          v-if="selectedClassMessages || !selectedClassMessages===''"
        >
        {{ selectedClassMessages.messageText }} {{ selectedClassMessages.messageAudio }}

        </div>
        <!-- <div class="col-8" style="height: 95.3vh;">
          <div @click="clkUserProfile(selectedClient.userId)"
            style="height:6%;display:flex;align-items: center;padding-left: 20px; gap: 15px;border-bottom: 1px ridge #e1e1e1;">
            <q-avatar v-if="selectedClient">
              <q-img src="../../assets/default-avatar.svg"></q-img>
            </q-avatar>
            <div v-if="selectedClient" class="text-h6">
              {{ selectedClient.name }}
            </div>
          </div>
          <div
            style="background-color: #f9f9f9; height: 94%;position: relative;width: 100%;border-left: 1px ridge #e1e1e1;">
            <div v-if="!selectedClient" style="position: absolute;top: 42%;"
              class="full-width text-center text-h6 text-grey-8">
              Selecione um usuário para começar a conversar
            </div>
            <q-scroll-area v-if="messagesLoaded" ref="chatscrollarea" style="height: 100%;padding-bottom: 75px;">
              <div style="display: flex;flex-direction: column;width: 100%;padding-inline: 10px;" class="q-mt-sm">
                <q-chat-message v-for="message in messagesList" :key="message._id" :name="message.createdBy.name"
                  avatar="../../assets/default-avatar.svg" :sent="message.sender !== 'client' ? true : false"
                  :stamp="message.createdAt.createdAtLocale.split(' ')[1].slice(0, 5)" @click="clkMessage(message)">
                  <div v-if="!message.messageData.file">{{ message.messageData.text }}</div>
                  <div v-else>
                    <img :src="`${$attachmentsAddress()}${message.messageData.file.filename}`" />
                  </div>
                </q-chat-message>
              </div>
            </q-scroll-area>
            <div
              style="position: absolute;bottom: 0;width: 100%; background-color: #d2dbe1; display: flex;align-items: center; gap: 12px; padding-inline:12px;">
              <q-input v-if="inputStatus === 'message'" style="width: 100%; margin: 10px;" @keyup.enter="insertInternalMessage"
                v-model="currentMessage" bg-color="white" class="q-ma-sm full-width" outlined
                :readonly="!selectedClient" />
              <q-file v-if="inputStatus === 'file'" style="width: 100%; margin: 10px;" ref="filepicker" outlined
                bg-color="white" v-model="currentFile" label="Clique aqui para escolher um arquivo" />
              <q-btn v-if="currentMessage.length === 0 && inputStatus === 'message'" @click="clkAttach" round
                color="primary" icon="attach_file" :disabled="!selectedClient" />
              <q-btn v-if="inputStatus === 'file'" @click="inputStatus = 'message'; currentFile = null" round
                color="primary" icon="close" />
            </div>
          </div>
        </div> -->
      </div>

      <!-- <q-dialog v-model="dialogDetailMessage.open">
        <q-card class="app-font" style="min-width: 300px;text-align: center;">
          <q-card-section>
            <div class="text-h6">Detalhes da mensagem</div>
          </q-card-section>
          <q-card-section v-if="dialogDetailMessage.messageData">
            <div v-if="!dialogDetailMessage.messageData.messageData.file">
              <div class="text-subtitle1">Mensagem de texto: <br /> {{ dialogDetailMessage.messageData.messageData.text }}
              </div>
            </div>
            <div v-else>
              <q-img v-if="dialogDetailMessage.messageData.messageData.file.mimetype.includes('image')"
                :src="`${$attachmentsAddress()}${dialogDetailMessage.messageData.messageData.file.filename}`" />
              <div style="text-decoration: underline;" v-else>Arquivo ou PDF enviado</div>
              <q-btn
                @click="downloadFile(`${$attachmentsAddress()}${dialogDetailMessage.messageData.messageData.file.filename}`)"
                class="q-mt-md " color="primary" outline no-caps size="large">
                Abrir arquivo
              </q-btn>
            </div>
          </q-card-section>
          <q-card-section v-if="dialogDetailMessage.messageData">
            Data de envio: {{ dialogDetailMessage.messageData.createdAt.createdAtLocale }}
          </q-card-section>
          <q-card-section>
            <div style="display: flex;justify-content: center;gap: 40px;">
              <q-btn @click="dialogDetailMessage.open = false" color="primary" flat>Fechar</q-btn>
              <q-btn v-if="userInfo.userId === dialogDetailMessage.messageData.createdBy.userId"
                @click="deleteMessage(dialogDetailMessage.messageData)" color="red" flat>Apagar</q-btn>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog> -->
    </q-page>
  </q-page-container>
</template>
<script>
import { date, openURL } from 'quasar'
import { io } from "socket.io-client";
import utils from "../../boot/utils"
import useFetch from '../../boot/useFetch'

export default {
  name: 'MessengerChat',
  data() {
    return {
      selectedClassMessages: null,
      utils,
      resumeMessagesList: null
    }
  },
  beforeMount() {
    this.getActiveClassesAndLastMessage()
    // this.startSocketResume()
  },
  beforeRouteLeave() {
    if (this.socket.messages) this.socket.messages.disconnect()
    if (this.socket.resume) this.socket.resume.disconnect()
  },
  methods: {
    getActiveClassesAndLastMessage () {
      const opt = {
        route: '/desktop/messenger/getActiveClassesAndLastMessage',
        body: {
          page: 1
        }
      }
      useFetch(opt).then(r => {
        this.resumeMessagesList = r.data
      })
    },
    openClassChat(classId) {
      const opt = {
        route: '/desktop/messenger/getClassMessages',
        body: {
          classId: classId
        }
      }
      useFetch(opt).then((r) => {
        this.selectedClassMessages = r.data
      })
      console.log('chupando pau', this.selectedClassMessages)
    }



    // startSocketResume: async function () {
    //   this.socket.resume = io(this.$masterServerRoute(), {
    //     query: {
    //       type: 'messengerResume',
    //       userId: 'userIdVSPcompanyId' + this.userInfo.companyId
    //     }
    //   })
    //   this.socket.resume.on('newMessage', msg => { this.getResumeMessages() })
    // },
    // startSocketMessages: async function (userId) {
    //   console.log('meda aquio?')
    //   this.socket.messages = io(this.$masterServerRoute(), {
    //     query: {
    //       type: 'messengerChat',
    //       connectionId: 'VSP-userId' + userId
    //     }
    //   })
    //   this.socket.messages.on('newMessage', msg => { this.pushMessage(msg, 'veio do socket') })
    // },
    // pushMessage(msg, type) {
    //   if (msg.createdBy.userId === this.userInfo.userId) return
    //   this.messagesList.push(msg)
    //   this.scrollToBottom()
    // },
    // getUsersList() {
    //   const opt = {
    //     route: '/desktop/users/getUsersList',
    //     body: {
    //       page: 1,
    //       rowsPerPage: 100,
    //       searchString: this.search
    //     }
    //   }
    //   useFetch(opt).then(r => {
    //     this.clientsList = r.data.list
    //   })
    // },
    // getMessages(id) {
    //   this.messagesLoaded = null
    //   const opt = {
    //     route: '/desktop/messenger/getMessages',
    //     body: {
    //       userId: id
    //     }
    //   }
    //   useFetch(opt).then(r => {
    //     this.messagesList = r.data
    //     this.messagesLoaded = 1
    //     this.scrollToBottom()
    //   })
    // },
    // scrollToBottom() {
    //   this.$nextTick(() => {
    //     this.$refs.chatscrollarea.setScrollPercentage('vertical', 2)
    //   })
    // },
    // getResumeMessages() {
    //   const opt = {
    //     route: '/desktop/messenger/getResumeMessages',
    //   }
    //   useFetch(opt).then(r => {
    //     this.resumeMessagesList = r.data
    //   })
    // },
    // insertInternalMessage() {
    //   console.log('qualquer coisa')
    //   if (this.currentMessage !== '' || this.currentFile) {
    //     const opt = {
    //       route: '/desktop/messenger/insertInternalMessage',
    //       body: {
    //         userId: this.selectedClient.userId,
    //         message: this.currentMessage
    //       },
    //     }
    //     if (this.currentFile) opt.file = [{ file: this.currentFile }, { name: 'arquivo' }]
    //     const id = this.selectedClient.userId
    //     useFetch(opt).then(r => {
    //       this.currentMessage = ''
    //       this.currentFile = null
    //       this.inputStatus = 'message'
    //       this.getMessages(id)
    //       this.getResumeMessages()
    //     })
    //   }
    // },
    // getClientInfoById(id) {
    //   console.log(id)
    //   const opt = {
    //     method: 'POST',
    //     route: '/desktop/messenger/getClientDetailById',
    //     body: {
    //       clientId: id,
    //     }
    //   }
    //   useFetch(opt).then(r => {
    //     this.selectedClient = r.data
    //     this.getMessages(id)
    //   })
    // },
    // clkContact(id, i, type) {
    //   console.log(id, i, type)
    //   // if (i >= 0) {
    //   //   this.resumeMessagesList[i].lastMessage.internalRead = 1
    //   // }
    //   this.getMessages(id)
    //   this.getClientInfoById(id)
    //   if (type === 'fromList') {
    //     try { this.socket.messages.disconnect() }
    //     catch (e) { console.log(e, 'nao ha o que desconectar') }
    //     this.startSocketMessages(id)
    //   }
    // },
    // clkMessage(message) {
    //   this.dialogDetailMessage.messageData = message
    //   this.dialogDetailMessage.open = true
    // },
    // deleteMessage(message) {
    //   const opt = {
    //     method: 'POST',
    //     route: '/desktop/messenger/updateMessageStatus',
    //     body: {
    //       messageId: message._id,
    //     }
    //   }
    //   useFetch(opt).then(r => {
    //     const id = this.selectedClient.userId
    //     this.getMessages(id)
    //     this.dialogDetailMessage.open = false
    //     this.dialogDetailMessage.messageData = null
    //   })
    // },
    // clkAttach() {
    //   this.currentMessage = ''
    //   this.inputStatus = 'file'
    //   this.$nextTick(() => {
    //     this.$refs.filepicker.pickFiles();
    //   });
    //   // fp.pickFiles()
    // },
    // downloadFile(address) {
    //   openURL(address)
    // },
    // clkUserProfile(userId) {
    //   this.$router.push('/admin/userDetail?_userId=' + userId)
    // }

  }
}
</script>

