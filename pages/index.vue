<script lang="ts" setup>

useHead({
  title: 'Глазов - есть!'
})

const restStore = useRest()
const router = useRouter()

let { data } = await restStore.get()
let rests = ref(data.value)



let isShow = ref(false)
let filter = ref<string>('')

let restsWithFilter = computed(() => {
  if (filter.value == null) {
    filter.value = ''
  }
  if (filter.value.length > 2) {
    return rests.value.filter((rest: any) =>
      rest.title.toLowerCase().includes(filter.value.toLowerCase()) ||
      rest.description.toLowerCase().includes(filter.value.toLowerCase())
    )
  } else {

    return rests.value
  }

})

let showSearch = () => {
  if (filter.value == '') {
    isShow.value = !isShow.value
  }
}

</script>

<template>
  <v-container>
    <v-row class="pb-16">
      <v-col cols="12" class="pa-0" style="height:25dvh">
        <v-img src="../assets/images/headerImg.jpg" height="100%"  cover alt="">
        </v-img>
      </v-col>
      <NuxtPage></NuxtPage>
    </v-row>
  </v-container>
</template>
<style></style>
