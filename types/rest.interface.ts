import type { Location } from "./location.interface";
import type { Table } from "./table.interface";
import type { FoodListItemFromDb } from "./food-list-item-from-db.interface";

export interface Rest {
  title: string;
  type: string;
  alias: string;
  phone: string;
  socialMedia: string;
  location: Location;
  author: string;
  tables?: Table[];
  description: string;
  schedule: string;
  managers?: [];
  menu: string[] & FoodListItemFromDb[];
  foodList: FoodListItemFromDb[];
  deleted: boolean;
  placeOnShowcase: Number;
}
