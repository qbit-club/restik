<script lang="ts" setup>
import type { Rest } from '~/types/rest.interface';
import type { Role } from '~/types/role.interface';

const auth = useAuth()

const restStore = useRest()
const authStore = useAuth()
let { data } = await restStore.get()
let user = authStore.user
let rest_ids = ref<string[]>()
let chosen_rest=ref("")
let user_email = ref("")

async function setManager(){
    await authStore.setManager(user_email.value,chosen_rest.value)
}

onMounted(async ()=>{
    // rest_ids=data.value.filter((rest:Rest) => user?.role.rest_ids.includes(rest.alias)).map( (rest:Rest) => ({name:rest.title, id:rest.alias}) )
    let user_rests=authStore.user?.roles.find((role:Role) => role.type=="manager")?.rest_ids
    rest_ids.value=data.value.filter((rest:Rest)=>user_rests?.includes(rest.alias)).map( (rest:Rest) => ({name:rest.title, alias:rest.alias}))
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
