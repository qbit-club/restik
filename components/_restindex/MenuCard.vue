<script setup lang="ts">
import type { FoodListItemFromDb } from '@/types/food-list-item-from-db.interface'
import type { RestFromDb } from '@/types/rest-from-db.interface'

let { meal, rest } = defineProps<{
    meal: FoodListItemFromDb,
    rest: RestFromDb
}>()

const cartStore = useCart()


let price = parseFloat(meal.price)
// количество порций в корзине
let mealCartCount = ref(0)
let amount = computed(() => {
    return (price * mealCartCount.value).toFixed(2)
})

function addToCart() {
    cartStore.addToCart(meal, rest)
    mealCartCount.value = 1
}
function plusCart() {
    let success = cartStore.plusCart(meal._id, rest._id)
    if (success)
        mealCartCount.value += 1
}
function minusCart() {
    let success = cartStore.minusCart(meal._id, rest._id)
    console.log(success);
    
    if (success)
        mealCartCount.value -= 1
}
</script>
<template>
    <v-card class="w-100 meal-card d-flex">
        <div class="w-100">
            <v-img :src="meal.images[0]" v-if="meal.images[0]">
            </v-img>
        </div>
        <div class="w-100 pa-2">
            <div class="text-right font-weight-bold mb-2">{{ meal.name }}</div>
            <div class="text-subtitle-2">{{ meal.health.ingredients }}</div>
            <div class="text-caption text-right">жиры {{ meal.health.fat }}г белки {{ meal.health.protein }}г углеводы
                {{ meal.health.carb }}г </div>
            <div class="text-caption d-flex justify-space-between font-weight-bold">
                <div>{{ meal.health.energy }}</div>
                <div>{{ meal.health.mass }}</div>
            </div>
            <div class="text-center font-weight-bold ma-2">{{ meal.price }}</div>

            <div class="d-flex justify-start align-center">
                <div class="cart-actions">
                    <v-icon icon="mdi-cart-plus" @click="addToCart" v-if="mealCartCount == 0"></v-icon>
                    <div v-else class="cart-plus-minus">
                        <v-icon icon="mdi-minus" class="cursor-pointer" @click="minusCart"></v-icon>
                        <div class="cart-count">
                            {{ mealCartCount }}
                        </div>
                        <v-icon icon="mdi-plus" class="cursor-pointer" @click="plusCart"></v-icon>
                    </div>
                </div>
                <div v-if="mealCartCount > 0" class="amount">
                    {{ amount }}₽
                </div>
            </div>
        </div>
    </v-card>
</template>

<style scoped lang="scss">
.meal-card {
    aspect-ratio: 2/1;
}

.amount {
    font-size: 20px !important;
    font-weight: 500 !important;
    margin-left: 8px;
    // min-width: 90px;
}

.cart-actions {
    background-color: #E4E4E4;
    border-radius: 12px;
    display: flex;
    align-items: center;
    padding: 10px;
    width: fit-content;

    .cart-plus-minus {
        font-size: 14px;
        display: flex;
        align-items: center;

        .cart-count {
            font-weight: 600;
            font-size: 16px;
            width: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
}
</style>