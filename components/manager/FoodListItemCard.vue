<script setup lang="ts">
import type { FoodListItemFromDb } from '@/types/food-list-item-from-db.interface'

const props = defineProps<{
  item: FoodListItemFromDb
  inMenu: boolean | undefined
}>()
const emit = defineEmits(['moveToMenu', 'deleteFromMenu', 'deleteMeal'])
const router = useRouter()
let confirmDeleteDialog = ref<boolean>(false)

let isMenuItem = ref(false)

function toggleMenu() {
  isMenuItem.value ? emit('moveToMenu', props.item._id) : emit('deleteFromMenu', props.item._id)
}

function deleteMeal() {
  emit('deleteMeal', props.item._id)
  confirmDeleteDialog.value = false
}

watch(isMenuItem, () => {
  toggleMenu()
})
onMounted(() => {

  isMenuItem.value = props.inMenu
  // toggleMenu()
})

</script>
<template>

  <v-row class="d-flex align-center justify-space-between" :class="[isMenuItem ? '' : 'out-menu']">
    <v-col class="d-flex align-center  cursor-pointer">

      <img :src="item?.images[0]" style="height: 50px;" aspect-ratio="1"></img>
      <div class="pa-4 ">
        <span class="font-weight-bold">{{ item.category }}</span>
        <div> {{ item.name }} | {{item.health.mass}} | {{ item.price }} ₽</div>
      </div>
    </v-col>
    <v-col cols="12" md="4" class="pa-0">
      <div class="d-flex justify-center" :class="[isMenuItem ? '' : 'out-menu']">

        <div class="d-flex align-center justify-center cursor-pointer">

          <div class="d-flex flex-column align-center pa-2 "
            @click="router.push(`/cabinet-manager/edit-meal?item_id=${item._id}`)">
            <v-icon icon="mdi-pencil" size="x-large" />
            <div class="explanation text-center">редактировать</div>

          </div>

          <div class="d-flex flex-column align-center pa-2" @click="confirmDeleteDialog = true">
            <v-icon icon="mdi-trash-can-outline" size="x-large" />
            <div class="explanation text-center">удалить</div>

          </div>
          <div class="d-flex align-center pa-2">
            <v-checkbox v-model="isMenuItem" hide-details class="pa-0"></v-checkbox>
            <div class="text-center text-uppercase" v-if="isMenuItem">в продаже</div>
            <div class="text-center text-uppercase" v-else> спрятано</div>

          </div>
          <v-dialog v-model="confirmDeleteDialog" max-width="300" persistent>
            <v-card>
              <v-card-title>Удалить?</v-card-title>
              <v-card-actions>
                <v-btn @click="confirmDeleteDialog = false">нет</v-btn>
                <v-btn @click="deleteMeal()" color="error">да</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </div>
    </v-col>
  </v-row>
  <v-divider></v-divider>

</template>
<style scoped lang="scss">
.in-menu {
  color: #54B975;
}

.out-menu {
  opacity: 0.7;
}
</style>