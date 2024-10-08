export default {
  order(cart: any): Promise<any> {
    return useApiFetch("/order", { method: "POST", body: { order: cart } });
  },
  getOrdersByOrdersId(ordersId: any): Promise<any> {
    return useApiFetch("/order/order-by-orderId", {
      method: "POST",
      body: { ordersId },
    });
  },
  getOrdersByRestId(restId: string, page: number): Promise<any> {
    return useApiFetch(`/order/by-rest-id?rest_id=${restId}&page=${page}`, {
      method: "GET",
    });
  },
  getUserOrders(userId: string, page: number): Promise<any> {
    return useApiFetch("/order/user-orders", {
      method: "POST",
      body: { userId, page },
    });
  },
  changeStatus(orderId: string, status: string): Promise<any> {
    return useApiFetch("/order/status", {
      method: "PUT",
      body: {
        orderId,
        status,
      },
    });
  },
};
