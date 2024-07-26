<script setup lang="ts">
import type { FoodListItemFromDb } from '@/types/food-list-item-from-db.interface'

defineProps<{
  item: FoodListItemFromDb
}>()
const emit = defineEmits(['moveToMenu'])

function getHealth(h: {
  protein: Number,
  fat: Number,
  carb: Number,
  energy: String
}) {
  return `белки ${h.protein}г. жиры ${h.fat}г. углеводы ${h.carb}г. / ${h.energy}`
}
</script>
<template>
  <v-card class="h-100">
    <v-img :src="item?.images[0]" cover></v-img>
    <v-card-title>
      {{ item.name }}
    </v-card-title>

    <v-card-text>
      {{ item.health.ingredients }}
      <div class="health">
        {{ getHealth(item.health) }}
      </div>
    </v-card-text>
    <div class="actions-container">
      <v-btn variant="flat" rounded type="primary" size="small" @click="emit('moveToMenu', item._id)">
        <v-icon icon="mdi-chevron-up" style="font-size: 24px;"></v-icon>
      </v-btn>
    </div>
    <div class="price-container">
      <v-btn variant="flat" rounded type="primary" size="small" :ripple="false">
        {{ item.price }} ₽
      </v-btn>
    </div>
  </v-card>
</template>
<style scoped lang="scss">
.actions-container {
  top: 4px;
  right: 4px;
  position: absolute;
}

.price-container {
  top: 4px;
  left: 4px;
  position: absolute;
}

.health {
  font-size: 10px;
  font-weight: 250;
}
</style>