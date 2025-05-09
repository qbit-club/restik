<script setup lang="ts">
import {mdiCartOutline, mdiCloseCircle, mdiMagnify }  from '@mdi/js';

import MenuCard from './MenuCard.vue'
import CartCard from './CartCard.vue'
import { OrdersSocketAPI } from '~/api/OrdersSocketAPI'
import { useElementBounding } from '@vueuse/core'

import type { FoodListItemFromDb } from "../../types/food-list-item-from-db.interface";
import type { RestFromDb } from '~/types/rest-from-db.interface';
const props = defineProps<{
    rest: RestFromDb
}>()
type CategoryMeals = {
    category: string;
    meals: FoodListItemFromDb[];
};

const logo = ref<any>()
const { y: logoY }
    = useElementBounding(logo)

const cartStore = useCart()
const route = useRoute()
let loading = ref(true)
let cartDialog = ref<boolean>(false)

let groupMeals = ref<CategoryMeals[]>()
let isShow = ref(false)
let filter = ref<string>('')
let selectedCategory = ref<string>("")

let showSearch = () => {
    if (!filter.value) {
        isShow.value = !isShow.value
    }
}
let selectCategory = (category: any) => {
    if (selectedCategory.value == category.toLowerCase()) {
        selectedCategory.value = ""
    } else {
        selectedCategory.value = category.toLowerCase()
        const el = document.getElementById(category);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: "center" });
        }
    }
}

let groupMealsByCategory = (meals: FoodListItemFromDb[]): CategoryMeals[] => {
    const grouped: { [key: string]: FoodListItemFromDb[] } = {};

    meals.forEach(meal => {
        // получаем объект с ключами-категориями и значениями в виде массива блюд этой категории
        const category = meal.category || "Без категории";
        if (!grouped[category]) {
            grouped[category] = [];
        }
        grouped[category].push(meal);
    });
    // формируем массив объектов в соответствии с типом CategoryMeals
    return Object.keys(grouped)
        .sort()
        .map(category => ({
            category,
            meals: grouped[category]
        }));
}

let menuWithFilter = () => {
    if (filter.value == null) {
        filter.value = ''
    }
    if (filter.value.length > 2) {
        let tempMenu: any = props.rest?.menu.filter((meal: any) =>
            meal.name.toLowerCase().includes(filter.value.toLowerCase()) ||
            meal.category.toLowerCase().includes(filter.value.toLowerCase())
        )
        groupMeals.value = groupMealsByCategory(tempMenu)
    } else {

        groupMeals.value = groupMealsByCategory(props.rest?.menu)
    }
}

function closeCartDialogAndClearState() {
    cartDialog.value = false
    cartStore.cart = []
    localStorage.removeItem('cart')
}
function closeDialog() {
    cartDialog.value = false
}

watch(filter, () => {
    if (!filter.value) {
        isShow.value = false
    }
    menuWithFilter()
})

let cartLength = computed(() => {
    let res = 0
    for (let item of cartStore?.cart) {
        if (item.restInfo.alias == route.params.alias) {
            res += Number(item.items.length)
        }
    }
    return res
})

let cartAmount = computed(() => {
    let res = 0.0
    for (let restItem of cartStore?.cart) {
        if (restItem.restInfo.alias == route.params.alias) {
            for (let item of restItem.items) {
                if (!item.forWeighing) {
                    res += item.count * item.price
                } else {
                    res += item.count * item.price * item.averageMassOfOne
                }
            }
        }
    }
    return res.toFixed(2)
})

watch(logoY, () => {
    logoY.value >= 400 ? logo.value.style.display = 'none' : logo.value.style.display = 'block'
})

onMounted(() => {
    if (props.rest.menu.length > 0) {
        groupMeals.value = groupMealsByCategory(props.rest?.menu)
        selectedCategory.value = groupMeals.value[0]?.category
    }
    logo.value.style.display = 'none'

    if (!OrdersSocketAPI.ordersSocket?.active) OrdersSocketAPI.createOrdersConnection(props.rest._id)
})
</script>

<template>

    <v-container>
        <v-row>

            <v-col ref="logo" cols="12" class="position-sticky pt-0 pb-0" style="z-index:2; top:0px; ">
                <div class="d-flex align-center pr-8" style="background: white; height:65px">

                    <ClientOnly>
                        <NuxtLink to="/">
                            <transition name="fade">
                                <img v-if="logoY < 100" :src="rest.images.logo" style="width: 50px;" class="ma-2"></img>
                            </transition>
                        </NuxtLink>
                    </ClientOnly>
                    <v-chip-group>
                        <v-chip color="accent" variant="outlined" v-for="(item, index) in groupMeals" :key="index"
                            @click="selectCategory(item.category)">
                            {{ item.category }}
                        </v-chip>
                    </v-chip-group>
                </div>
                <div class=" w-100 d-flex justify-end align-start">

                    <div class="d-flex flex-column align-center" style="min-width:60px" @click="cartDialog = true">
                        <v-badge :content="cartLength" color="accent">
                            <v-btn :icon="mdiCartOutline" density="comfortable">
                            </v-btn>
                        </v-badge>

                        <v-chip class="mt-1" variant="elevated" density="comfortable" color="success" size="x-small">
                            {{ cartAmount }}</v-chip>
                    </div>



                    <div class="d-flex align-center">
                        <transition name="fade">
                            <v-text-field min-width="200" v-model="filter" v-if="isShow" density="compact"
                                variant="solo" hide-details single-line placeholder="поиск"
                                :clear-icon="mdiCloseCircle" clearable></v-text-field>
                        </transition>
                        <v-btn :icon="mdiMagnify" density="comfortable" @click="showSearch" class="ml-2">

                        </v-btn>
                    </div>


                </div>


            </v-col>
            <v-col :cols="12" class="pt-0">
                <div v-for="(item, index) in groupMeals">
                    <div class="text-center text-uppercase  font-weight-bold ma-4 " :id="item.category">
                        {{ item.category }}
                    </div>
                    <v-row>
                        <v-col cols="12" md="6" v-for="(meal, index) in item.meals">
                            <MenuCard :meal="meal" :rest="rest"></MenuCard>
                        </v-col>

                    </v-row>
                </div>
            </v-col>
        </v-row>
        <v-dialog v-model="cartDialog" max-width="550">
            <CartCard @buy="closeCartDialogAndClearState" @close="closeDialog" />
        </v-dialog>
    </v-container>
</template>
<style scoped></style>
