<template>
  <div>
    <q-dialog v-model="open">
      <q-card style="border-radius: 1rem;">
        <q-card-section>
          <div class="text-h6 text-center">Escolha uma opção</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-btn color="primary" flat no-caps label="Câmera" @click="handleClick('camera')" />
          <q-btn color="primary" flat no-caps label="Galeria de fotos" @click="handleClick('gallery')" />
          <q-btn color="primary" flat no-caps label="Documentos" @click="handleClick('documents')" />
          <q-btn color="red-8" flat no-caps label="Cancelar" @click="handleClick('cancel')" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>


<script setup>
  import { ref, onMounted, watch } from 'vue'
  import { Cropper } from 'vue-advanced-cropper';
  import 'vue-advanced-cropper/dist/style.css';
  import { FilePicker } from '@capawesome/capacitor-file-picker';
  import { Capacitor } from '@capacitor/core'
  // import { useQuasar } from 'quasar';
  import utils from '../../src/boot/utils.js';

  import {
    Camera,
    CameraResultType,
    CameraSource,
    // Photo
  } from '@capacitor/camera';

  const props = defineProps(['square', 'allFiles', 'start', 'noCrop', 'open'])
  const emits = defineEmits([
    'captured',
    'cancel'
  ])
  let img = ref(null)
  let imgType = ref(null)
  let step = ref('initial')
  let stencilProps = {}
  let imageCropped = ref(null)
  let open = ref(false)
  // const $q = useQuasar();
  let fileName = null
  watch(() => props.start, (newVal) => {
    open.value = newVal;
  });
  const convertBlobToBase64 = (blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
</script>


<script>
export default {
  name: 'PhotoHandler',

  methods: {
    handleClick(option) {
      console.log(option);
      // const res = await actionSheet.onDidDismiss();
      if (!option) {
        step.value = 'initial'
        emits('cancel')
      } else if (option === 'camera') {
        this.openCamera()
      } else if (option === 'cancel') {
        step.value = 'initial'
        emits('cancel')
      } else {
        this.pickFile(option)
      }
    },
    async openCamera () {
      this.imgType.value = 'camera'

      const tp = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 50,
        width: 400
      });

      utils.loading.show()
      console.log('Foto tirada ', tp)
      fileName = 'Foto da câmera'
      img.value = tp
      console.log('numero 3 ')
      if (props.noCrop) {
        utils.loading.hide()
        sendPhoto(img.value)
      } else {
        step.value = 'crop'
      }
    },

    async pickFile (type) {
      let types = ['image/*']
      if (type === 'documents') types = ['application/pdf', 'video/quicktime']
      let res
      try {
        if (type === 'gallery' && !isPlatform('desktop')) {
          console.log('media',getPlatforms())
          res = await FilePicker.pickMedia({ types, multiple: false });
        } else {
          res = await FilePicker.pickFiles({ types, multiple: false });
        }
      } catch (e) {
        emits('cancel')
        return
      }
      const file = res.files[0];
      console.log("🚀 ~ pickFile ~ file:", file)

      if (file.path) {
        const fileSrc = Capacitor.convertFileSrc(file.path);
        const fileTemp = await fetch(fileSrc)
        file.blob = await fileTemp.blob()
      }

      if (type === 'gallery' && !props.noCrop) {
        // img.value é base64

        img.value = await convertBlobToBase64(file.blob)
        step.value = 'crop'
        imgType.value = 'gallery'
      } else if (type === 'documents' || (type === 'gallery' && props.noCrop)) {
        utils.loading.hide()
        this.$emit('captured', file, file.blob, file.name, '', type)
      }
    },

    crop({ coordinates, canvas }) {
      console.log('antes de terminar o crop')
      imageCropped.value = canvas.toDataURL();
      console.log('depois de terminar o desenho dentro do crop')
      utils.loading.hide()
    },

    async sendPhoto (img) {
      const file = !props.noCrop ? await fetch(imageCropped.value) : await fetch(img.value)
      let fileBlob = await file.blob()
      fileBlob = new Blob([fileBlob], { type: 'image/png' })
      step.value = 'initial'
      utils.loading.hide()
      emits('captured', file.url, fileBlob, fileName, null, 'camera' )
    },

    clkRestart() {
      step.value = 'initial'
      // openCamera()
      showBottomSheet()
    },

    clkBack () {
      step.value = 'initial'
      emits('cancel')
    }
  },
};
</script>
