<script setup lang="ts">
import type { RestFromDb } from "@/types/rest-from-db.interface"

let restStore = useRest()
const userStore = useAuth()

let { user } = storeToRefs(userStore)
let rest = ref<RestFromDb>()

let menu = computed(() => {
  if (!rest.value?.menu) return []

  let result = []
  for (let menuItem of rest.value.menu) {
    for (let foodListItem of rest.value.foodList) {
      if (foodListItem._id == menuItem) {
        result.push(foodListItem)
        break
      }
    }
  }
  return result
})
function inMenu(itemId: string) {
  return rest.value?.menu.some(item => { return item === itemId });
}

async function moveToMenu(_id: string) {
  let res = await restStore.moveFoodItemToMenu(String(rest.value?._id), _id)
  if (res.status.value == "success") {
    rest.value = res.data.value
  }
}
async function deleteFromMenu(menuItemId: string) {
  let res = await restStore.deleteFromMenu(menuItemId, String(rest.value?._id))
  if (res.status.value == "success") {
    rest.value = res.data.value
  }
}
async function deleteMeal(foodListItemId: string) {
  let res = await restStore.deleteMeal(foodListItemId, String(rest.value?._id))
  if (res.status.value == "success") {
    rest.value = res.data.value
  }
}
async function getRest() {
  let res = await restStore.getById(userStore.user?.managingRest || "")
  rest.value = res.data.value
}
getRest()

watch(user, () => {
  getRest()
})
</script>
<template>
  <v-container>
    <v-row class="justify-center pb-16">
      <v-col :cols="12" sm="10"   class="pa-0">

        <h3 class="text-center">Витрина</h3>

        <div v-if="Number(rest?.foodList?.length) > 0" v-for="item of rest?.foodList" :key="item._id" class="w-100">
          <ManagerFoodListItemCard :item="item" :inMenu="inMenu(item._id)" @move-to-menu="moveToMenu"
            @delete-from-menu="deleteFromMenu" @delete-meal="deleteMeal"/>
        </div>
        <div v-else cols="12"> Пусто </div>
      </v-col>

    </v-row>
  </v-container>
</template>
