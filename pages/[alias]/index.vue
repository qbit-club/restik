<script setup lang="ts">
import InfoCard from '../../components/_restindex/InfoCard.vue'
import DeliveryCard from '../../components/_restindex/DeliveryCard.vue'
import AddressCard from '../../components/_restindex/AddressCard.vue'
import Menu from '~/components/_restindex/Menu.vue';
import Reservation from '~/components/_restindex/Reservation.vue'
import type { RestFromDb } from "../../types/rest-from-db.interface.ts"

const restStore = useRest()

let route = useRoute()
let rest = ref<RestFromDb>()

let currentTab = shallowRef<any>(Menu)

let alias = String(route.params.alias) ?? ""
let activMenu = ref<string>('0')
let res = await restStore.getByAlias(alias)

rest.value = res.data.value
</script>
<template>
  <ClientOnly>
    <v-container>
      <v-row class="d-flex justify-center pb-16">
        <v-col :cols="12">
          <v-row>
            <v-col :cols="12" style="position: relative;">
              <a :href="`tel:${rest?.phone}`"> <span class="phone"> <v-icon icon="mdi-phone" /> {{ rest?.phone }}
                </span></a>
              <a :href="rest?.socialMedia" target="_blank">
                <img src="../../assets/icons/vk.svg" class="vk" />
              </a>
              <v-img :src="rest?.images.headerimage" max-height="25vh" cover alt="">

              </v-img>
              <div>

                <div class="logo">
                  <img :src="rest?.images.logo" alt="">
                </div>

              </div>
            </v-col>
            <v-col :cols="12" class="ma-0 pa-0">
              <div class="title">{{ rest?.title }}</div>
            </v-col>
            <v-col :cols="12" class="pb-0">
              <div class="d-flex">
                <v-btn-toggle v-model="activMenu">
                  <v-btn @click="currentTab = Menu" size="x-large">
                    <div class="d-flex flex-column align-center">
                      <v-icon icon="mdi-silverware-fork-knife" size="x-large" />
                      <div class="explanation">меню</div>
                    </div>
                  </v-btn>

                  <v-btn @click="currentTab = Reservation" size="x-large">
                    <div class="d-flex flex-column align-center">
                      <v-icon icon="mdi-table-chair" size="x-large" />
                      <div class="explanation text-center">бронь <br> столиков</div>
                    </div>
                  </v-btn>
                  <v-btn @click="currentTab = InfoCard" size="x-large">
                    <div class="d-flex flex-column align-center">
                      <v-icon icon="mdi-information-outline" size="x-large" />
                      <div class="explanation">инфо</div>
                    </div>
                  </v-btn>

                  <v-btn @click="currentTab = DeliveryCard" size="x-large">
                    <div class="d-flex flex-column align-center">
                      <v-icon icon="mdi-truck-fast-outline" size="x-large" />
                      <div class="explanation">доставка</div>
                    </div>
                  </v-btn>
                  <v-btn @click="currentTab = AddressCard" size="x-large">
                    <div class="d-flex flex-column align-center">
                      <v-icon icon="mdi-map-marker-outline" size="x-large" />
                      <div class="explanation">адрес</div>
                    </div>
                  </v-btn>
                </v-btn-toggle>
              </div>
            </v-col>
            <component :is="currentTab" :rest="rest"></component>
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
  width: 20%;
  border-radius: 50%;
  overflow: hidden;
  aspect-ratio: 1;
  background: white;
  box-shadow: 10px 14px 13px -14px rgba(0,0,0,0.75);
-webkit-box-shadow: 10px 14px 13px -14px rgba(0,0,0,0.75);
-moz-box-shadow: 10px 14px 13px -14px rgba(0,0,0,0.75);

  img {
    width: 100%;

  }
}


.title {
  font-size: clamp(1.5rem, 1.1023rem + 1.1364vw, 2rem);
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
}

.phone {
  background: rgba(256, 256, 256, 0.8);
  font-weight: 600;
  color: black;
  padding: 10px;
  border-radius: 5px;
  position: absolute;
  right: 20px;
  bottom: 20px;
  z-index: 999;
}

.vk {
  position: absolute;
  right: 20px;
  bottom: -20px;
  z-index: 999;

}
</style>
