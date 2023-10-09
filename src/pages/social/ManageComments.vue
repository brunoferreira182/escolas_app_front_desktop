<template>
  <q-page>
    <div class="q-pa-md justify-start">
      <div class="text-h5 q-mb-md">
        Gerenciar comentários
        <span class="text-subtitle1" v-if="$route.query.postId && comments[0]">
          - {{ comments[0].postTitle }}</span>
      </div>
      <div v-if="comments.length > 0">
        <div v-for="(comment,i) in comments" :key="i"  style="margin-block: 5px;">
          <q-card flat style="background-color: #e9e9e9; margin: 12px; border-radius: 1rem">
            <q-card-section>
              <div style="display: flex; align-items: center;">
                <div>
                  <div class="text-grey text-bold" style="text-transform: capitalize;">
                    {{ comment.createdBy.name }}
                  </div>
                  <div class="">
                    {{comment.text}}
                  </div>
                  <div v-if="!$route.query.postId" class="text-caption text-grey">
                    Postagem: {{comment.postData.title}}
                  </div>
                </div>
                <div class="text-caption text-grey" style="margin-left: auto;">{{ comment.createdAt.createdAtLocale.substring(0,16) }}</div>
                <q-btn
                  @click="clkOpenPostByComment(comment)"
                  flat
                  dense
                  class="q-ml-md"
                  color="orange-8"
                  icon="reply"
                >
                  <q-tooltip>Ir para post</q-tooltip>
                </q-btn>
                <q-btn
                  @click="deleteCommentsById(comment)"
                  flat
                  dense
                  class="q-ml-md"
                  color="red-8"
                  icon="delete"
                >
                  <q-tooltip>Deletar comentário</q-tooltip>
                </q-btn>
              </div>

            </q-card-section>
          </q-card>
        </div>
      </div>
      <div v-else class="text-subtitle1">
        Nenhum comentário registrado <q-icon name="warning" size="sm" color="red-8"/>
      </div>
    </div>

  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import useFetch from "../../boot/useFetch";
export default defineComponent({
  name: 'ManageComments',
  data () {
    return {
      comments: [],
      pagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
        sortBy: "",
      },
    }
  },
  beforeMount () {
    this.getPostComments()
  },
  watch: {
    '$route'() {
      this.getPostComments()
    }
  },
  methods: {
    moreComments() {
      // this.page++
      this.getPostComments()
    },
    clkOpenPostByComment(comment){
      const postId = comment.postData.postId
      this.$router.push('/social/postDetail?postId=' + postId)
    },
    getPostComments(){
      const page = this.pagination.page
      const rowsPerPage = this.pagination.rowsPerPage
      const opt = {
        route: '/desktop/social/getPostComments',
        body: {
          page: page,
          rowsPerPage: rowsPerPage,
        }
      }
      if (this.$route.query.postId)opt.body.postId = this.$route.query.postId
      useFetch(opt).then(r => {
        r.data.count[0] ? this.pagination.rowsNumber = r.data.count[0].count : this.pagination.rowsNumber = 0
        this.comments = r.data.list
      })
    },
    deleteCommentsById(item) {
      const opt = {
        route: '/desktop/social/deleteCommentsById',
        body: {
          commentId: item._id
        }
      }
      this.$q.loading.show()
      useFetch(opt).then(r => {
        this.$q.loading.hide()
        this.getPostComments()
      })
    }
  }
})
</script>

