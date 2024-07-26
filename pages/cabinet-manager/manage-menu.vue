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
  <v-row>
    <v-col cols="12">
      <h3>Меню</h3>
    </v-col>
    <TransitionGroup name="fade" v-if="menu.length > 0">
      <v-col cols="12" sm="6" md="4" lg="3" xl="2.5" xxl="2" v-for="item of menu" :key="item._id">
        <ManagerMenuItemCard :item="item" @delete-from-menu="deleteFromMenu" />
      </v-col>
    </TransitionGroup>
    <v-col v-else cols="12"> Пусто </v-col>
    <v-col cols="12">
      <h3>Список блюд</h3>
    </v-col>
    <v-col v-if="Number(rest?.foodList?.length) > 0" cols="12" md="4" lg="3" xl="2" v-for="item of rest?.foodList">
      <ManagerFoodListItemCard :item="item" @move-to-menu="moveToMenu" />
    </v-col>
    <v-col v-else cols="12"> Пусто </v-col>
  </v-row>
</template>
