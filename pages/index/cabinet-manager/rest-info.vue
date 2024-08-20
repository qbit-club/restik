<script lang="ts" setup>
import type { RestFromDb } from '~/types/rest-from-db.interface';

// meta
useHead({
  title: "Редактировать ресторан",
});
definePageMeta({
  middleware: "auth",
});

const restStore = useRest();
const authStore = useAuth();


let { user } = storeToRefs(authStore);
let restFromDb = ref<RestFromDb>()

let managingRest = ref<any>();
managingRest.value = authStore.user?.managingRest;

let res = await restStore.getById(authStore.user?.managingRest || "")
restFromDb.value = res.data.value
async function getRest() {
  let res = await restStore.getById(authStore.user?.managingRest || "")
  restFromDb.value = res.data.value
}
// getRest()


watch(user, (newVal: any) => {
  managingRest.value = newVal?.managingRest;
  getRest()
});

// other imports
// console.log(restFromDb.value)
</script>
<template>
  <EditRest :rest="restFromDb"></EditRest>
</template>