<script setup lang="ts">
import { toast } from 'vue3-toastify';
import type { Order } from '~/types/order.interface';

definePageMeta({
    middleware: 'auth'
})

const authStore = useAuth()
const cartStore = useCart()
const restStore = useRest()

let { user } = storeToRefs(authStore)
let orders = ref<any[]>([])
let loading = ref<boolean>(true)
let hasMoreOrders = ref<boolean>(false)
let page = 1

let getDate = (d: string) => {
    let t = new Date(d)
    return t.toLocaleString('ru-RU', {
        month: 'long',
        day: "numeric",
        hour: 'numeric',
        minute: 'numeric',
    })
}

function getStatus(status: string) {
    switch (status) {
        case 'created':
            return { text: 'Создан', color: 'accent' }
        case 'inWork':
            return { text: 'В работе', color: 'primary' }
        case 'inDelivery':
            return { text: 'Доставляется', color: 'secondary' }
        case 'delivered':
            return { text: 'Доставлен', color: 'success' }
    }
}

async function setRating(newRating: number, restId: string) {
    if (authStore.user?._id) {
        let res = await restStore.setRating(newRating, restId, authStore.user._id)
        if (res.status.value == 'success') {
            toast('Оценка поставлена', {
                type: 'success'
            })
        }
    }
}

async function getOrders() {
    if (user.value?._id) {
        let res = await cartStore.getUserOrders(user.value._id, page)
        if (res.status.value == 'success') {
            orders.value = res.data.value.orders
            hasMoreOrders.value = res.data.value.hasMoreOrders
            page++
        }
    }
    loading.value = false
}

let checkDelivered = (item: any) => {
    if (item.orders.find((order: Order) => order.status.toString() == "delivered")) {
        return true;
    }
    return false;
}

getOrders()
</script>

<template>
    <v-container>
        <v-row class="justify-center pb-16">
            <v-col :cols="12" :sm="10" :md="8" class="pa-0">
                <v-col cols="12" class="d-flex justify-center" v-if="loading">
                    <img src="~/assets/icons/kvak.gif" alt="">
                </v-col>
                <div v-else v-for="(item, index) in orders" :key="index">
                    <div class="ma-4" :id="item.rest">
                        <div class="text-center text-uppercase font-weight-bold p-clamp">
                            {{ item.rest }}
                        </div>
                        <div class="d-flex align-center justify-center">
                            <v-rating v-if="checkDelivered(item)" density="compact" color="primary"
                                v-model="item.rating"
                                @update:modelValue="setRating(item.rating, item.restId)"></v-rating>
                        </div>
                    </div>

                    <div v-for="(order, i) in item.orders">
                        <h3 class="h3-clamp">{{ getDate(order.date) }}</h3>
                        <v-chip :color="getStatus(order.status)?.color" variant="flat" class="p-clamp">
                            {{ getStatus(order.status)?.text }}
                        </v-chip>

                        <div v-for="item, j in order.items" >
                            <div v-if="!item.forWeighing" class="d-flex justify-space-between p-clamp">
                                <span>{{ item.menuItem }}</span> <span>{{ item.count }}шт * {{ item.price }}₽ = {{ (item.count
                                * item.price).toFixed(2) }}
                            </span>
                            </div>
                            <div v-else class="d-flex justify-space-between p-clamp">
                                <span>{{ item.menuItem }}</span> <span>{{ item.count }} шт * {{ item.price }}₽ * {{ item.averageMassOfOne }}кг =
                                    {{ (item.count * item.price * item.averageMassOfOne).toFixed(2) }}
                                </span>
                            </div>
                        </div>
                        <v-divider></v-divider>
                        <div class="text-end p-clamp">
                            <i>
                                <b> Итого: {{ 
                                        order.items.reduce((acc: number, currentVal: any) => {
                                            if (currentVal.forWeighing) {
                                                return acc + currentVal.price * currentVal.count * currentVal.averageMassOfOne
                                            }
                                            return acc + currentVal.price * currentVal.count 
                                        }, 0.0).toFixed(2)
                                    }}₽
                                </b>
                            </i>
                        </div>
                    </div>
                </div>

                <v-col cols="12" class="d-flex justify-center">
                    <v-btn size="large" variant="flat" color="primary" @click="getOrders"
                        v-if="hasMoreOrders">ещё</v-btn>
                </v-col>
            </v-col>
        </v-row>
    </v-container>
</template>