<script setup lang="ts">
import type { OrderFromDb } from "@/types/order-from-db.interface"

const orderStore = useOrder()
let props = defineProps<{
  order: OrderFromDb
}>()

let getDate = (d: string) => {
  let t = new Date(d)
  return t.toLocaleString("ru-RU", {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  })
}

let orderStatus = ref<string>(String(props.order.status) ?? "created")
let loading = ref(false)
watch(orderStatus, async (newStatus) => {
  loading.value = true
  let res = await orderStore.changeStatus(props.order._id, newStatus)
  if (res.status.value == "success") loading.value = false
})
</script>
<template>
  <v-badge floating dot color="success" v-if="order.new">
    <h3 class="h3-clamp">{{ getDate(order.date) }}</h3>
  </v-badge>
  <h3 class="h3-clamp" v-else>{{ getDate(order.date) }}</h3>
  <v-radio-group inline v-model="orderStatus" :hide-details="true" :disabled="loading">
    <v-radio label="Создан" value="created" color="accent"></v-radio>
    <v-radio label="В работе" value="inWork" color="primary"></v-radio>
    <v-radio label="В пути" value="inDelivery" color="secondary"></v-radio>
    <v-radio label="Доставлен" value="delivered" color="success"></v-radio>
  </v-radio-group>
  <v-card class="pa-4 mt-4 mb-4 p-clamp">
    <div class="user-info">
      <div><v-icon icon="mdi-account-outline" class="mr-2"></v-icon>{{ order.user.name }}</div>
      <div>
        <v-icon icon="mdi-phone-outline" class="mr-2"></v-icon
        ><a :href="'tel:' + order.user.phone">{{ order.user.phone }}</a>
      </div>
      <div><v-icon icon="mdi-home-city-outline" class="mr-2"></v-icon>{{ order.user.address }}</div>
      <div><v-icon icon="mdi-paperclip" class="mr-2"></v-icon>{{ order.user.comment }}</div>
      <v-divider color="primary" :thickness="3" class="mt-2 pb-2" style="opacity: 1"></v-divider>
    </div>

    <div v-for="(item, j) in order.items" class="d-flex justify-space-between">
      <span>{{ item.menuItem }}</span>
      <span v-if="!item.forWeighing"
        >{{ item.count }} шт * {{ item.price }}₽ = {{ (item.count * item.price).toFixed(2) }}
      </span>
      <span v-else
        >{{ item.count }} шт * {{ item.price }}₽ * {{ item.averageMassOfOne }}кг =
        {{ (item.count * item.price * item.averageMassOfOne).toFixed(2) }}
      </span>
    </div>

    <v-divider color="primary" :thickness="3" class="mt-2 pb-2" style="opacity: 1"></v-divider>
    <div class="text-end">
      <i>
        <b>
          Итого:
          {{
            order.items.reduce((acc: number, currentVal: any) => {
              if (currentVal.forWeighing) {
                return acc + currentVal.price * currentVal.count * currentVal.averageMassOfOne
              }
              return acc + currentVal.price * currentVal.count
            }, 0.0).toFixed(2)
          }}
        </b></i
      >
    </div>
  </v-card>
</template>
<style scoped>
.user-info {
  font-size: 0.8rem;
  font-weight: 500;
}
</style>
