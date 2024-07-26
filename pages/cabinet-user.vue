<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
const authStore = useAuth()
const router = useRouter()

let { user } = storeToRefs(authStore)
await authStore.getUserRests()
</script>
<template>
  <v-container>
    <v-row>
      <v-col :cols="12">
        <h2>Пользователь</h2>
      </v-col>
      <v-col :cols="12" class="d-flex overflow-x-auto">
        <NuxtLink to="/cabinet-user/profile" class="d-flex">
          <div class="d-flex flex-column align-center pa-4">
            <v-icon icon="mdi-account-outline" size="x-large" />
            <div class="explanation text-center">Профиль</div>
          </div>
        </NuxtLink>
        <NuxtLink to="/cabinet-user/orders" class="d-flex">
          <div class="d-flex flex-column align-center pa-4">
            <v-icon icon="mdi-cart-check" size="x-large" />
            <div class="explanation text-center">Мои заказы</div>
          </div>
        </NuxtLink>
        <NuxtLink to="/cabinet-user/table-reservation" class="d-flex">
          <div class="d-flex flex-column align-center pa-4">
            <v-icon icon="mdi-table-chair" size="x-large" />
            <div class="explanation text-center">Бронирования</div>
          </div>
        </NuxtLink>
      </v-col>
      <v-col :cols="12">
        <NuxtPage />
      </v-col>

    </v-row>

  </v-container>
</template>
<style lang="scss" scoped>
.avatar-container {
  display: flex;
  flex-direction: column;
}

.gradient {
  background: linear-gradient(90deg, rgba(41, 182, 246, 1) 0%, rgba(3, 155, 229, 1) 35%, rgba(2, 136, 209, 1) 100%);
  // background: linear-gradient(90deg, rgba(79,195,247,1) 0%, rgba(41,182,246,1) 41%);

}
</style>