<template>
  <div class="q-pa-md row">
    <div class="col">
      <div class="row">
        <div class="col-4">
          <div class="text-h5 q-mb-md">Criar novo post</div>
        </div>
        <div class="col-4 text-caption q-pa-xs">
          <q-checkbox
            dense
            label="Post em formato reduzido"
            v-model="isPostLight"
          >
            <q-tooltip>
              Formato reduzido é ideal para postagens informativas
            </q-tooltip>
          </q-checkbox>
        </div>
      </div>
      <div class="text-h6 q-mt-md" v-if="!isPostLight">Conteúdo</div>

      <Container
        v-if="!isPostLight"
        @drop="onDrop"
        lock-axis="y"
        :get-ghost-parent="getGhostParent"
        :remove-on-drop-out="false"
        @drop-ready="onDropReady"
        drag-handle-selector=".column-drag-handle"
      >
        <Draggable v-for="(item,i) in postData.detail" :key="i">
          <div class="row items-center q-mb-sm">
            <div class="col-12" style="display: flex;align-items: center;">
              <span class=" column-drag-handle" style="float:left;scale: 1.5;color: #c6c6c6 ;cursor:grabbing;;padding-inline:10px;margin-left: -10px;">&#x2630;</span>
              <q-input
                style="width: 100%;"
                v-if="item.type === 'text' && !isPostLight"
                :label="item.label"
                outlined
                v-model="item.value"
                autogrow
                @click.stop
              >

                <template v-slot:append>
                  <q-btn icon="colorize" :disabled="item.type !== 'text'" dense flat>
                    <q-menu auto-close anchor="bottom right" self="top right" style="width: 54px;overflow: hidden;">
                      <q-color
                      no-footer
                      v-model="item.color"
                      no-header
                      default-view="palette"
                      :palette="['#c2955d', '#222222','#6e6e6e']"

                      />
                    </q-menu>
                  </q-btn>
                  <q-btn @click="deleteItem(i)" icon="delete" dense flat></q-btn>
                </template>
              </q-input>
              <q-input
                style="width: 100%;"
                v-if="item.type === 'date' && isPostLight"
                :label="item.label"
                outlined
                v-model="item.value"
                mask="##/##/####"
                type="date"
                autogrow
                @click.stop
              >

                <template v-slot:append>
                  <q-btn icon="colorize" :disabled="item.type !== 'text'" dense flat>
                    <q-menu auto-close anchor="bottom right" self="top right" style="width: 54px;overflow: hidden;">
                      <q-color
                      no-footer
                      v-model="item.color"
                      no-header
                      default-view="palette"
                      :palette="['#c2955d', '#222222','#6e6e6e']"

                      />
                    </q-menu>
                  </q-btn>
                  <q-btn @click="deleteItem(i)" icon="delete" dense flat></q-btn>
                </template>
              </q-input>
              <q-file
                style="width: 100%;"
                outlined
                v-if="item.type === 'image'"
                v-model="item.value"
                accept=".jpg, image/*"
                :label="item.label + ' - Clique aqui para escolher uma imagem'"
                @update:model-value="createUrl(item)"
              >
                <template v-slot:append>
                  <q-btn icon="colorize" :disabled="item.type !== 'text'" dense flat>
                    <q-menu auto-close anchor="bottom right" self="top right" style="width: 54px;overflow: hidden;">
                      <q-color
                      no-footer
                      v-model="item.color"
                      no-header
                      default-view="palette"
                      :palette="['#c2955d', '#222222','#6e6e6e']"

                      />
                    </q-menu>
                  </q-btn>
                  <q-btn @click="deleteItem(i)" icon="delete" dense flat></q-btn>
                </template>
              </q-file>
              <hr style="width: 100%;" v-if="item.type === 'separator'">
            </div>
            <!-- <div class="col q-ml-md items-center q-gutter-sm">
              <q-btn icon="colorize" :disabled="item.type !== 'text'" dense flat>
                <q-menu auto-close anchor="bottom right" self="top right" style="width: 54px;overflow: hidden;">
                  <q-color
                  no-footer
                  v-model="item.color"
                  no-header
                  default-view="palette"
                  :palette="[
                      '#c2955d', '#222222','#6e6e6e'
                    ]"

                  />
                </q-menu>
              </q-btn>
              <q-btn @click="deleteItem(i)" icon="delete" dense flat></q-btn>
            </div> -->
          </div>
        </Draggable>
      </Container>
      <!-- botões -->
      <div class="row" v-if="!isPostLight">
        <div v-for="(item,i) in elementTypes" :key="i" class="row ">
          <q-btn
            :style="`color:white; ${item.class.includes('gold') ? 'background-color: #c2955d' : 'background-color: #222'}`"
            unelevated
            :label="item.label"
            @click="newInput(item)"
            no-caps
            class="q-ml-xs q-mt-xs"
          />
        </div>
      </div>
      <div class="text-h6 q-mt-md">Resumo</div>
      <div class="q-gutter-md">
        <q-input
          label="Título"
          outlined
          v-model="postData.resume.title"
          autogrow
        />
        <q-input
          label="Descrição"
          outlined
          v-model="postData.resume.description"
          autogrow
        />
        <q-input
          label="Data"
          outlined
          mask="##/##/####"
          v-model="postData.resume.date"
          autogrow
        />
        <q-file
          label="Foto de capa - Clique aqui para escolher uma imagem"
          outlined
          v-model="postData.resume.img"
          autogrow
          @update:model-value="createUrlCard(postData.resume.img)"
        />
        <q-btn
          label="Criar postagem"
          color="primary"
          no-caps
          unelevated
          v-if="!isPostLight"
          @click="createPost"
        />
        <q-btn
          label="Criar postagem"
          color="primary"
          no-caps
          unelevated
          v-else-if="isPostLight"
          @click="createNewSchoolEvent"
        />
        <q-dialog v-model="cardDialog">
          <div id="post" style="width: 370px;color: #222222;background-color: #f1e6db;border-radius: 0.4rem;overflow: hidden;">
            <img :src="cardImgURL" style="width: 370px;">
            <div id="post-content" style="padding:10px">
              <div style="margin: 0px;font-family: Montserrat;font-size: 24px;font-weight: 500;">{{ postData.resume.title }}</div>
              <div style="color: #6e6e6e;margin-top: 0px;font-family: Jakarta;font-size: 16px;">{{ postData.resume.description }}</div>
              <h6 style="color: #c2955d;font-weight: 500;font-family: Jakarta;margin:0;text-align: end;">Ler mais</h6>
            </div>
          </div>
        </q-dialog>

      </div>
    </div>
    <div class="col" style="position: relative;padding-top: 30px;">
      <div class="new-post" >
        <q-btn
          style="position: absolute;top: -50px;padding: 7px;z-index: 1000; right: 0;left: 0; margin-inline: auto;"
          :label="viewCard ? 'Post' : 'Card'"
          no-caps
          rounded
          dense
          color="primary"
          icon-right="360"
          unelevated=""
          @click="viewCard = !viewCard"
        />
        <div v-if="!viewCard" class="post-content-screen" style="overflow-y: scroll;overflow-x: hidden;height: 830px;overflow-wrap: normal;">
          <div v-for="(item,i) in postData.detail" :key="i">
            <div v-if="item.type === 'text'" :style="'color:' + item.color" :class="item.class">{{ item.value }}</div>
            <div v-if="item.type === 'image'" :class="item.class">
              <img :class="item.class" :src="item.url">
            </div>
            <q-separator :class="item.class" style="background-color: #eed5b4;color: #eed5b4;" v-if="item.type === 'separator'"/>
          </div>
        </div>
        <div v-if="viewCard" id="post" style="width: 370px;color: #222222;background-color: #f1e6db;border-radius: 0.4rem;overflow: hidden;">
          <img :src="cardImgURL" style="width: 370px;">
          <div id="post-content" style="padding:10px">
            <div style="margin: 0px;font-family: Montserrat;font-size: 24px;font-weight: 500;">{{ postData.resume.title }}</div>
            <div style="color: #6e6e6e;margin-top: 0px;font-family: Jakarta;font-size: 16px;">{{ postData.resume.description }}</div>
            <h6 style="color: #c2955d;font-weight: 500;font-family: Jakarta;margin:0;text-align: end;">Ler mais</h6>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { ref } from 'vue'
import { defineComponent } from 'vue'
import { Container, Draggable } from "vue3-smooth-dnd";
import useFetch from "../../boot/useFetch";
export default defineComponent({
  components: {Container, Draggable},
  name: 'CreateNewPost',
  data () {
    return {
      viewCard: false,
      image: null,
      cardDialog: false,
      isPostLight: false,
      cardImgURL: '',
      postData: {
        resume: {
          title: '',
          description: '',
          date: '',
          img : null,
        },
        detail: [
          {
            label: 'Título',
            type: 'text',
            class:'post-title',
            value: '',
            color:'#222222'
          }
        ]
      },
      elementTypes: [
        {
          label: 'Título',
          type: 'text',
          class:'post-title',
          value: '',
          color: '#222222'
        },
        {
          label: 'Subtítulo 1',
          type: 'text',
          class:'post-subtitle-1',
          value: '',
          color: '#c2955d'
        },
        {
          label: 'Subtítulo 2',
          type: 'text',
          class:'post-subtitle-2',
          value: '',
          color: '#c2955d'
        },
        {
          label: 'Parágrafo',
          type: 'text',
          class:'post-p',
          value: '',
          color: '#6e6e6e'
        },
        {
          label: 'Imagem',
          type: 'image',
          class:'post-image',
          value: null
        },
        {
          label: 'Divisor',
          type: 'separator',
          class:'post-separator',
        },
      ]
    }
  },
  methods: {
    uploadImg () {
      this.qeditor = this.qeditor + ('<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Bananas_%28Alabama_Extension%29.jpg/280px-Bananas_%28Alabama_Extension%29.jpg"/>')
    },
    newInput (item) {
      this.postData.detail.push({...item})
    },
    createUrl (item) {
      if (item.value !== '') {
        console.log('fooi')
        item.url =  URL.createObjectURL(item.value);
        console.log(item.url)
        console.log(item.value)
      }
    },
    createUrlCard (item) {
      if (item !== '') {
        this.cardImgURL =  URL.createObjectURL(item)
      }
    },
    deleteItem (i) {
      this.postData.detail.splice(i,1)
    },
    onDrop(dropResult){
      this.postData.detail = this.applyDrag(this.postData.detail, dropResult);
    },
    applyDrag(arr, dragResult){
      const { removedIndex, addedIndex, payload } = dragResult;

      if (removedIndex === null && addedIndex === null) return arr;
      const result = [...arr];
      let itemToAdd = payload;

      if (removedIndex !== null) {
        itemToAdd = result.splice(removedIndex, 1)[0];
      }
      if (addedIndex !== null) {
        result.splice(addedIndex, 0, itemToAdd);
      }
      return result;
    },
    getGhostParent(){
      return document.body;
    },
    onDropReady(dropResult){
      console.log('drop ready', dropResult);
    },
    createNewSchoolEvent () {
      if (!this.postData.resume.img) {
        this.$q.notify('Erro ao criar postagem, verifique se todos os campos estão preenchidos.')
        return
      }
      const files = [{file:this.postData.resume.img,name:'postImage'}]
      this.postData.detail.forEach(item => {
        if(item.type === 'image') {
          if (item.value === null) {
            this.$q.notify('Erro ao criar postagem, insira uma imagem.')
            return
          }
          files.push({file:item.value,name:'postImage'})
          delete item.value
          delete item.url
        }
        delete this.postData.resume.img
      })
      console.log(this.postData.detail)
      console.log('array de imagens',files)
      const opt = {
        route: '/desktop/social/createNewSchoolEvent',
        body: this.postData,
        file: files
      }
      this.$q.loading.show()
      useFetch(opt).then(r => {
        this.$q.loading.hide()
        if(r.error){
          this.$q.notify('Erro ao criar postagem, tente novamente mais tarde.')
          return
        }this.$router.back()
      })
    },
    createPost () {
      if (!this.postData.resume.img) {
        this.$q.notify('Erro ao criar postagem, verifique se todos os campos estão preenchidos.')
        return
      }
      const files = [{file:this.postData.resume.img,name:'postImage'}]
      this.postData.detail.forEach(item => {
        if(item.type === 'image') {
          if (item.value === null) {
            this.$q.notify('Erro ao criar postagem, insira uma imagem.')
            return
          }
          files.push({file:item.value,name:'postImage'})
          delete item.value
          delete item.url
        }
        delete this.postData.resume.img
      })
      console.log(this.postData.detail)
      console.log('array de imagens',files)
      const opt = {
        route: '/desktop/social/addNewPost',
        body: this.postData,
        file: files
      }
      this.$q.loading.show()
      useFetch(opt).then(r => {
        this.$q.loading.hide()
        if(r.error){
          this.$q.notify('Erro ao criar postagem, tente novamente mais tarde.')
          return
        }this.$router.back()
      })
    }
  }
})
</script>
<style >


.color-primary {
  color: #222222;
}
.color-secondary {
  color: #c2955d;
}

.post-title {
  color: #222222;
  font-size: 26px;
  margin-bottom: 20px;
  margin:10px
}
.post-subtitle-1 {
  color: #222222;
  font-size: 24px;
  margin:10px

}
.post-subtitle-gold-2 {
  color: #c2955d;
  font-size: 22px;
  margin:10px
}
.post-subtitle-gold-1 {
  color: #c2955d;
  font-size: 24px;
  margin:10px

}
.post-subtitle-2 {
  color: #222222;
  font-size: 22px;
  margin:10px
}
.post-p {
  font-size: 16px;
  color: #6e6e6e;
  margin:10px

}
.post-image {
  width: 100%;
  border-radius: 0.4rem;
}

.post-separator {
  margin: 10px;
  background: #eed5b4;
  color: #eed5b4;
}

h4 {
  font-size: 20px;
}
h5 {
  font-size: 18px;
}
h6 {
  font-size: 16px;
}
.new-post::-webkit-scrollbar {
  display: none;
}

.post-content-screen::-webkit-scrollbar {
  display: none;
}

.new-post {
  position: sticky;
  top: 50px;
  background: #FFFCF5;
  height: 844px;
  width: 394px;
  border: 2px solid grey;
  border-radius: 1rem;
  margin: 10px;
  /* margin-left: 20%; */
  padding: 10px;
  font-family: Jakarta;
  color: #222222;
}

</style>
