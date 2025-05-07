<script setup lang="ts">
const { data: description } = await useAsyncData(() => queryCollection('content').path('/description-and-restrictions').first())
</script>
<template>

  <v-container>
    <v-row class="justify-center">
      <v-col cols="12" sm="10" md="8">
        <BackButton />
      </v-col>
      <v-col cols="12" sm="10" md="8" class="pa-8">
        <ContentRenderer v-if="description" :value="description" />
    
      </v-col>
    </v-row>

  </v-container>
</template>