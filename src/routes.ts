// @filename: routes.ts

export default [
  { path: "/", component: () => import("./pages/settings/Settings.vue") },
  {
    path: "/order-book",
    component: () => import("./pages/order-book/OrderBook.vue"),
  },
];
