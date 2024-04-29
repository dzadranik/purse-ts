<script setup lang="ts">
import Logo from "../components/icons/Logo.vue";

type Link = { to: string; title: string };

const links: Link[] = [
  {
    to: "/",
    title: "Настройки",
  },
  {
    to: "/order-book",
    title: "Order Book",
  },
];
</script>

<template>
  <v-main class="h-screen d-flex flex-column">
    <div class="custom-content__header">
      <v-tabs bg-color="indigo-lighten-5">
        <v-tab
          v-for="({ to, title }, key) in links"
          :to
          :key
          class="text-blue-darken-1"
          >{{ title }}</v-tab
        >
        <Logo class="align-self-center ml-auto mr-5 h-75 w-auto" />
      </v-tabs>
    </div>
    <slot />
  </v-main>
</template>

<style scoped></style>
