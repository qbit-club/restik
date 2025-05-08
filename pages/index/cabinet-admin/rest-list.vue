<script lang="ts" setup>
import _, { rest } from "lodash";
import type { RestFromDb } from "../../../types/rest-from-db.interface.ts";
useHead({
  title: "Список ресторанов",
});

const restStore = useRest();
const router = useRouter();

let rests = ref<RestFromDb[] | []>();

let confirmDeleteDialog = ref<boolean>(false);
let confirmHideDialog = ref<boolean>(false);
let isShow = ref(false);
let dialogContainer = ref<any>();
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
  dialogContainer.value = id;
  confirmDeleteDialog.value = true;
};

let initHideDialog = async (rest: RestFromDb) => {
  dialogContainer.value = rest;
  confirmHideDialog.value = true;
};

let deleteRest = async (id: string) => {
  await restStore.deleteRest(id);
  await getRestList();
  confirmDeleteDialog.value = false;
};
let hideRest = async (rest: RestFromDb) => {
  let res = await restStore.hideRest(rest._id, !rest.isHidden);
  if (res.status.value == 'success') {
    await getRestList();
  }
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
    <v-row class="justify-center pb-16">
      <v-col :cols="12" :sm="10" class="pa-0">
        <h3 class="text-center">Список ресторанов</h3>

        <v-col cols="12" class="d-flex align-center">
          <v-icon icon="mdi-magnify" class="ma-2" @click="showSearch" />
          <transition name="fade">
            <v-text-field v-model="filter" v-if="isShow" density="compact" variant="solo" hide-details single-line
              placeholder="поиск ресторана" clear-icon="mdi-close-circle" clearable></v-text-field>
          </transition>
        </v-col>

        <v-col cols="12" v-for="(rest, index) in restsWithFilter" :key="index"
          :class="[rest.isHidden ? 'out-menu' : '']">
          <v-row class="d-flex justify-space-between flex-wrap">
            <v-col cols="12" md="6" class="d-flex align-center cursor-pointer" @click="router.push(`/${rest.alias}`)">
              <div style="width: 50px" v-if='rest.images?.logo'>
                <v-img :src="rest.images?.logo"></v-img>
              </div>
              <h4 class="ml-4">{{ rest.title }}</h4>
            </v-col>
            <v-col cols="12" md="6"  class="d-flex justify-center justify-md-end">
              <div class="d-flex flex-column align-center" 
                @click="router.push(`/cabinet-admin/rest-info?rest_id=${rest._id}`)">
                <v-icon icon="mdi-pencil" size="x-large" class="cursor-pointer" />
                <div class="explanation text-center">редактировать</div>
              </div>
              <div class="d-flex flex-column align-center pl-4 cursor-pointer" :class="{ 'show-hide': rest.isHidden }"
                @click="initHideDialog(rest)">
                <v-icon :icon="rest.isHidden ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" size="x-large" />
                <div class="explanation text-center">
                  {{ rest.isHidden ? "показать" : "скрыть" }}
                </div>
              </div>
              <div class="d-flex flex-column align-center pl-4 ">
                <v-icon icon="mdi-trash-can-outline" size="x-large" class="cursor-pointer"
                  @click="initDeleteDialog(rest._id)" />
                <div class="explanation text-center">удалить</div>
              </div>
              <v-dialog v-model="confirmDeleteDialog" max-width="300" persistent>
                <v-card>
                  <v-card-title>Удалить?</v-card-title>
                  <v-card-actions>
                    <v-btn @click="confirmDeleteDialog = false">нет</v-btn>
                    <v-btn @click="deleteRest(dialogContainer)" color="error">да</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="confirmHideDialog" max-width="300" persistent>
                <v-card>
                  <v-card-title>{{
        dialogContainer.isHidden ? "Показать?" : "Скрыть?"
      }}</v-card-title>
                  <v-card-actions>
                    <v-btn @click="confirmHideDialog = false">нет</v-btn>
                    <v-btn @click="hideRest(dialogContainer)" color="error">да</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
          </v-row>
          <v-divider></v-divider>
        </v-col>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
.out-menu {
  opacity: 0.7;
}

.show-hide {
  color: red;
}
</style>
