<script setup lang="ts">
import type { RestFromDb } from '~/types/rest-from-db.interface';
const props = defineProps<{
  rest: RestFromDb
}>()
</script>
<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card class="pa-4 ma-4">
          <p>
            Адрес : {{ props.rest.location.name }}
          </p>
          <p>
            Расписание : <span v-html="props.rest.schedule"></span>
          </p>
        </v-card>



      </v-col>
    </v-row>
  </v-container>


</template>
<style lang="scss" scoped></style>
