import { defineStore } from "pinia"
import RestApi from '../api/RestApi'

// interfaces
import type { Rest } from "../types/rest.interface"
import type { FoodListItemFromDb } from "~/types/food-list-item-from-db.interface"
import type { FoodListItem } from "~/types/food-list-item.interface"
import type { RestFromDb } from "~/types/rest-from-db.interface"

export const useRest = defineStore('rest', () => {
  // let halls = ref<Hall[] | []>()

  async function create(rest: Rest) {
    return await RestApi.create(rest)
  }
  async function get() {
    return await RestApi.get()
  }
  async function deleteRest(rest_id: string) {
    return await RestApi.deleteRest(rest_id)
  }
  async function getByAlias(alias: string) {
    return await RestApi.getByAlias(alias)
  }
  async function getById(_id: string) {
    return await RestApi.getById(_id)
  }
  async function uploadImages(formData: FormData, restId: string) {
    return await RestApi.uploadImages(formData, restId)
  }
  async function changeFoodList(restId: string, foodListItem: FoodListItemFromDb | FoodListItem) {
    return await RestApi.changeFoodList(restId, foodListItem)
  }
  async function sendFoodListItemToMenu(_id: string, restId: string) {
    return await RestApi.sendFoodListItemToMenu(_id, restId)
  }
  async function createFoodListItem(_id: string, item: FoodListItem) {
    return await RestApi.createFoodListItem({ restId: _id, foodListItem: item })
  }
  async function uploadFoodListItemImages(restId: string, foodListItemId: string, fd: FormData) {
    return await RestApi.uploadFoodListItemImages(restId, foodListItemId, fd)
  }
  async function moveFoodItemToMenu(restId: string, foodListItemId: string): Promise<any> {
    return await RestApi.moveFoodItemToMenu({ restId, foodListItemId })
  }
  async function deleteFromMenu(menuItemId: string, restId: string): Promise<any> {
    return await RestApi.deleteFromMenu(menuItemId, restId)
  }
  async function update(rest: Rest, restId: string): Promise<any> {
    return await RestApi.update(rest, restId)
  }

  return {
    create, update, get, getByAlias, getById, uploadImages,
    changeFoodList, sendFoodListItemToMenu, deleteRest, createFoodListItem,
    uploadFoodListItemImages, moveFoodItemToMenu, deleteFromMenu
  }
})