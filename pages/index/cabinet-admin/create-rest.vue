<script lang="ts" setup>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import getPossibleLocations from "~/composables/dadata";
import type { Location } from "~/types/location.interface"
import { toast } from 'vue3-toastify'

// meta
useHead({
  title: 'Создать ресторан'
})
definePageMeta({
  middleware: 'auth'
})
const config = useRuntimeConfig()

// other imports
import { useField, useForm } from 'vee-validate'

const restStore = useRest()
const authStore = useAuth()
const router = useRouter()

let loading = ref(false)
let schedule = ref('')
let description = ref('')



const { meta, handleSubmit, validate } = useForm({
  initialValues: {
    title: '',
    type: '',
    alias: '',
    phone: '',
    socialMedia: '',
    menu: [],
    foodList: [],
    deleted: false
    // description: '',
    // schedule: ''
    // price: '',
    // images: <Array<File>>[],
    // location: {
    //   name: '',
    //   geo_lat: null,
    //   geo_lon: null
    // }
  },
  validationSchema: {
    title(value: string) {
      if (value?.trim().length < 2) return 'слишком короткий заголовок'
      if (value?.length > 32) return 'слишком длинный заголовок'

      return true
    },
    type(value: string) {
      if (value?.trim().length < 2) return 'слишком короткий заголовок'
      if (value?.length > 32) return 'слишком длинный заголовок'

      return true
    },
    alias(value: String) {
      if (value?.trim().length < 4) return 'слишком короткий псевдоним'
      if (value?.length > 32) return 'слишком длинный псевдоним'
      let regexp = /[а-яё]/i;
      if (regexp.test(value?.trim())) {
        return 'уберите кириллицу'
      }
      return true
    },
    phone(value: string) {
      // let regexp = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g
      let regexp = /(\+?\d{1,3})?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4}/
      if (!regexp.test(value?.trim())) return 'неправильный формат'

      return true
    },
    socialMedia(value: string) {
      let regexp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
      if (!regexp.test(value?.trim())) return 'неправильный формат'

      return true
    },

  },
})

let title = useField<string>('title')
let type = useField<string>('type')
let alias = useField<string>('alias')
let phone = useField<string>('phone')
let socialMedia = useField<string>('socialMedia')

let imagesFormData = new FormData()

let location = ref<any>(
)
const locationSearchRequest = ref<string>('');
const possibleLocations = ref<Location[] | undefined>(undefined);

let locationToSend = computed(() => {
  if (location.value) {
    location.value.type = 'Point'
    location.value.coordinates = [
      Number(location.value.geo_lat),
      Number(location.value.geo_lon)
    ]
    return location.value
  }
})


// base64 img
let logoPreview = ref()
function uploadLogo(file: File) {
  // example filename: logo_216262666_best-burger.jpg
  imagesFormData.set('logo', file, 'logo_' + String(Date.now()) + '_' + String(alias.value.value) + '.jpg')
  // make a preview
  let reader = new FileReader();
  reader.onloadend = function () {
    logoPreview.value = reader.result
  }
  reader.readAsDataURL(file);
}
// base64 img
let headerImagePreview = ref()
function uploadHeaderImage(file: File) {
  // example filename: headerimage_216262666_best-burger.jpg
  imagesFormData.set('headerimage', file, 'headerimage_' + String(Date.now()) + '_' + String(alias.value.value) + '.jpg')
  // make a preview
  let reader = new FileReader();
  reader.onloadend = function () {
    headerImagePreview.value = reader.result
  }
  reader.readAsDataURL(file);
}

// base64 img
let hallImagePreviews = ref<string[]>([])
function uploadHallImage(file: File, index: Number) {
  // example filename: headerimage_0_216262666_best-burger.svg
  imagesFormData.set('hallimage_' + String(index), file, 'hallimage_' + String(index) + '_' + String(Date.now()) + '_' + String(alias.value.value) + '.svg')
  // make a preview
  let reader = new FileReader();
  reader.onloadend = function () {
    hallImagePreviews.value.push(String(reader.result))
  }
  reader.readAsDataURL(file);
}
const submit = handleSubmit(async values => {
  if (!logoPreview.value || !headerImagePreview.value) {

    toast('Добавьте фото!', { type: 'warning' })
    return
  }

  loading.value = true

  let toSend = {
    ...values,
    location: locationToSend.value,
    description: description.value,
    schedule: schedule.value,
    author: String(authStore.user?._id),
    menu: [],
    foodList: []
  }

  let res = await restStore.create(toSend)

  if (res.status.value == 'success') {
    let _id = res.data.value._id
    let uplRes = await restStore.uploadImages(imagesFormData, _id)

    if (uplRes.status.value == 'success') {
      router.push('/')
    } else {
      console.log(uplRes);
    }
    loading.value = false
  } else {
    console.log(res);
  }
})

const options = reactive({
    theme: 'snow',
    modules: {
        clipboard: {
            allowed: {
                tags: ['a', 'b', 'strong', 'u', 's', 'i', 'p', 'br', 'ul', 'ol', 'li', 'span'],
                attributes: ['href', 'rel', 'target', 'class']
            },
            customButtons: [
                {
                    module: 'quillEmbeds',
                    allowedTags: ['embed'],
                    allowedAttr: ['width', 'height'],
                }
            ],
            keepSelection: true,
            substituteBlockElements: true,
            magicPasteLinks: true,
            hooks: {
                uponSanitizeElement(node:any, data:any, config:any) {
                    console.log(node);
                },
            },
        },
    },
})
function onReady(editor:any) {
      const quill = editor.getEditor()
      quill.clipboard.addMatcher('text/html', (node:any, utils:any) => {
        const text = utils.getText()
        // clean styles
        const cleanContent = text.replace(/(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)([^\s]+(.*)?)/g, '')
          .replace(/background:.*/g, '')
          .replace(/color:.*/g, '')
          .replace(/box-shadow:.*/g, '')

        return utils.createHTML(cleanContent)
      })
    }

watch(locationSearchRequest, async (value) => {
  const locations: any = await getPossibleLocations(value); // any - костыль надо переписать dadata.ts
  possibleLocations.value = locations ?? []; // Если locations undefined, присваиваем пустой массив
});

</script>
<template>
  <ClientOnly>

    <v-container>
      <v-row class="justify-center pb-16">
        <v-col :cols="12" :sm="10" class="pa-0">
          <v-form @submit.prevent="submit">
            <div class="font-weight-bold text-center" style="font-size: 20px;">Создать ресторан</div>

            <v-row>
              <v-col cols="12">
                <div class="label">Название</div>
                <v-text-field v-model="title.value.value" :error-messages="title.errorMessage.value"
                  placeholder="Шаурма" variant="outlined" density="compact" class="w-100" />
              </v-col>
              <v-col cols="12" md="6">
                <div class="label">Тип</div>
                <v-text-field v-model="type.value.value" :error-messages="type.errorMessage.value"
                  placeholder="кафе, магазин, доставка, ресторан" variant="outlined" density="compact" class="w-100" />
              </v-col>
              <v-col cols="12" md="6">
                <div class="label">Псевдоним</div>
                <v-text-field v-model="alias.value.value" :error-messages="alias.errorMessage.value"
                  placeholder="shaurma" variant="outlined" density="compact" class="w-100" />
                <div v-if="alias.value.value.length > 0" class="label text-right">
                  url ресторана: <i style="text-decoration: underline;">{{ config.public.siteUrl + '/' +
          alias.value.value
                    }}</i>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="label">Телефон</div>
                <v-text-field v-model="phone.value.value" :error-messages="phone.errorMessage.value"
                  placeholder="+79127528877" variant="outlined" density="compact" class="w-100" />
              </v-col>
              <v-col cols="12" md="6">
                <div class="label">Соц сеть</div>
                <v-text-field v-model="socialMedia.value.value" :error-messages="socialMedia.errorMessage.value"
                  placeholder="https://vk.com/shaurma" variant="outlined" density="compact" class="w-100" />
              </v-col>

              <v-col cols="12" md="6">
                <div class="label">Расписание</div>
                <div class="editor-container">
                  <QuillEditor v-model:content="schedule" theme="snow" contentType="html"
                    :toolbar="[['bold', 'italic', 'underline'], ['clean']]" />
                </div>

              </v-col>
              <v-col cols="12" md="6">
                <div class="label">Описание</div>
                <div class="editor-container">
                  <QuillEditor theme="snow" v-model:content="description" contentType="html"
                    :toolbar="[['bold', 'italic', 'underline'], [{ 'list': 'ordered' }, { 'list': 'bullet' }], ['clean']]"
                    :options="options"
                    />
                </div>
              </v-col>

              <v-col cols="12">
                <v-autocomplete hide-details density="compact" v-model="location" v-model:search="locationSearchRequest"
                  :items="possibleLocations" item-title="name" placeholder="Место" item-value="geo" variant="outlined"
                  clearable>
                  <template v-slot:no-data>
                    <div class="pt-2 pr-4 pb-2 pl-4">
                      {{ locationSearchRequest.trim().length < 3 ? "Минимум 3 символа" : "Не найдено" }} </div>
                  </template>
                </v-autocomplete>
              </v-col>


              <v-col :cols="12" style="position: relative; margin-bottom: 80px;"
                v-if="logoPreview || headerImagePreview">
                <div style="height:25vh">
                  <v-img :src="headerImagePreview" max-height="25vh" cover alt="" />
                </div>

                <div class="logo" v-if="logoPreview">
                  <img :src="logoPreview" alt="">
                </div>
              </v-col>


              <v-col :cols="12" class="d-flex justify-center">
                <LogoInput @uploadImage="uploadLogo" />
                <HeaderImageInput @uploadHeaderImage="uploadHeaderImage" />
              </v-col>

              <v-col :cols="12" class="d-flex justify-center">
                <v-btn class="ma-auto mt-4" variant="flat" color="primary" type="submit" :loading="loading">
                  <!-- :loading="loading" :disabled="!meta.valid" -->
                  Отправить
                </v-btn>
              </v-col>

            </v-row>
          </v-form>
        </v-col>
      </v-row>
     </v-container>

  </ClientOnly>
</template>
<style lang="scss" scoped>
.label {
  font-size: 12px;
}

.editor-container .q-editor {
  min-height: 200px;
  max-height: 300px;
  overflow-y: scroll;

}

.logo {
  border: 4px solid white;
  position: absolute;
  left: 5%;
  bottom: -15%;
  width: 20%;
  max-width: 230px;
  border-radius: 50%;
  overflow: hidden;
  aspect-ratio: 1;
  background: white;
  box-shadow: 10px 14px 13px -14px rgba(0, 0, 0, 0.75);
  -webkit-box-shadow: 10px 14px 13px -14px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 10px 14px 13px -14px rgba(0, 0, 0, 0.75);

  img {
    width: 100%;

  }
}
</style>