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
  async function getWithHidden() {
    return await RestApi.getWithHidden()
  }
  async function getRestsName() {
    return await RestApi.getRestsName()
  }
  async function getManagersOfRest(rest_id: string) {
    return await RestApi.getManagersOfRest(rest_id)
  }
  async function deleteRest(rest_id: string) {
    return await RestApi.deleteRest(rest_id)
  }
  async function hideRest(restId: string, isHiddenToSet: boolean) {
    return await RestApi.hideRest(restId, isHiddenToSet)
  }
  async function getByAlias(alias: string) {
    return await RestApi.getByAlias(alias)
  }
  async function getById(_id: string) {
    return await RestApi.getById(_id)
  }
  async function getByIds(_ids: any) {
    return await RestApi.getByIds(_ids)
  }
  async function uploadImages(formData: FormData, restId: string) {
    return await RestApi.uploadImages(formData, restId)
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
  async function updateMeal(restId: string, mealItem: FoodListItemFromDb | FoodListItem): Promise<any> {
    return await RestApi.updateMeal(restId, mealItem)
  }
  // async function updateFoodListItemImages(restId: string, foodListItemId: string, fd:FormData): Promise<any> {
  //   return await RestApi.updateFoodListItemImages( restId, foodListItemId, fd)
  // }
  async function deleteFromMenu(menuItemId: string, restId: string): Promise<any> {
    return await RestApi.deleteFromMenu(menuItemId, restId)
  }
  async function deleteMeal(mealId: string, restId: string): Promise<any> {
    return await RestApi.deleteMeal(mealId, restId)
  }
  async function update(rest: any, restId: string): Promise<any> {
    return await RestApi.update(rest, restId)
  }
  /**
   * 
   * @param email который нужно добавить в mangingRest у user'а
   * @param mailType какие письма будут присылаться пользователю
   * @returns 
   */
  async function addEmail(email: string, mailType: string): Promise<any> {
    const userStore = useAuth()
    if (userStore.user?.managingRest) {
      let res = await RestApi.addEmail(email, mailType, userStore.user.managingRest)
      if (res.status.value == 'success') {
        userStore.managingRestObject = res.data.value
      }
      return res
    }
    return {}
  }
  /**
   * этот мед в паре с addEmail
   * @param email email to delete
   * @param mailType 
   */
  async function deleteEmail(email: string, mailType: string): Promise<any> {
    const userStore = useAuth()
    if (userStore.user?.managingRest) {
      let res = await RestApi.deleteEmail(email, mailType, userStore.user.managingRest)
      if (res.status.value == 'success') {
        userStore.managingRestObject = res.data.value
      }
      return res
    }
    return {}
  }

  async function setRating(rating: number, restId: string, userId: string) {
    return await RestApi.setRating(rating, restId, userId)
  }

  return {
    create, update, get, getWithHidden, getRestsName, getByAlias, getById, getByIds, uploadImages, getManagersOfRest,
    sendFoodListItemToMenu, deleteRest, hideRest, createFoodListItem,
    uploadFoodListItemImages, moveFoodItemToMenu, updateMeal, deleteFromMenu, deleteMeal, addEmail, deleteEmail,
    setRating,
  }
  //updateFoodListItemImages
})