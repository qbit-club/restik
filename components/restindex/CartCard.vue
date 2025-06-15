<script setup lang="ts">
import {mdiClose, mdiPhone, mdiCartRemove, mdiMinus, mdiPlus }  from '@mdi/js';
useHead({
  title: "Глазов - есть!",
})
import { toast } from "vue3-toastify"

const emit = defineEmits(["buy", "close"])

const cartStore = useCart()
const userStore = useAuth()

let { cart } = storeToRefs(cartStore)
const route = useRoute()

let name = ref<string>(localStorage.getItem("name") || userStore.user?.name || "")
let phone = ref<string>(localStorage.getItem("phone") ?? "")
let address = ref<string>(localStorage.getItem("address") ?? "")
let comment = ref<string>("")
// let paymentType = ref<string>("")

function plusCart(itemId: string, restId: string) {
  let success = cartStore.plusCart(itemId, restId)
}
function minusCart(itemId: string, restId: string) {
  let success = cartStore.minusCart(itemId, restId)
}
function clearRestCart(restId: string) {
  cartStore.clearRestCart(restId)
  emit("buy")
}

let amount = computed(() => {
  let res = 0.0
  for (let restItem of cart.value) {
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

let restItem = computed<any>(() => {
  for (let i of cart.value) {
    if (i.restInfo.alias == route.params.alias) {
      return i
    }
  }
  return {}
})

let loading = ref(false)
async function order() {
  if (name.value.length == 0) {
    toast("Введите имя", {
      type: "warning",
    })
    return
  }
  if (phone.value.length == 0) {
    toast("Введите телефон", {
      type: "warning",
    })
    return
  }
  if (address.value.length == 0) {
    toast("Введите адрес", {
      type: "warning",
    })
    return
  }
  // if (paymentType.value == "") {
  //   toast("Выберите способ оплаты", {
  //     type: "warning",
  //   })
  //   return
  // }
  if (amount.value == '0.00') {
    toast("Пустая корзина", {
      type: "warning",
    })
    return
  }
  loading.value = true
  let response = await cartStore.order(String(route.params.alias), {
    name: name.value,
    phone: phone.value,
    address: address.value,
    comment: comment.value,
    // paymentType: paymentType.value

  })
  if (response.status.value == "success") {
    loading.value = false
    let orderId = response.data.value.order._id
    let tmpId = orderId.slice(orderId.length - 5, orderId.length)
    toast(`Заказ №${tmpId} принят!`, {
      type: "success",
      autoClose: false,
      toastId: orderId,
    })
    emit("buy")
  }
}
watch(phone, (newPhone) => {
  if (process.client) {
    localStorage.setItem("phone", newPhone)
  }
})
watch(name, (newName) => {
  if (process.client) {
    localStorage.setItem("name", newName)
  }
})
watch(address, (newAddress) => {
  if (process.client) {
    localStorage.setItem("address", newAddress)
  }
})


</script>
<template>
  <v-card class="py-5 px-6 position-relative">
    <div class="position-fixed top-0 left-0 pa-3  w-100 text-right">
      <v-icon :icon="mdiClose" variant="plain" color="accent" @click="emit('close')"></v-icon>
    </div>



    <div class="cart-item" v-if="restItem?.restId">
      <v-row class="mb-3">
        <v-col cols="12">
          <div class="caption">Имя</div>
          <v-text-field density="compact" variant="outlined" :hide-details="true" v-model="name"></v-text-field>
        </v-col>
        <v-col cols="12" class="pb-0">
          <div class="caption">Телефон</div>
          <v-text-field density="compact" variant="outlined" :hide-details="true" v-model="phone"></v-text-field>
        </v-col>
        <v-col cols="12" class="pb-0">
          <div class="caption">Адрес доставки</div>
          <v-text-field density="compact" variant="outlined" :hide-details="true" v-model="address"></v-text-field>
        </v-col>
        <v-col cols="12" class="pb-0">
          <div class="caption"> Комментарии</div>
          <v-textarea variant="outlined" auto-grow rows="1" :hide-details="true" v-model="comment"></v-textarea>
        </v-col>
        <!-- <v-col cols="12" class="pb-0">
          <div class="caption"> Оплата</div>
          <v-radio-group inline v-model="paymentType">
            <v-radio color="accent" label="Наличными" value="наличными"></v-radio>
            <v-radio color="accent" label="Карточкой" value="карточкой"></v-radio>

          </v-radio-group>
        </v-col> -->
      </v-row>
      <h3>{{ restItem.restInfo.title }}</h3>
      <div class="rest-info">
        <div class="d-flex flex-column justify-space-between">
          <span class="text-caption" v-html="restItem.restInfo.schedule"></span>
        </div>
        <div class="d-flex align-center">
          <a :href="restItem.restInfo.socialMedia" target="_blank" class="d-flex align-center ml-4">
            <img src="../../assets/icons/vk.svg" class="vk" />
          </a>
          <a :href="`tel:${restItem.restInfo.phone}`"><v-icon :icon="mdiPhone" class="ml-4" size="20" /></a>
        </div>
        <div class="d-flex align-center ml-6">
          <v-btn :icon="mdiCartRemove" variant="plain" @click="clearRestCart(restItem.restId)"> </v-btn>
        </div>
      </div>
      <div v-for="item of restItem.items">
        <div class="item">
          <div style="width: 80px" aspect-ratio="1">
            <v-img :src="item.images[0]" />
          </div>

          <div class="info">
            <div class="name text-right">{{ item.name }}</div>
            <div lass="d-flex justify-space-between">
              <div v-if="!item.forWeighing" class="numbers">
                <span style="font-weight: 300">{{ `${item.price} * ${item.count} = ` }}</span>&nbsp;

                <span style="font-weight: 600">{{ (item.count * item.price).toFixed(2) }}₽</span>&nbsp;
              </div>
              <div v-else class="numbers">
                <span style="font-weight: 300">{{
        `${item.price}₽ * ${item.count} шт * ${item.averageMassOfOne}кг = `
      }}</span>&nbsp;

                <span v-if="!item.forWeighing" style="font-weight: 600">{{ (item.count * item.price).toFixed(2)
                  }}₽</span>&nbsp;
                <span v-else style="font-weight: 600">{{ (item.count * item.price * item.averageMassOfOne).toFixed(2)
                  }}₽</span>&nbsp;
              </div>
              <div class="d-flex justify-end align-center ml-4">
                <div class="cart-actions">
                  <div class="cart-plus-minus">
                    <v-icon :icon="mdiMinus" class="cursor-pointer"
                      @click="minusCart(item.menuItemId, restItem.restId)"></v-icon>
                    <div class="cart-count">
                      {{ item.count }}
                    </div>
                    <v-icon :icon="mdiPlus" class="cursor-pointer"
                      @click="plusCart(item.menuItemId, restItem.restId)"></v-icon>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <v-divider class="ma-1"></v-divider>
      </div>
    </div>

    <div v-else class="pb-6 text-center" style="font-weight: 600">
  
      в корзине пусто
    </div>

    <div class="d-flex justify-space-between" v-if="restItem?.restId">
      <v-btn variant="flat" size="large" color="primary" @click="order" :loading="loading">заказать</v-btn>
      <div class="amount d-flex align-center">{{ amount }}₽</div>
    </div>
  </v-card>
</template>
<style scoped lang="scss">
.caption {
  font-size: 13px;
}

.cart-item {
  margin-bottom: 38px;
  width: 100%;


  .item {
    display: flex;
    justify-content: space-between;

    .info {
      display: flex;
      flex-direction: column;
      font-size: 16px;
      margin-left: 10px;

      .numbers {
        // margin-bottom: px;
        font-size: 12px;
        text-align: right;
      }
    }
  }

  .rest-info {
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
  }
}

.cart-actions {
  background-color: #e4e4e4;
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

.amount {
  font-size: 20px !important;
  font-weight: 500 !important;
  margin-left: 8px;
}

.vk {
  height: 20px;
}
</style>
