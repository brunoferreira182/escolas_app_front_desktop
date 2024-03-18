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
          </div>
          <q-separator vertical />
          <div class="col q-pa-sm items-center">
          <q-scroll-area v-if="selectedClassMessages"  ref="chatscrollarea" >
            <div style="padding-inline: 10px;" class="q-mt-sm">
              <q-chat-message
                v-for="message in selectedClassMessages"
                :key="message"
                :name="message.createdBy.name"
                avatar="../../assets/default-avatar.svg"
                :stamp="message.createdAt.createdAtLocale.split(' ')[1].slice(0,5)"
              >
              <div v-if="!message.messageFile">{{ message.messageText }}</div>
              <!-- <div v-else>
                <q-img :src="`${$attachmentsAddress()}${message.messageFile}`" />
                </div> -->
              </q-chat-message>
            </div>
          </q-scroll-area>

          <div
            style="display: flex;"
            class="items-center q-gutter-sm q-px-sm q-ma-sm bg-grey-3 ">
            <q-input
              v-if="inputStatus === 'message'"
              @keyup.enter="newBkoMessage"
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
              @click="newBkoMessage"
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
    newBkoMessage(){
      console.log('CHUPA CU DA ROLA LONGA')
    },
    clkAttach(){
      console.log('CHUPA CU DA ROLa GROSAAA')
    },
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
    scrollToBottom () {
      this.$nextTick(() => {
        this.$refs.chatscrollarea.setScrollPercentage('vertical',2)
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
      console.log('CHUPADOR DE CANO CURTO', this.selectedClassMessages)
    }


  }
}
</script>

