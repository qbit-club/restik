<script setup lang="ts">
const cartStore = useCart()

let { cart } = storeToRefs(cartStore)
</script>
<template>
  <v-card>
    {{ cart }}
  </v-card>
</template>