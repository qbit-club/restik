<script setup lang="ts">
import type { RestFromDb } from '~/types/rest-from-db.interface';

defineProps<{
  rest: RestFromDb
}>()

</script>
<template>
  <v-container>
    <v-row class="justify-center pb-16 pt-8">
      <v-col :cols="12" :sm="10" :md="8" class="pa-0">
        <v-card class="pa-4" width="100%">
        <p>
          <span v-html="rest.description"></span>
        </p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<style lang="scss" scoped></style>
