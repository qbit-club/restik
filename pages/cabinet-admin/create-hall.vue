<script lang="ts" setup>
import getPossibleLocations from "../../composables/dadata";
import type { Location } from "../../types/location.interface"
import type { Table } from '../../types/table.interface'
// meta
useHead({
  title: 'Рестик | Создать зал'
})
definePageMeta({
  middleware: 'auth'
})




// other imports
import { useField, useForm } from 'vee-validate'

const restStore = useRest()
const authStore = useAuth()
const router = useRouter()

let loading = ref(false)
let tablePage = ref(1)
let schedule = ref('')
let description = ref('')

const tablesHeaders = [
  { title: 'Номер столика', key: 'number' },
  { title: 'Кол-во мест', key: 'seatsNumber' },
]

const { meta, handleSubmit, validate } = useForm({
  initialValues: {
    title: '',
    alias: '',
    phone: '',
    socialMedia: '',
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
      if (value?.trim().length < 4) return 'слишком короткий заголовок'
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
      let regexp = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g
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
let alias = useField<string>('alias')
let phone = useField<string>('phone')




let tables = ref<Table[]>([])
let imagesFormData = new FormData()

let location = ref<any>(
)
const locationSearchRequest = ref<string>('');
const possibleLocations = ref<Location[] | undefined>(undefined);



/**
 * если нет столиков, то добавляем столик на 1 этаже с 1 номером
 * если есть столик, то добавляем новый столик на этаже предыдущего 
 * столика с номером на 1 больше 
 */
function addTable() {
  if (tables.value.length > 0) {
    let prevTable = tables.value[tables.value.length - 1]
    // добавляем новый столик на таком же этаже, что и предыдущий
    tables.value.push({
      floor: Number(prevTable.floor),
      number: Number(prevTable.number) + 1,
      seatsNumber: prevTable.seatsNumber
    })
  } else {
    tables.value.push({
      floor: 1,
      number: 1,
      seatsNumber: 1
    })
  }
}
function ensureNumberType() {
  tables.value = tables.value.map((e) => {
    return { number: Number(e.number), seatsNumber: Number(e.seatsNumber), floor: Number(e.floor) }
  })
}


// base64 img
let hallImagePreviews = ref<string>()
function uploadHallImage(file: File, index: Number) {
  // example filename: headerimage_0_216262666_best-burger.svg
  imagesFormData.set('hallimage_' + String(index), file, 'hallimage_' + String(index) + '_' + String(Date.now()) + '_' + String(alias.value.value) + '.svg')
  // make a preview
  let reader = new FileReader();
  reader.onloadend = function () {
    hallImagePreviews.value = String(reader.result)
  }
  reader.readAsDataURL(file);
}
const submit = handleSubmit(async values => {
  loading.value = true
  
  let toSend = {
    ...values,
    tables: tables.value,
    location: location.value,
    description: description.value,
    schedule: schedule.value,
    author: String(authStore.user?._id)
  }

  let res = await restStore.create(toSend)

  if (res.status.value == 'success') {
    let _id = res.data.value._id
    let uplRes = await restStore.uploadImages(imagesFormData, _id)

    if (uplRes.status.value == 'success') {
      loading.value = false
      router.push('/')
    } else {
      console.log(uplRes);
    }
  } else {
    console.log(res);
  }
})


watch(locationSearchRequest, async (value) => {
      const locations: any= await getPossibleLocations(value); // any - костыль надо переписать dadata.ts
      possibleLocations.value = locations ?? []; // Если locations undefined, присваиваем пустой массив
    });

</script>
<template>
  <ClientOnly>
    <v-container>
      <v-row>
        <v-col>
          <v-form @submit.prevent="submit">
            <div class="font-weight-bold text-center" style="font-size: 20px;">Создать зал</div>
      
            <v-row>
              <v-col cols="12" md="6">
                <div class="label">Название ресторана тут должен быть селектор из созданных ресторанов</div>
                <v-text-field v-model="title.value.value" :error-messages="title.errorMessage.value"
                  placeholder="Шаурма" variant="outlined" density="compact" class="w-100" />
              </v-col>
          
              <v-col cols="12" md="6">
                <div class="label">Название зала</div>
                <v-text-field v-model="phone.value.value" :error-messages="phone.errorMessage.value"
                  placeholder="+79127528877" variant="outlined" density="compact" class="w-100" />
              </v-col>
    
    
            </v-row>
            <!-- {{ location }} -->
        
            <img  :src="hallImagePreviews" style="max-height: 200px; margin: 2px;">
            <HallImageInput :title="'зал'" @uploadHallImage="uploadHallImage" />
            <v-data-table :items="tables" :headers="tablesHeaders" :items-per-page="5" v-model:page="tablePage"
              class="mt-4">
              <template v-slot:top>
                <div class="d-flex justify-space-between w-100">
                  <h3 class="">Столики</h3>
                  <v-btn @click="addTable" variant="tonal" prepend-icon="mdi-plus">добавить</v-btn>
                </div>
              </template>
              <template v-slot:no-data>
                <b class="text-red cursor-pointer" @click="addTable">
                  Добавьте столики
                </b>
              </template>
              <template v-slot:item.number="{ item }">
                <v-text-field @change="ensureNumberType" variant="plain" type="number" v-model="item.number"
                  :min="0"></v-text-field>
              </template>

              <template v-slot:item.floor="{ item }">
                <v-text-field @change="ensureNumberType" variant="plain" type="number"
                  v-model="item.floor"></v-text-field>
              </template>

              <template v-slot:item.seatsNumber="{ item, index }">
                <div class="d-flex justify-space-between align-center">
                  <v-text-field @change="ensureNumberType" variant="plain" type="number" v-model="item.seatsNumber"
                    :min="1"></v-text-field>
                  <v-tooltip text="Удалить" location="top" :offset="-6">
                    <template v-slot:activator="{ props }">
                      <v-btn v-bind="props" icon="mdi-delete-outline" variant="plain" color="red"
                        @click="tables.splice(index, 1)">
                      </v-btn>
                    </template>
                  </v-tooltip>
                </div>
              </template>

              <template v-slot:bottom>
                <v-pagination v-model="tablePage" :length="Math.ceil(tables.length / 5)"></v-pagination>
              </template>
            </v-data-table>
            <v-btn class="ma-auto mt-4" variant="tonal" type="submit" :loading="loading" :disabled="!meta.valid">
              Отправить
            </v-btn>
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
</style>