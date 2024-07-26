<script setup lang="ts">
let rests = [
  {
    title: "Морковка",
    value: "6694096e4901af87e35e23aa",
  },
  {
    title: "Картошечка",
    value: "669a6f5fefed0bac34a7e755",
  },
]

const userStore = useAuth()

let currentRest = ref<string>(userStore.user?.managingRest || "")
watch(currentRest, async (newVal) => {
  await userStore.chooseManagingRest(String(newVal))
})
</script>
<template>
  <v-container>
    <v-row>
      <v-col :cols="12">
        <h2>Менеджер</h2>
      </v-col>
      <v-col cols="12" md="6" xl="4" class="d-flex">
        <v-select v-model="currentRest" :items="rests" variant="outlined" density="compact"></v-select>
      </v-col>
      <v-col :cols="12" class="d-flex overflow-x-auto">
        <NuxtLink to="/cabinet-manager/orders" class="d-flex">
          <div class="d-flex flex-column align-center pa-4">
            <v-icon icon="mdi-cart-check" size="x-large" />
            <div class="explanation text-center">заказы</div>
          </div>
        </NuxtLink>
        <NuxtLink to="/cabinet-manager/table-reservation" class="d-flex">
          <div class="d-flex flex-column align-center pa-4">
            <v-icon icon="mdi-table-chair" size="x-large" />
            <div class="explanation text-center">
              бронирование <br />
              столиков
            </div>
          </div>
        </NuxtLink>
        <NuxtLink to="/cabinet-manager/create-meal" class="d-flex">
          <div class="d-flex flex-column align-center pa-4">
            <v-icon icon="mdi-bowl-mix-outline" size="x-large" />
            <div class="explanation text-center">
              создать <br />
              блюдо
            </div>
          </div>
        </NuxtLink>
        <NuxtLink to="/cabinet-manager/manage-menu" class="d-flex">
          <div class="d-flex flex-column align-center pa-4">
            <v-icon icon="mdi-food-outline" size="x-large" />
            <div class="explanation text-center">
              управлять <br />
              меню
            </div>
          </div>
        </NuxtLink>
        <NuxtLink to="/cabinet-manager/rest-info" class="d-flex">
          <div class="d-flex flex-column align-center pa-4">
            <v-icon icon="mdi-tune-variant" size="x-large" />
            <div class="explanation text-center">
              информация <br />
              о ресторане
            </div>
          </div>
        </NuxtLink>

        <NuxtLink to="/cabinet-manager/add-manager" class="d-flex">
          <div class="d-flex flex-column align-center pa-4">
            <v-icon icon="mdi-account-plus-outline" size="x-large" />
            <div class="explanation text-center">
              добавить <br />
              менеджера
            </div>
          </div>
        </NuxtLink>
        <NuxtLink to="/cabinet-manager/manage-email-list" class="d-flex">
          <div class="d-flex flex-column align-center pa-4">
            <v-icon icon="mdi-email-fast-outline" size="x-large" />
            <div class="explanation text-center">
              email список <br />
              для уведомлений
            </div>
          </div>
        </NuxtLink>
      </v-col>
      <v-col :cols="12">
        <NuxtPage />
      </v-col>
    </v-row>
  </v-container>
</template>
