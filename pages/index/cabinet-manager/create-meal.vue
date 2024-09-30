<script setup lang="ts">
import { toast } from "vue3-toastify"

let appStore = useApp()
const CATEGORIES = appStore.appState?.foodCategory.sort() || []
const MEASUREMENTS = ["г", "кг", "шт"]

const userStore = useAuth()
const router = useRouter()
let restStore = useRest()

let { user } = storeToRefs(userStore)

let managingRest = ref<string>(String(user.value?.managingRest) ?? "")
watch(user, (newVal) => {
  managingRest.value = String(user.value?.managingRest)
})

let form = ref({
  name: "",
  category: "",
  health: {
    protein: 0,
    carb: 0,
    fat: 0,
    energy: "0 ккал",
    mass: "",
    ingredients: "",
  },
  price: "",
  forWeighing: false,
  averageMassOfOne: 0,
})
let imagesFormData = new FormData()
let massError = ref<string>('')
let averageMassOfOne = ref<string>('0')

watch(
  form,
  (newVal, oldVal) => {
    form.value.health.protein = Number(form.value.health.protein)
    form.value.health.carb = Number(form.value.health.carb)
    form.value.health.fat = Number(form.value.health.fat)

    let sum = newVal.health.protein * 4 + newVal.health.carb * 4 + newVal.health.fat * 9
    form.value.health.energy = String(sum) + " ккал"
  },
  { deep: true }
)
watch(averageMassOfOne, (newVal) => {
  newVal = newVal.replaceAll(',', '.')

  if (Number.isNaN(Number(newVal))) {
    massError.value = 'Это не число!'
  } else {
    form.value.averageMassOfOne = Number(newVal)
    massError.value = ''
  }
})

let previews = ref<string[]>([])
let index = 0
function uploadImage(file: File) {
  // make a preview
  let reader = new FileReader()
  reader.onloadend = function () {
    let img = new Image()
    img.src = String(reader.result)
    img.onload = function (this: any) {
      if (this.width / this.height >= 1.1 || this.width / this.height <= 0.9) {
        toast('Картинка должна быть "более" квадратной', { type: "error" })
      } else {
         // Очищаем предыдущие данные и добавляем новое изображение
         imagesFormData.delete("menuitemimage");
        imagesFormData.set(
          "menuitemimage",
          file,
          "menuitemimage_" + String(Date.now()) + ".jpg"
        );

        // Очищаем предыдущий предварительный просмотр и добавляем новый
        previews.value = [String(reader.result)];
      
      }
    }
  }
  reader.readAsDataURL(file)
}

let loading = ref(false)
async function submit() {
  loading.value = true
  // пусть пока в морковку создаются
  let res = await restStore.createFoodListItem(String(userStore.user?.managingRest), form.value)
  if (res.status.value == "success") {
    // find foodItem
    let restId = res.data.value._id
    let itemId
    for (let item of res.data.value?.foodList) {
      if (item.name == form.value.name) {
        itemId = item._id
        break
      }
    }
    let uploadRes = await restStore.uploadFoodListItemImages(restId, itemId, imagesFormData)
    if (uploadRes.status.value == "success") {
      loading.value = false
      toast("Товар создан!", {
        type: "success",
        onClose: () => router.push("/cabinet-manager/manage-menu"),
      })
    }
  }
}
</script>
<template>
  <v-container>
    <v-row class="justify-center pb-16">
      <v-col :cols="12" sm="10" class="pa-0">
        <v-row>
          <v-col cols="12">
            <h3 class="text-center">Создать</h3>
          </v-col>
          <v-col cols="12" class="d-flex justify-space-between align-center">
            <MenuItemImageInput @upload-menu-item-image="uploadImage" />
            <v-img v-for="pr of previews" :src="pr" class="img-preview"></v-img>
          </v-col>
          <v-col cols="12" md="6">
            Название
            <v-text-field hide-details v-model="form.name" density="compact" variant="outlined"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            Категория
            <v-select
              hide-details
              v-model="form.category"
              :items="CATEGORIES"
              placeholder="пасты"
              variant="outlined"
              density="compact"
              clearable
            ></v-select>
          </v-col>
          <v-col cols="12" md="3" class="d-flex flex-column justify-end">
            Белки
            <div>
              <v-text-field
                hide-details
                type="number"
                v-model="form.health.protein"
                density="compact"
                variant="outlined"
                suffix="г."
              ></v-text-field>
            </div>
          </v-col>
          <v-col cols="12" md="3" class="d-flex flex-column justify-end">
            + Жиры
            <div>
              <v-text-field
                hide-details
                type="number"
                v-model="form.health.fat"
                density="compact"
                variant="outlined"
                suffix="г."
              ></v-text-field>
            </div>
          </v-col>
          <v-col cols="12" md="3" class="d-flex flex-column justify-end">
            + Углеводы
            <div>
              <v-text-field
                hide-details
                type="number"
                v-model="form.health.carb"
                density="compact"
                variant="outlined"
                suffix="г."
              ></v-text-field>
            </div>
          </v-col>
          <v-col cols="12" md="3" class="d-flex flex-column justify-end">
            = Энергетическая ценность
            <div>
              <v-text-field
                hide-details
                v-model="form.health.energy"
                density="compact"
                variant="outlined"
              ></v-text-field>
            </div>
          </v-col>
          <v-col cols="12">
            <v-card class="pa-4">
              <v-row>
                <v-col cols="12" class="py-0">
                  <v-checkbox v-model="form.forWeighing" label="Для взвешивания" hide-details></v-checkbox>
                </v-col>
              </v-row>
              <v-row v-if="!form.forWeighing">
                <v-col cols="12" md="6">
                  Цена
                  <v-text-field
                    hide-details
                    v-model="form.price"
                    prefix="₽"
                    density="compact"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  Масса 1 шт
                  <v-text-field
                    hide-details
                    v-model="form.health.mass"
                    density="compact"
                    variant="outlined"
                    placeholder="500 г"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col cols="12" md="6">
                  Цена ₽ / кг.
                  <v-text-field
                    hide-details
                    v-model="form.price"
                    suffix="₽ / кг."
                    density="compact"
                    variant="outlined"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  примерная масса 1 шт
                  <v-text-field
                    v-model="averageMassOfOne"
                    density="compact"
                    variant="outlined"
                    :error-messages="massError"
                    suffix="кг"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <v-col cols="12">
            Описание
            <v-textarea
              auto-grow
              hide-details
              :rows="1"
              v-model="form.health.ingredients"
              density="compact"
              variant="outlined"
              placeholder="Из слабосолёного лосося, с тартаром из огурцов, красной икрой, укропом, луком шнитт и шалот"
            ></v-textarea>
          </v-col>

          <v-col cols="12" class="d-flex justify-center">
            <v-btn :disabled="massError.length > 0" size="large" variant="flat" color="primary" :loading="loading" @click="submit">отправить</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped lang="scss">
.img-preview {
  max-height: 200px;
}
</style>
