<script setup lang="ts">
import { mdiCellphone, mdiShareVariantOutline, mdiSilverwareForkKnife, mdiInformationOutline, mdiMapMarkerOutline, mdiTruckFastOutline } from '@mdi/js';
import { useShare } from '@vueuse/core'
import InfoCard from '../../components/restindex/InfoCard.vue'
import DeliveryCard from '../../components/restindex/DeliveryCard.vue'
import AddressCard from '../../components/restindex/AddressCard.vue'
import Menu from '../../components/restindex/Menu.vue';

import type { RestFromDb } from "../../types/rest-from-db.interface.ts"
const runtimeConfig = useRuntimeConfig()

const rest = ref<RestFromDb>()
const restStore = useRest()

let route = useRoute()
let currentTab = shallowRef<any>(Menu)

let alias = String(route.params.alias) ?? ""
let activMenu = ref<string>('0')
let res = await restStore.getByAlias(alias)

let restUrl = computed(() => {
  return runtimeConfig.public.siteUrl + '/' + rest.value?.alias
})
let stripHtml = computed(() => {
  return rest.value?.description.replace(/<[^>]*>/g, ''); // Удаляет все HTML-теги из строки  
})
const options = ref({
  url: restUrl.value,
})

const { isSupported } = useShare(options)

function startShare() {
  options.value.url = restUrl.value

  const { share } = useShare(options)

  return share().catch(err => {
    console.log(err);
  })
}


rest.value = res.data.value
</script>
<template>

  <Head>
    <Title>{{ rest?.title }}</Title>
    <Meta name="og:title" :content="rest?.title" />
    <Meta name="og:image" :content="rest?.images.logo" />
    <Meta name="image" :content="rest?.images.logo" />
    <Meta property="vk:image" :content="rest?.images.logo" />
    <Meta name="description" :content="rest?.description" />
    <Meta name="og:description" :content="stripHtml" />
    <Meta property="og:site_name" :content="rest?.title" />
    <Meta name="og:url" :content="restUrl" />
  </Head>
  <ClientOnly>
    <v-container>
      <v-row class="d-flex justify-center pb-16">

        <v-col :cols="12">
          <v-row>
            <v-col :cols="12" style="position: relative;" class="pa-0">
              <a :href="`tel:${rest?.phone}`"> <span class="phone p-clamp pa-1 pa-sm-2 pa-md-3"> <v-icon
                    :icon="mdiCellphone" /> {{ rest?.phone }}
                </span></a>
              <div class="vk">
                <a :href="rest?.socialMedia" target="_blank">
                  <img src="../../assets/icons/vk.svg" />
                </a>
              </div>

              <div style="height:25dvh">
                <v-img :src="rest?.images.headerimage" height="100%" cover alt="">
                  <v-btn v-if="isSupported" size="small" :icon="mdiShareVariantOutline" style="float: left;"
                    class="mt-4 ml-md-6 ml-4" @click="startShare()">

                  </v-btn>

                </v-img>
              </div>


              <NuxtLink to="/">
                <div class="logo">
                  <v-img :src="rest?.images.logo" alt="" cover aspect-ratio="1"></v-img>
                </div>
              </NuxtLink>
            </v-col>
            <v-col :cols="12" class="ma-0 pa-0 mt-8">
              <p class="text-center p-clamp font-weight-light">{{ rest?.type.toLowerCase() }}</p>
              <v-divider width="30%" style="margin-left: auto; margin-right: auto;"></v-divider>
              <div class="title">{{ rest?.title }}</div>

            </v-col>
            <v-col cols="12" v-if="rest?.isHidden">
              <div class="text-center"> Сейчас мы закрыты</div>

            </v-col>
            <v-col :cols="12" class="pb-0" v-if="!rest?.isHidden">

              <v-btn-toggle v-model="activMenu" color="secondary" style="height:60px" class="d-flex overflow-x-auto">
                <v-btn @click="currentTab = Menu" size="x-large">
                  <div class="d-flex flex-column align-center">
                    <v-icon :icon="mdiSilverwareForkKnife" size="x-large" />
                    <div class="explanation">меню/витрина</div>
                  </div>
                </v-btn>

                <v-btn @click="currentTab = InfoCard" size="x-large">
                  <div class="d-flex flex-column align-center">
                    <v-icon :icon="mdiInformationOutline" size="x-large" />
                    <div class="explanation">инфо</div>
                  </div>
                </v-btn>

                <v-btn @click="currentTab = DeliveryCard" size="x-large">
                  <div class="d-flex flex-column align-center">
                    <v-icon :icon="mdiTruckFastOutline" size="x-large" />
                    <div class="explanation">время <br> работы</div>
                  </div>
                </v-btn>
                <v-btn @click="currentTab = AddressCard" size="x-large">
                  <div class="d-flex flex-column align-center">
                    <v-icon :icon="mdiMapMarkerOutline" size="x-large" />
                    <div class="explanation">адрес</div>
                  </div>
                </v-btn>
        
              </v-btn-toggle>
            </v-col>
            <component :is="currentTab" :rest="rest" v-if="!rest?.isHidden"></component>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </ClientOnly>
</template>
<style lang="scss" scoped>
.logo {
  border: 4px solid white;
  position: absolute;
  left: 5%;
  bottom: -15%;
  width: 18%;
  max-width: 180px;
  border-radius: 50%;
  overflow: hidden;
  background: white;
  box-shadow: 10px 14px 13px -14px rgba(0, 0, 0, 0.75);
  -webkit-box-shadow: 10px 14px 13px -14px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 10px 14px 13px -14px rgba(0, 0, 0, 0.75);

  img {
    width: 100%;

  }
}


.title {
  font-size: clamp(1rem, 0.2rem + 3.2vw, 2rem);
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
}

.phone {
  background: rgba(256, 256, 256, 0.9);
  font-weight: 600;
  color: black;

  border-radius: 5px;
  position: absolute;
  right: 25px;
  bottom: 10px;
  z-index: 2;
}

.vk {
  position: absolute;
  right: 25px;
  bottom: -40px;
  z-index: 2;


}
</style>
