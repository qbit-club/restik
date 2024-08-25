<script setup lang="ts">
useHead({
  title: "Глазов - есть!",
});
const props = defineProps<{
  rest: RestFromDb;
}>();
</script>
<template>
  <v-container>
    <v-row class="justify-center pb-16">
      <v-col :cols="12" :sm="10" :md="8" class="pa-0">
        <v-card class="pa-8" width="100%" min-width="300" title="Адрес">
          <a :href="`https://yandex.ru/maps/?text=${props.rest.location.name}`">
            <p>Адрес : {{ props.rest.location.name }}</p>
          </a>
          <Map :location="props.rest.location"></Map>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
</style>
