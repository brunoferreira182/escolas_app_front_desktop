<template>
  <div class="text-center">
    <q-img
      src='../assets/logo.png'
      width="50%"
      v-if="logoAndColors.type === 'default'"
      class="q-my-lg"></q-img>
    <q-img :src="$attachmentsAddress() + 'logo_cid_' + logoAndColors.cId + '.png'" width="50%" v-else></q-img>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'DrawerLogo',
  data () {
    return {
      userInfo: null,
      logoAndColors: {
        type: 'default',
        cId: null
      }
    }
  },
  beforeMount () {
    // this.getLogoAndColors()
  },
  // methods: {
  //   async getLogoAndColors () {
  //     await this.$logoAndColors.getFromServer(this.$presentUserInfo().cId)
  //     this.logoAndColors = this.$logoAndColors.get()
  //   }
  // },
  // watch: {
  //   $route (to, from){
  //     this.logoAndColors = this.$logoAndColors.get()
  //   }
  // }
})
</script>