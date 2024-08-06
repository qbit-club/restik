<script lang="ts" setup>
import _ from "lodash";
import type { RestFromDb } from "../../types/rest-from-db.interface.ts";
useHead({
  title: "Список ресторанов",
});

const restStore = useRest();
const router = useRouter();

let rests = ref<RestFromDb[] | []>();

let confirmDeleteDialog = ref<boolean>(false);
let confirmHideDialog = ref<boolean>(false);
let isShow = ref(false);
let chosenId = ref("");
let filter = ref<string>("");

let restsWithFilter = computed(() => {
  if (filter.value == null) {
    filter.value = "";
  }
  if (filter.value.length > 2) {
    return rests.value?.filter(
      (rest: any) =>
        rest.title.toLowerCase().includes(filter.value.toLowerCase()) ||
        rest.description.toLowerCase().includes(filter.value.toLowerCase())
    );
  } else {
    return rests.value;
  }
});
let getRestList = async () => {
  let { data } = await restStore.getWithHidden();
  rests.value = data.value;
};

let initDeleteDialog = async (id: string) => {
  chosenId.value = id;
  confirmDeleteDialog.value = true;
};

let initHideDialog = async (id: string) => {
  chosenId.value = id;
  confirmHideDialog.value = true;
};

let deleteRest = async (id: string) => {
  await restStore.deleteRest(id);
  await getRestList();
  confirmDeleteDialog.value = false;
};
let hideRest = async (id: any) => {
  await restStore.hideRest(id);
  await getRestList();
  confirmHideDialog.value = false;
};

let showSearch = () => {
  if (filter.value == "") {
    isShow.value = !isShow.value;
  }
};
getRestList();
</script>

<template>
  <v-container>
    <v-row class="pt-4 pb-16">
      <v-col cols="12">
        <h3>Список ресторанов</h3>
      </v-col>
      <v-col cols="12" class="d-flex align-center">
        <v-icon icon="mdi-magnify" class="ma-2" @click="showSearch" />
        <transition name="fade">
          <v-text-field
            v-model="filter"
            v-if="isShow"
            density="compact"
            variant="solo"
            hide-details
            single-line
            placeholder="поиск ресторана"
            clear-icon="mdi-close-circle"
            clearable
          ></v-text-field>
        </transition>
      </v-col>

      <v-col
        cols="12"
        v-for="(rest, index) in restsWithFilter"
        :key="index"
        :class="[rest.isHidden ? 'out-menu' : '']"
      >
        <div class="d-flex justify-space-between">
          <div
            class="d-flex align-center cursor-pointer"
            @click="router.push(`/${rest.alias}`)"
          >
            <div style="width: 50px">
              <v-img :src="rest.images.logo"></v-img>
            </div>

            <h4 class="ma-4">{{ rest.title }}</h4>
          </div>
          <div class="d-flex">
            <div
              class="d-flex flex-column align-center pa-4"
              @click="router.push(`/cabinet-admin/rest-info?rest_id=${rest._id}`)"
            >
              <v-icon icon="mdi-pencil" size="x-large" class="cursor-pointer" />
              <div class="explanation text-center">редактировать</div>
            </div>
            <div class="d-flex flex-column align-center pa-4">
              <v-icon
                icon="mdi-eye-off-outline"
                size="x-large"
                class="cursor-pointer"
                @click="initHideDialog(rest._id)"
              />
              <div class="explanation text-center">спрятать</div>
            </div>
            <div class="d-flex flex-column align-center pa-4">
              <v-icon
                icon="mdi-trash-can-outline"
                size="x-large"
                class="cursor-pointer"
                @click="initDeleteDialog(rest._id)"
              />
              <div class="explanation text-center">удалить</div>
            </div>
            <v-dialog v-model="confirmDeleteDialog" max-width="300" persistent>
              <v-card>
                <v-card-title>Удалить?</v-card-title>
                <v-card-actions>
                  <v-btn @click="confirmDeleteDialog = false">нет</v-btn>
                  <v-btn @click="deleteRest(chosenId)" color="error">да</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="confirmHideDialog" max-width="300" persistent>
              <v-card>
                <v-card-title>{{
                  rest.isHidden ? "Показать?" : "Скрыть?"
                }}</v-card-title>
                <v-card-actions>
                  <v-btn @click="confirmHideDialog = false">нет</v-btn>
                  <v-btn @click="hideRest(chosenId)" color="error">да</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </div>
        <v-divider></v-divider>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
.out-menu {
  opacity: 0.7;
}
</style>