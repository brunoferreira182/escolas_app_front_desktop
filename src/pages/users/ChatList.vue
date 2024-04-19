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
      <q-separator class="q-mx-sm " />
      <div class="row align-center">
        <div class="col-5 q-ma-md">
            <q-list v-if="resumeMessagesList">
              <q-scroll-area style="height: 84.85vh;">
                <q-item
                  class="q-px-none q-py-sm"
                  v-for="(item, i) in resumeMessagesList"
                  :key="i"
                  @click="openClassChat(resumeMessagesList[i]._id)"
                  clickable
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
                    <q-item-label caption v-if="item.lastMessage && item.lastMessage.createdAt">
                      {{ item.lastMessage.createdAt.createdAtLocale.split(' ')[1].slice(0, 5) }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-scroll-area>
            </q-list>
          </div>
          <q-separator vertical />
          <div class="col q-pa-sm q-mr-md " style="position:relative; ">
          <q-scroll-area ref="chatscrollarea" style="height: 100%;padding-bottom: 75px;" >
            <div style="display: flex; flex-direction: column; width: 100%; padding-inline: 10px;">

              <q-chat-message
                v-for="message in selectedClassMessages"
                :key="message._id"
                text-color="white"
                avatar="../../assets/default-avatar.svg"
              >
              <template v-slot:name>{{message.createdBy.name}}</template>
              <template v-slot:avatar>
                <img
                  class="q-message-avatar q-message-avatar--received"
                  src="../../assets/default-avatar.svg"
                >
              </template>
              <div> {{message.messageText}} </div>
              </q-chat-message>
              <q-chat-message
                sent
                bg-color="primary"
                text-color="white"
              >
              <div v-if="currentMessage !== ''"> {{currentMessage}} </div>
                <template v-slot:avatar>
                  <img
                    v-if="currentMessage !== ''"
                    class="q-message-avatar q-message-avatar--sent"
                    src="../../assets/default-avatar.svg"
                  >
                </template>
              </q-chat-message>
            </div>
          </q-scroll-area>

          <div
            style="display: flex; "
            class="fixed-bot items-center q-gutter-sm q-px-sm q-ma-sm bg-grey-3 ">
              <q-input
              v-if="inputStatus === 'message'"
              @keyup.enter="insertInternalMessage"
              v-model="currentMessage"
              bg-color="white"
              class="q-ma-sm full-width"
              outlined
              :readonly="!selectedClassMessages"
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
              v-if="currentMessage.length === 0 && inputStatus === 'message'"
              @click="clkAttach"
              round
              color="primary"
              icon="attach_file"
              :disabled="!selectedClassMessages"
              />
              <q-btn
              v-if="inputStatus === 'file'"
              @click="inputStatus = 'message';currentFile = null"
              round
              color="primary"
              icon="close"
            />
            <q-btn
              v-if="currentMessage.length > 0 || currentFile !== null"
              @click="insertInternalMessage"
              round
              color="primary"
              icon="send"
            />
            </div>
        </div>
      </div>
    </q-page>
  </q-page-container>
</template>

<script>
import utils from "../../boot/utils"
import useFetch from '../../boot/useFetch'

export default {
  name: 'MessengerChat',
  data() {
    return {
      inputStatus: 'message',
      currentFile: {},
      selectedClassMessages: null,
      currentMessage: '',
      utils,
      classIdSelected: '',
      messagesInClass: [],
      lastMessage: '',
      resumeMessagesList: null
    }
  },
  beforeMount() {
    this.getActiveClassesAndLastMessage()
    // this.startSocketResume()
  },
  beforeUnmount() {
    if (this.socket && this.socket.messages) this.socket.messages.disconnect()
    if (this.socket && this.socket.resume) this.socket.resume.disconnect()
  },
  methods: {
    insertInternalMessage(){
      if(this.currentMessage !== '' && this.currentMessage){
        const opt = {
          route: '/desktop/messenger/insertInternalMessage',
          body:{
            userId: this.classIdSelected,
            message: this.currentMessage,
          }
        }
        useFetch(opt).then((r) => {
          if(r.error){
            console.log('Internal Error')
          }
          console.log()
          this.currentMessage = ''
          // this.selectedClassMessages.push({
          //   _id: r.data._id, // Supondo que a resposta contenha o ID da mensagem
          //   createdBy: { name: 'Você' }, // Supondo que a mensagem enviada deve ser exibida como vinda do usuário atual
          //   messageText: r.data.message // Supondo que a resposta contém o texto da mensagem
          // })
        })
      }
    },
    clkAttach () {
      this.currentMessage = ''
      this.inputStatus = 'file'
      this.$nextTick(() => {
        this.$refs.filepicker.pickFiles();
      });
      // fp.pickFiles()
    },
    clkAttach(){
      console.log('CHupisco')
    },
    getActiveClassesAndLastMessage (){
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
    scrollToBottom () {
      this.$nextTick(() => {
        this.$refs.chatscrollarea.setScrollPercentage('vertical',2)
      })
    },
    openClassChat(classId) {
      this.classIdSelected = classId
      this.selectedClassMessages = null
      const opt = {
        route: '/desktop/messenger/getClassMessages',
        body: {
          classId: classId
        }
      }
      useFetch(opt).then((r) => {
        this.selectedClassMessages = r.data
        r.data.forEach(message => {
          this.messagesInClass.push(message.messageText)
        });
      })
    },
    pushMessage(msg, type) {
      if (msg.createdBy.userId === this.userInfo.userId) return;
      this.messagesList.push(msg);
      this.scrollToBottom();
    },
  }
}
</script>

<style>
.fixed-bot {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}
</style>

