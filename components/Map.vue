<script lang="ts" setup>
import { ref, onMounted, defineProps } from 'vue';
import Map from "ol/Map.js";
import View from "ol/View.js";
import TileLayer from "ol/layer/Tile.js";
import OSM from "ol/source/OSM.js";
import Feature from "ol/Feature.js";
import Point from "ol/geom/Point.js";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import { fromLonLat } from "ol/proj";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";

// Определение типа для координат
type Location = {
  geo_lon: number,
  geo_lat: number
}

// Получение пропсов
const props = defineProps<{
  location: Location;
}>();

// Ссылка на объект карты
const map = ref<Object|null>(null);

// Инициализация карты при монтировании компонента
onMounted(() => {
  // Создание базового слоя
  const baseLayer = new TileLayer({
    source: new OSM(),
  });

  // Создание точки с заданными координатами
  const pointFeature = new Feature({
    geometry: new Point(fromLonLat([props.location.geo_lon, props.location.geo_lat])),
  });

  // Установка стиля для точки
  pointFeature.setStyle(
    new Style({
      image: new CircleStyle({
        radius: 7, // Радиус круга точки
        fill: new Fill({ color: '#D51829' }), // Цвет точки
      
      }),
    })
  );

  // Создание векторного слоя и добавление в него точки
  const vectorLayer = new VectorLayer({
    source: new VectorSource({
      features: [pointFeature], // Добавляем точку как фичу
    }),
  });

  // Создание карты и добавление слоев
  map.value = new Map({
    target: "map",
    layers: [baseLayer, vectorLayer], // Добавление базового и векторного слоя
    view: new View({
      center: fromLonLat([props.location.geo_lon, props.location.geo_lat]), // Центр карты
      zoom: 17, // Уровень приближения
    }),
  });
});
</script>

<template>
  <div id="map"></div>
</template>

<style lang="scss" scoped>
#map {
  position: relative;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}
</style>