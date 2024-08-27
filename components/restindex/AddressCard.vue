<script setup lang="ts">
import type { RestFromDb } from "~/types/rest-from-db.interface"

useHead({
  title: "Глазов - есть!",
})
const props = defineProps<{
  rest: RestFromDb
}>()
</script>
<template>
  <v-container>
    <v-row class="justify-center pb-16">
      <v-col :cols="12" :sm="10" :md="8">
        <div class="my-5 d-flex align-center" style="font-weight: 600;">
          <v-icon icon="mdi-map-marker-radius-outline" class="cursor-pointer pr-1"></v-icon>
          <a :href="`https://yandex.ru/maps/?text=${props.rest.location.name}`">
            {{ props.rest.location.name }}
          </a>
        </div>
        <Map :location="props.rest.location"></Map>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped></style>
