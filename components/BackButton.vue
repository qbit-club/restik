<script setup lang="ts">
import { useRouter } from "vue-router";
import {mdiArrowLeft}  from '@mdi/js';
let router = useRouter()
</script>

<template>
  <div 
    @click="router.back()" 
    class="d-flex pt-1 pr-1 pb-1 cursor-pointer flex-row flex-nowrap align-center justify-start"
  >
    <v-icon :icon="mdiArrowLeft"></v-icon>
    
    <div 
      class="text-body-4 ml-1 font-weight-semibold"
    >назад</div>
  </div>
</template>