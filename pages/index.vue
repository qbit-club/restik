<script lang="ts" setup>
import _ from "lodash"
useHead({
  title: 'Рестик'
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
      <v-col cols="12">
        <v-img src="https://kalix.club/uploads/posts/2022-12/1671698971_kalix-club-p-planeti-art-oboi-1.jpg"
          max-height="25vh" cover alt="">
          <div style="color: white">Глазов - есть!</div>



        </v-img>
      </v-col>
      <v-col cols="12" class="d-flex align-center justify-center">


        <v-text-field v-model='filter' prepend-inner-icon="mdi-magnify" density="compact" max-width="300px"
          variant="solo" hide-details single-line placeholder="поиск ресторана" clear-icon="mdi-close-circle"
          clearable></v-text-field>

        <!-- <v-icon icon="mdi-magnify" class="ma-2" @click="showSearch" /> -->
      </v-col>

      <v-col cols="12" sm="6" md="4" lg="3" v-for="rest, index in restsWithFilter" :key="index">
        <NuxtLink :to="`/${rest.alias}`">
          <div class="h-100 d-flex flex-column align-center pa-4">
            <h3>{{ rest.title }}</h3>
            <v-img :src="rest.images.logo" class="w-100"></v-img>
          </div>
        </NuxtLink>
      </v-col>

    </v-row>
  </v-container>
</template>
