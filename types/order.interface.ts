export enum StatusEnum {
  'created',
  'inWork',
  'inDelivery',
  'delivered'
}

export interface Order {
  items: [{
    price: number,
    count: number,
    menuItem: string,
    images: string[],
    forWeighing: boolean,
    averageMassOfOne: number,
  }]
  date: string,
  rest: string,
  user: {
    name: string,
    phone: string,
    address: string,
    comment: string,
    _id: string | undefined
  },
  status: StatusEnum,
  // нужно для красивого отображения нового заказа,
  // в базу не сохраняется
  new: boolean | undefined,
}