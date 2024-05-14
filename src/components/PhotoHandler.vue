<template>
  <div>
    <q-dialog v-model="openDialog" class="app-font" @hide="clkBack">
      <q-card style="border-radius: 1rem;">
        <q-card-section>
          <div class="text-h6 text-center">Escolha uma opção</div>
        </q-card-section>

        <q-card-actions>
          <q-btn color="primary" flat no-caps label="Câmera" @click="openCamera" v-if="camera" />
          <q-btn color="primary" flat no-caps label="Galeria" @click="pickFile('gallery')" v-if="gallery"/>
          <q-btn color="primary" flat no-caps label="Arquivo" @click="pickFile('documents')" v-if="documents" />
          <q-btn color="red-8" flat no-caps label="Cancelar" @click="clkBack" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="dialogCrop.open" @hide="cancelCrop" class="app-font">
      <q-card style="border-radius: 1rem; width: 900px">
        <q-card-section>
          <cropper
            :src="img.webPath"
            @change="crop"
            v-if="imgType === 'camera'"
            style="max-height: 75vh;"
          />
          <cropper
            :src="img"
            @change="crop"
            v-if="imgType === 'gallery'"
            style="max-height: 75vh;"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="primary" flat no-caps label="Ok" @click="sendPhoto" />
          <q-btn color="red" flat no-caps label="Cancelar" @click="cancelCrop" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>


<script>
export default {
  name: 'PhotoHandler',
}
</script>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { Capacitor } from '@capacitor/core'
import utils from '../boot/utils';

import { 
  Camera, 
  CameraResultType, 
  CameraSource, 
  // Photo 
} from '@capacitor/camera';

const props = defineProps(['square', 'start', 'noCrop', 'camera', 'gallery', 'documents'])
const emits = defineEmits([
  'captured',
  'cancel'
])
let imageCaption = ref('')
const img = ref(null)
const imgType = ref(null)
const step = ref('initial')
const stencilProps = {}
const imageCropped = ref(null)
const openDialog = ref(false)
const dialogCrop = ref({
  open: false
})
let fileName = null

onMounted(() => {
  if (props.square) stencilProps.aspectRatio = 1
})

watch (props, (n, o) => {
  if (n.start) openDialog.value = true
})


function cancelCrop () {
  dialogCrop.value.open = false
  step.value = 'initial'
  imageCaption = ''
  emits('cancel')
}

async function openCamera () {

  imgType.value = 'camera'
  openDialog.value = false
  const tp = await Camera.getPhoto({
    resultType: CameraResultType.Uri,
    source: CameraSource.Camera,
    quality: 50,
    width: 400
  });
  fileName = 'Foto da câmera'
  img.value = tp
  openDialog.value = false
  if (props.noCrop) {
    sendPhoto(img.value)
  } else {
    step.value = 'crop'
    dialogCrop.value.open = true
  }
}

async function pickFile (type) {
  let types = ['image/*']
  if (type === 'documents') types = ['*']
  let res
  try {
    res = await FilePicker.pickMedia({ types, multiple: false });
  } catch (e) {
    emits('cancel')
    return
  }
  const file = res.files[0];
  
  if (file.path) {
    const fileSrc = Capacitor.convertFileSrc(file.path);
    const fileTemp = await fetch(fileSrc)
    file.blob = await fileTemp.blob()
  }

  openDialog.value = false
  fileName = file.name

  if (type === 'gallery' && !props.noCrop) {
    img.value = await convertBlobToBase64(file.blob)
    step.value = 'crop'
    imgType.value = 'gallery'
    dialogCrop.value.open = true
  } else if (type === 'documents' || (type === 'gallery' && props.noCrop)) {
    emits('captured', file, file.blob, file.name, imageCaption, '', type)
  }
}

function crop({ coordinates, canvas }) {
  imageCropped.value = canvas.toDataURL();
  utils.loading.hide()
}

async function sendPhoto (img) {
  const file = !props.noCrop ? await fetch(imageCropped.value) : await fetch(img.value)
  let fileBlob = await file.blob()
  fileBlob = new Blob([fileBlob], { type: 'image/png' })
  step.value = 'initial'
  dialogCrop.value.open = false
  emits('captured', file.url, fileBlob, fileName, imageCaption, null, 'camera' )
}

function clkBack () {
  step.value = 'initial'
  openDialog.value = false
  emits('cancel')
}

const convertBlobToBase64 = (blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = reject;
  reader.onload = () => {
      resolve(reader.result);
  };
  reader.readAsDataURL(blob);
});

</script>