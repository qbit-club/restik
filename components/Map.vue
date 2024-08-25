<script lang="ts" setup>
import Map from "ol/Map.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";
import View from "ol/View.js";
import { fromLonLat } from "ol/proj";
import type { Location } from "../types/location.interface";
const props = defineProps<{
  location: Location;
}>();

const map = ref(null);
console.log(props.location)
onMounted(() => {
  map.value = new Map({
    target: "map",

    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],

    view: new View({
      center: fromLonLat([props.location.geo_lon, props.location.geo_lat]),
      zoom: 17
    }),
  });
});
</script>

<template>
  <div id="map" class="map" style="height: 600px; width: 100%"></div>
</template>
<style lang="scss" scoped>
#map {
  position: relative;
  top: 0;
  bottom: 0;
  width: 100%;
}
</style>
