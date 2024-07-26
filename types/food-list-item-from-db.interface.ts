import type { FoodListItem } from "./food-list-item.interface";

export interface FoodListItemFromDb extends FoodListItem {
  _id: string
  images: string[]
}