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
let mealCartCount = computed(() => {
    let res = 0
    for (let restItem of cartStore.cart) {
        if (restItem.restId == rest._id) {
            for (let item of restItem.items) {
                if (item.menuItemId == meal._id) {
                    res += item.count
                }
            }
        }
    }
    return res
})
let amount = computed(() => {
    if (!meal.forWeighing) {
        return (price * mealCartCount.value).toFixed(2)
    } else {
        return (price * mealCartCount.value * meal.averageMassOfOne).toFixed(2)
    }
})

function addToCart() {
    cartStore.addToCart(meal, rest)
}
function plusCart() {
    let success = cartStore.plusCart(meal._id, rest._id)
}
function minusCart() {
    let success = cartStore.minusCart(meal._id, rest._id)
}
</script>
<template>
    <div class="font-weight-bold mb-2">{{ meal.name }}</div>
    <div v-if="meal.health.fat|| meal.health.protein || meal.health.carb" class="text-caption">жиры {{ meal.health.fat }}г белки {{ meal.health.protein }}г углеводы
        {{ meal.health.carb }}г </div>
    <v-card class="w-100 meal-card d-flex">
        <div class="w-100 ">
            <v-img :src="meal.images[0]" class="ml-1 mt-1" v-if="meal.images[0]">
            </v-img>

        </div>

        <div class="w-100 pa-2 d-flex flex-column justify-space-between">
            <div>
                <div v-if="meal.health.energy !== '0 ккал'" class="text-caption text-right font-weight-medium">{{ meal.health.energy }}/100г</div>
                <div v-if="meal.health.mass && !meal.forWeighing" class="text-caption text-right font-weight-medium">{{ meal.health.mass }}</div>
                <div v-if="meal.forWeighing" class="text-caption text-right font-weight-medium">1 шт ≈ {{ meal.averageMassOfOne }} кг</div>
                
            </div>


            <div class="d-flex price  justify-center" v-if="!meal.forWeighing">
                <div>{{ meal.price }}</div>
                <div v-if="mealCartCount > 0">
                    &nbsp;* {{ mealCartCount }} = {{ amount }}
                </div>
                ₽
            </div>
            <div class="d-flex price  justify-center" v-else>
                <div>{{ meal.price }}₽</div>
                <div v-if="mealCartCount > 0">
                    &nbsp;* {{ mealCartCount }} шт * {{ meal.averageMassOfOne }}кг = {{ amount }}
                </div>
                ₽
            </div>


            <div class="d-flex justify-center align-center">
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

            </div>
        </div>
    </v-card>
    <div class="ingredients font-weight-medium">{{ meal.health.ingredients }}</div>
</template>

<style scoped lang="scss">
.meal-card {
    aspect-ratio: 2/1;
}

.price {
    font-size: clamp(0.875rem, 0.675rem + 0.8vw, 1.125rem);
    font-weight: 700;
}

.ingredients {
    font-size: clamp(0.625rem, 0.425rem + 0.8vw, 0.875rem);
    padding: 5px;
}

.cart-actions {
    background-color: #E4E4E4;
    border-radius: 14px;
    display: flex;
    align-items: center;
    padding: 8px;
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