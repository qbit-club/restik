import { defineStore } from "pinia"

// types
import type { FoodListItemFromDb } from "~/types/food-list-item-from-db.interface"
import type { RestFromDb } from './../types/rest-from-db.interface';
interface CartItem {
  items: [{
    price: number,
    count: number,
    name: string,
    health: object,
    images: string[],
    menuItemId: string
  }]
  restId: string
  restInfo: object
}
export const useCart = defineStore('cart', () => {
  let cart = ref<CartItem[]>([])

  function addToCart(meal: FoodListItemFromDb, rest: RestFromDb): void {
    const itemToPush = {
      price: parseFloat(meal.price),
      count: 1,
      name: meal.name,
      health: meal.health,
      images: meal.images,
      menuItemId: meal._id,
    }
    // если нет такого ресторана в корзине, то создаем его
    // ииначе добавляем в споисок товаров текущий товар
    if (!cart.value.find((o) => o.restId == rest._id)) {
      cart.value.push({
        restId: rest._id,
        restInfo: {
          title: rest.title,
          phone: rest.phone,
          socialMedia: rest.socialMedia,
          schedule: rest.schedule
        },
        items: [itemToPush]
      })
    } else {
      for (let i = 0; i < cart.value.length; i++) {
        if (cart.value[i].restId == rest._id) {
          cart.value[i].items.push(itemToPush)
          break
        }
      }
    }
  }
  /**
   * 
   * @param menuItemId 
   * @param restId
   * @returns true if success
   */
  function plusCart(menuItemId: string, restId: string): boolean {
    for (let i = 0; i < cart.value.length; i++) {
      if (cart.value[i].restId == restId) {
        for (let j = 0; j < cart.value[i].items.length; j++) {
          if (cart.value[i].items[j].menuItemId == menuItemId) {
            cart.value[i].items[j].count += 1;
            return true
          }
        }
      }
    }
    return false
  }
  /**
   * 
   * @param menuItemId 
   * @param restId
   * @returns true if success
   */
  function minusCart(menuItemId: string, restId: string): boolean {
    for (let i = 0; i < cart.value.length; i++) {
      if (cart.value[i].restId == restId) {
        for (let j = 0; j < cart.value[i].items.length; j++) {
          if (cart.value[i].items[j].menuItemId == menuItemId) {
            if (cart.value[i].items[j].count > 1) {
              cart.value[i].items[j].count -= 1;
              return true
            }
            if (cart.value[i].items[j].count == 1) {
              cart.value[i].items.splice(j, 1);
              return true
            }
          }
        }
      }
    }
    return false
  }
  return {
    // variables:
    cart,
    // methods:
    addToCart,
    plusCart,
    minusCart
  }
})
