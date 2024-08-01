import { defineStore } from "pinia"
import CartAPI from "~/api/CartAPI";
import type { OrderFromDb } from "~/types/order-from-db.interface";
const OrderAPI = CartAPI
// interfaces


export const useOrder = defineStore('order', () => {
  let orders = ref<any>([])

  async function getOrdersByRestId(restId: string) {
    let res = await OrderAPI.getOrdersByRestId(restId)
    
    if (res.status.value == 'success') {
      orders.value = res.data.value
    }
    return res
  }

  function pushOrder(order: OrderFromDb) {
    orders.value.push({...order, new: true})
  }
  return {
    // functions
    getOrdersByRestId,
    pushOrder,
    // variables
    orders,
  }
})