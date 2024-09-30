<script setup lang="ts">
import type { RestFromDb } from "@/types/rest-from-db.interface"
import _ from "lodash"
let restStore = useRest()
const userStore = useAuth()
const appState = useApp();
let { user } = storeToRefs(userStore)
let rest = ref<RestFromDb | undefined>()
let filter = ref<string>('')


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

  rest.value = res.data.value

}
async function getRest() {
  let res = await restStore.getById(userStore.user?.managingRest || "")

  rest.value = res.data.value

}

let foodListFilter = computed(() => {
  if (filter.value == null || filter.value == '') {
    filter.value = ''
    appState.managerMenuFilter = ''
  }

  if (filter.value.length > 2) {
    appState.managerMenuFilter = filter.value
    let foodList = _.sortBy(rest.value?.foodList,['category']) 
    return foodList?.filter((item: any) => {
      return item.name.toLowerCase().includes(filter.value.toLowerCase()) ||
        item.category.toLowerCase().includes(filter.value.toLowerCase()) ||
        item.health.ingredients.toLowerCase().includes(filter.value.toLowerCase())
    }
    )
  } else {
    return  _.sortBy(rest.value?.foodList,['category'])

  }

})

appState.managerMenuFilter ? filter.value = appState.managerMenuFilter : filter.value = ''
getRest()

watch(user, () => {
  getRest()
})
</script>
<template>
  <v-container>
    <v-row class="justify-center pb-16">
      <v-col :cols="12" sm="10" class="pa-0">

        <h3 class="text-center">Витрина</h3>
        <v-row class="d-flex justify-center">
          <v-col cols="12" md="6">
            <v-text-field max-width="100%" hide-details v-model="filter" density="compact" variant="solo" clearable
              append-inner-icon="mdi-magnify"></v-text-field>

          </v-col>
        </v-row>


        <div v-if="Number(foodListFilter?.length) > 0" v-for="item of foodListFilter" :key="item._id" class="w-100">

          <ManagerFoodListItemCard :item="item" :inMenu="inMenu(item._id)" @move-to-menu="moveToMenu"
            @delete-from-menu="deleteFromMenu" @delete-meal="deleteMeal" />
        </div>
        <div v-else cols="12" class="text-center ma-8"> Ничего нет </div>
      </v-col>

    </v-row>
  </v-container>
</template>
