<script setup lang="ts">
import MenuCard from './MenuCard.vue'
import CartCard from './CartCard.vue'

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
        let tempMenu = props.rest?.menu.filter((meal: any) =>
            meal.name.toLowerCase().includes(filter.value.toLowerCase()) ||
            meal.category.toLowerCase().includes(filter.value.toLowerCase())
        )
        groupMeals.value = groupMealsByCategory(tempMenu)
    } else {

        groupMeals.value = groupMealsByCategory(props.rest?.menu)
    }
}

watch(filter, () => {

    menuWithFilter()
})

let cartLength = computed(() => {
    let res = 0
    for (let item of cartStore.cart) {
        res += item.items.length
    }
    return res
})
watch(logoY, () => {
    logoY.value >= 100 ? logo.value.style.display = 'none' : logo.value.style.display = 'block'
})

onMounted(() => {
    groupMeals.value = groupMealsByCategory(props.rest?.menu)
    selectedCategory.value = groupMeals.value[0].category
    logo.value.style.display = 'none'
})


</script>

<template>

    <v-container>
        <v-row>

            <v-col ref="logo" cols="12" class="position-sticky pt-0 pb-0" style="z-index:2; top:0px; ">
                <div class="d-flex align-center" style="background:white">

                    <ClientOnly>
                        <transition name="fade">
                            <img v-if="logoY < 100" :src="rest.images.logo" style="width: 50px;" class="ma-2"></img>
                        </transition>
                    </ClientOnly>
                    <v-chip-group>
                        <v-chip color="red" variant="outlined" v-for="(item, index) in groupMeals" :key="index"
                            @click="selectCategory(item.category)">
                            {{ item.category }}
                        </v-chip>
                    </v-chip-group>
                </div>
                <div class=" w-100 ">
                    <div class="d-flex align-center float-left">
                        <v-btn icon="mdi-magnify" @click="showSearch" class="mr-2">

                        </v-btn>
                        <transition name="fade">
                            <v-text-field min-width="200" v-model='filter' v-if="isShow" density="compact"
                                variant="solo" hide-details single-line placeholder="поиск"
                                clear-icon="mdi-close-circle" clearable></v-text-field>
                        </transition>

                    </div>
                    <v-badge :content="cartLength" color="primary" class="d-flex align-center float-right">
                    <v-btn icon="mdi-cart" @click="cartDialog = true">
                    </v-btn>
                    </v-badge>

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
        <v-dialog v-model="cartDialog">
            <CartCard />
        </v-dialog>
    </v-container>
</template>
<style scoped></style>
