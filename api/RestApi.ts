import type { FoodListItem } from '~/types/food-list-item.interface'
import type { Rest } from '../types/rest.interface'
import type { FoodListItemFromDb } from '~/types/food-list-item-from-db.interface'


export default {
  /**
   * pass a Hall type object and make a POST request to a /hall
   * @param rest 
   * @returns 
   */
  create(rest: Rest): Promise<any> {
    return useApiFetch('/rest', { method: 'POST', body: { rest } })
  },
  get(): Promise<any> {
    return useApiFetch('/rest/all', { method: 'GET' })
  },
  getWithHidden(): Promise<any> {
    return useApiFetch('/rest/all-with-hidden', { method: 'GET' })
  },
  getRestsName(): Promise<any> {
    return useApiFetch('/rest/rests-name', { method: 'GET' })
  },
  getRestsAlias(): Promise<any> {
    return useApiFetch('/rest/rests-alias', { method: 'GET' })
  },

  getManagersOfRest(rest_id: string): Promise<any> {
    return useApiFetch(`/rest/get-managers?rest_id=${rest_id}`, { method: 'GET' })
  },
  deleteRest(_id: string): Promise<any> {
    return useApiFetch(`/rest/delete?rest_id=${_id}`, { method: 'GET' })
  },
  hideRest(_id: string, isHiddenToSet: boolean): Promise<any> {
    return useApiFetch(`/rest/hide`, {
      method: 'PUT',
      body: {
        _id,
        isHiddenToSet
      }
    })
  },
  getByAlias(alias: string): Promise<any> {
    return useApiFetch('/rest/one-by-alias', { method: 'POST', body: { alias } })
  },
  getById(_id: string): Promise<any> {
    return useApiFetch(`/rest/by-id?_id=${_id}`, {
      method: 'GET'
    })
  },
  getByIds(_ids: string[]): Promise<any> {
    return useApiFetch('/rest/by-ids', {
      method: 'POST',
      body: {
        _ids: _ids
      }
    })
  },
  uploadImages(formData: FormData, _id: string): Promise<any> {
    return useApiFetch(`/rest/images?rest_id=${_id}`, { method: 'POST', body: formData, key: `upload-header-${Date.now()}` })
  },
  sendFoodListItemToMenu(_id: string, restId: string): Promise<any> {
    return useApiFetch('/rest/menu', {
      method: 'POST',
      body: {
        foodListItemId: _id,
        restId
      }
    })
  },
  /**
   * create new food list item 
   */
  createFoodListItem(body: any): Promise<any> {
    return useApiFetch('/rest/food-list', {
      method: 'POST',
      body: body
    })
  },

  uploadFoodListItemImages(restId: string, foodListItemId: string, fd: FormData): Promise<any> {
    return useApiFetch(`/rest/food-list-images?rest_id=${restId}&item_id=${foodListItemId}`, { method: 'POST', body: fd, key: `upload-header-${Date.now()}` })
  },
  moveFoodItemToMenu(body: {
    restId: string,
    foodListItemId: string
  }) {
    return useApiFetch('/rest/menu', {
      method: 'POST',
      body: body
    })
  },
  updateMeal(
    restId: string,
    meal: FoodListItem
  ) {
    return useApiFetch(`/rest/update-meal?rest_id=${restId}`, {
      method: 'PUT',
      body: { meal }
    })
  },
  // updateFoodListItemImages(restId: string, foodListItemId: string, fd: FormData): Promise<any> {
  //   return useApiFetch(`/rest/update-food-list-images?rest_id=${restId}&item_id=${foodListItemId}`, {
  //     method: 'PUT',
  //     headers: { 'Content-Type': 'multipart/form-data' },
  //     body: fd
  //   })
  // },

  deleteFromMenu(menuItemId: string, restId: string) {
    return useApiFetch(`/rest/delete-from-menu?rest_id=${restId}&menu_item_id=${menuItemId}`, { method: 'DELETE' })
  },
  deleteMeal(mealId: string, restId: string) {
    return useApiFetch(`/rest/delete-meal?rest_id=${restId}&meal_id=${mealId}`, { method: 'DELETE' })
  },
  update(rest: Rest, restId: string) {
    return useApiFetch(`/rest?rest_id=${restId}`, {
      method: 'PUT',
      body: { rest },
    })
  },
  addEmail(email: string, mailType: string, restId: string) {
    return useApiFetch('/rest/add-email', {
      method: 'PUT',
      body: {
        email,
        mailType,
        restId
      }
    })
  },
  deleteEmail(email: string, mailType: string, restId: string) {
    return useApiFetch('/rest/delete-email', {
      method: 'PUT',
      body: {
        email,
        mailType,
        restId
      }
    })
  },
  setRating(rating: number, restId: string, userId: string) {
    return useApiFetch('/rest/set-rating', {
      method: 'POST',
      body: {
        restId,
        userId,
        rating,
      },
    })
  }
}