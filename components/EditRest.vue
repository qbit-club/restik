<script lang="ts" setup>
import { QuillEditor } from "@vueup/vue-quill"
import "@vueup/vue-quill/dist/vue-quill.snow.css"
import getPossibleLocations from "~/composables/dadata"
import type { Location } from "~/types/location.interface"
let userStore = useAuth()

let { user } = storeToRefs(userStore)

const props = defineProps<{
  rest: any
}>()

let { rest } = toRefs(props)

const config = useRuntimeConfig()

// other imports
import { useField, useForm } from "vee-validate"

const restStore = useRest()
const authStore = useAuth()
const router = useRouter()

// let response = await restStore.getById(String(authStore.user?.managingRest));

let loading = ref(false)
let schedule = ref(rest.value?.schedule ?? "")
let description = ref(rest.value?.description ?? "")
let isHidden = ref<boolean>(rest.value?.isHidden ?? "")

const { meta, handleSubmit, setValues, validate } = useForm({
  initialValues: {
    title: rest.value?.title ?? "",
    type: rest.value?.type ?? "",
    alias: rest.value?.alias ?? "",
    phone: rest.value?.phone ?? "",
    socialMedia: rest.value?.socialMedia ?? "",
    placeOnShowcase: rest.value?.placeOnShowcase ?? "",
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
      if (value?.trim().length < 2) return "слишком короткий заголовок"
      if (value?.length > 32) return "слишком длинный заголовок"

      return true
    },
    type(value: string) {
      if (value?.trim().length < 2) return "слишком короткий заголовок"
      if (value?.length > 32) return "слишком длинный заголовок"

      return true
    },
    alias(value: String) {
      if (value?.trim().length < 4) return "слишком короткий псевдоним"
      if (value?.length > 32) return "слишком длинный псевдоним"
      let regexp = /[а-яё]/i
      if (regexp.test(value?.trim())) {
        return "уберите кириллицу"
      }
      return true
    },
    phone(value: string) {
      let regexp = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g
      if (!regexp.test(value?.trim())) return "неправильный формат"

      return true
    },
    placeOnShowcase(value: number) {

      if (!Number.isInteger(Number(value)) || Number(value) < 0 || !value) {
        return 'число - место на витрине';
      }
      return true;
    },
    socialMedia(value: string) {
      let regexp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi
      if (!regexp.test(value?.trim())) return "неправильный формат"

      return true
    },
  },
})

let title = useField<string>("title")
let type = useField<string>("type")
let alias = useField<string>("alias")
let phone = useField<string>("phone")
let socialMedia = useField<string>("socialMedia")
let placeOnShowcase = useField<number>('placeOnShowcase')
let imagesFormData = new FormData()

let location = ref<any>(rest.value?.location)
const locationSearchRequest = ref<string>("")
const possibleLocations = ref<Location[] | undefined>(undefined)

let isAdmin = computed(() => {
  return user?.value?.roles?.includes('admin') ?? false
})

// base64 img
let logoPreview = ref<any>(rest.value?.images?.logo)
function uploadLogo(file: File) {
  // example filename: logo_216262666_best-burger.jpg
  imagesFormData.set("logo", file, "logo_" + String(Date.now()) + "_" + String(alias.value.value) + ".jpg")
  // make a preview
  let reader = new FileReader()
  reader.onloadend = function () {
    logoPreview.value = reader.result
  }
  reader.readAsDataURL(file)
}
// base64 img
let headerImagePreview = ref<any>(rest.value?.images?.headerimage)
function uploadHeaderImage(file: File) {
  // example filename: headerimage_216262666_best-burger.jpg
  imagesFormData.set(
    "headerimage",
    file,
    "headerimage_" + String(Date.now()) + "_" + String(alias.value.value) + ".jpg"
  )
  // make a preview
  let reader = new FileReader()
  reader.onloadend = function () {
    headerImagePreview.value = reader.result
  }
  reader.readAsDataURL(file)
}

watch(rest, () => {
  schedule.value = rest.value?.schedule ?? ""
  description.value = rest.value?.description ?? ""
  isHidden.value = rest.value?.isHidden ?? ""
  setValues({
    title: rest.value?.title ?? "",
    type: rest.value?.type ?? "",
    alias: rest.value?.alias ?? "",
    phone: rest.value?.phone ?? "",
    socialMedia: rest.value?.socialMedia ?? "",
    placeOnShowcase: rest.value?.placeOnShowcase,
  })
  location.value = rest.value?.location
  headerImagePreview.value = rest.value?.images?.headerimage
  logoPreview.value = rest.value?.images?.logo
})

const submit = handleSubmit(async (values) => {
  loading.value = true

  let toSend = {
    ...values,
    location: location.value,
    description: description.value,
    schedule: schedule.value,
    author: String(authStore.user?._id),
    isHidden: isHidden.value,
  }

  let res = await restStore.update(toSend, rest.value?._id)

  if (res.status.value == "success") {
    let _id = res.data.value._id
    let uplRes = await restStore.uploadImages(imagesFormData, _id)

    if (uplRes.status.value == "success") {
      loading.value = false
      router.push("/")
    } else {
      console.log(uplRes)
    }
  } else {
    console.log(res)
  }
})

watch(locationSearchRequest, async (value) => {
  if (value.length >= 3) {
    const locations = await getPossibleLocations(value)

    possibleLocations.value = (locations ?? []).map((item) => ({
      ...item.geo,

    }))
  } else {
    possibleLocations.value = []
  }
});
watch(location, () => {
  if (location.value.name) {
    location.value.type = 'Point'
    location.value.coordinates = [
      Number(location.value.geo_lat),
      Number(location.value.geo_lon)
    ]
    return location.value
  }
})
</script>
<template>
  <ClientOnly>
    <v-container>
      <v-row class="justify-center pb-16">
        <v-col :cols="12" sm="10" class="pa-0">
          <v-form @submit.prevent="submit">
            <div class="font-weight-bold text-center" style="font-size: 20px">Редактировать</div>
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
                  url ресторана:
                  <i style="text-decoration: underline">{{ config.public.siteUrl + "/" + alias.value.value }}</i>
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
                    :toolbar="[['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }], ['clean']]" />
                </div>
              </v-col>

              <v-col cols="12">
                <v-combobox hide-details density="compact" v-model="location" v-model:search="locationSearchRequest"
                  :items="possibleLocations" item-title="name" placeholder="Место" item-value="geo" variant="outlined"
                  clearable>
                  <template v-slot:no-data>
                    <div class="pt-2 pr-4 pb-2 pl-4">
                      {{ locationSearchRequest.trim().length < 3 ? "Минимум 3 символа" : "Не найдено" }} </div>
                  </template>
                </v-combobox>
              </v-col>
              <v-col cols="12" md="6" v-if="isAdmin">
                <div class="label">Место на витрине</div>
                <v-text-field v-model="placeOnShowcase.value.value" :error-messages="placeOnShowcase.errorMessage.value"
                  placeholder="место на витрине" type="number" variant="outlined" density="compact" class="w-100" />
              </v-col>

              <v-col :cols="12" style="margin-bottom: 80px" v-if="logoPreview || headerImagePreview">
                <div style="height: 30vh; position: relative">
                  <v-img :src="headerImagePreview" max-height="25vh" cover alt="" />
                  <div class="logo" v-if="logoPreview">
                    <img :src="logoPreview" alt="" />
                  </div>
                  <!-- <v-avatar v-if="logoPreview" :image="logoPreview" size="200px" class="logo" color="white" style="
                position: absolute;
                top: 0px;
                aspect-ratio: 1;
              "></v-avatar> -->
                </div>
              </v-col>

              <v-col :cols="12" class="d-flex justify-center">
                <LogoInput @uploadImage="uploadLogo" />
                <HeaderImageInput @uploadHeaderImage="uploadHeaderImage" />
                <!-- <div
                  class="tab pa-4 cursor-pointer file-input-label"
                  :class="{ 'show-hide': isHidden }"
                  @click="isHidden = !isHidden"
                >
                  <v-icon
                    :icon="isHidden ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                    size="x-large"
                  />
                  <div class="explanation text-center">
                    {{ isHidden ? "показать ресторан" : "скрыть ресторан" }}
                  </div>
                </div> -->
              </v-col>

              <v-col :cols="12" class="d-flex justify-center">
                <v-btn class="ma-auto mt-4" variant="flat" color="primary" type="submit" :loading="loading"
                  :disabled="!meta.valid">
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

.show-hide {
  color: red;
}

.file-input-label {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: 1px dashed black;
  padding: 10px;
  border-radius: 5px;
  width: 100px;
  aspect-ratio: 1;
  margin: 10px;
}
</style>
