<script lang="ts" setup>
import type { Rest } from '~/types/rest.interface';

const auth = useAuth()

const restStore = useRest()
const authStore = useAuth()
let { data } = await restStore.get()
let rest_ids = ref<[]>()
let chosen_rest=ref<any>("")
let user_email = ref("")

async function setManager(){
    await authStore.setManager(user_email.value,chosen_rest.value)
}

onMounted(async ()=>{
    rest_ids=data.value.map( (item:Rest) => ({name:item.title, alias:item.alias}) )
})
</script>

<template>
  <v-row>
    <v-col cols="4">
      <v-select
        label="Рестораны"
        :items="rest_ids"
        item-title="name"
        item-value="id"
        v-model="chosen_rest"
      >
      </v-select>
    </v-col>
    <v-col cols="8">
      <v-text-field v-model="user_email" placeholder="Электронная почта" type="email">
      </v-text-field>
    </v-col>
  </v-row>
  <v-btn variant="tonal" @click="setManager()">сделать менеджером</v-btn>
</template>

<style scoped></style>
