<script setup lang="ts">
import { mdiStoreOutline, mdiCartCheck, mdiFoodOutline, mdiEyeOffOutline, mdiEyeOutline, mdiBowlMixOutline, mdiTuneVariant,mdiAccountPlusOutline,mdiEmailFastOutline, } from '@mdi/js';
definePageMeta({
  middleware: "is-manager",
});
useHead({
  title: 'Глазов - есть!'
})

const userStore = useAuth();
const restStore = useRest();

let managerIn = await userStore.getManagerIn();
const currentRest = ref<string>(userStore.user?.managingRest || "");

let { managingRestObject } = storeToRefs(userStore)

let hideRest = async () => {
  let res = await restStore.hideRest(managingRestObject.value._id, !managingRestObject.value.isHidden);
  if (res.status.value == 'success') {
    managingRestObject.value.isHidden = res.data.value.isHidden
  }
};

watch(currentRest, async (newVal) => {
  await userStore.chooseManagingRest(String(newVal));
  currentRest.value = userStore.user?.managingRest || "";
});
let setManagingRest = async () => {
  if (currentRest.value == "") {
    await userStore.chooseManagingRest(managerIn[0]);
    currentRest.value = userStore.user?.managingRest || "";
  }
}
setManagingRest()
</script>
<template>
  <v-container>
    <v-row>
      <v-col :cols="12">
        <h2>Кабинет менеджера</h2>
      </v-col>
      <v-col cols="12" md="6" xl="4" class="d-flex align-start">
        <v-select v-model="currentRest" :items="managerIn" item-title="title" item-value="_id" variant="outlined"
          density="compact"></v-select>
        <div>
          <v-btn size="x-large" @click="hideRest" variant="text">
            <div class="d-flex flex-column align-center">
              <v-icon :icon="managingRestObject?.isHidden ? mdiEyeOffOutline : mdiEyeOutline" size="x-large" />
              <div class="explanation text-center">
                {{ managingRestObject?.isHidden ? 'показать' : 'спрятать' }}
              </div>
            </div>
          </v-btn>
        </div>
        <div>
          <v-btn size="x-large" :to="`/${managingRestObject.alias}`" variant="text">
            <div class="d-flex flex-column align-center">
              <v-icon :icon="mdiStoreOutline" size="x-large" />
              <div class="explanation text-center">
              в магазин
              </div>
            </div>
          </v-btn>
        </div>

      </v-col>
      <v-col :cols="12" class="d-flex overflow-x-auto">
        <v-btn-toggle color="secondary" style="height: 60px" class="d-flex overflow-x-auto">
          <v-btn to="/cabinet-manager/orders" size="x-large">
            <div class="d-flex flex-column align-center">
              <v-icon :icon="mdiCartCheck" size="x-large" />
              <div class="explanation text-center">заказы</div>
            </div>
          </v-btn>

          <v-btn to="/cabinet-manager/create-meal" size="x-large">
            <div class="d-flex flex-column align-center">
              <v-icon :icon="mdiBowlMixOutline" size="x-large" />
              <div class="explanation text-center">
                создать <br />
                товар/блюдо 
              </div>
            </div>
          </v-btn>
          <v-btn to="/cabinet-manager/manage-menu" size="x-large">
            <div class="d-flex flex-column align-center">
              <v-icon :icon="mdiFoodOutline" size="x-large" />
              <div class="explanation text-center">
                управлять <br />
                витриной
              </div>
            </div>
          </v-btn>
          <v-btn to="/cabinet-manager/rest-info" size="x-large">
            <div class="d-flex flex-column align-center">
              <v-icon :icon="mdiTuneVariant" size="x-large" />
              <div class="explanation text-center">
                информация <br />
                о нас
              </div>
            </div>
          </v-btn>

          <v-btn to="/cabinet-manager/add-manager" size="x-large">
            <div class="d-flex flex-column align-center">
              <v-icon :icon="mdiAccountPlusOutline" size="x-large" />
              <div class="explanation text-center">
                добавить <br />
                менеджера
              </div>
            </div>
          </v-btn>
          <v-btn to="/cabinet-manager/manage-email-list" size="x-large">
            <div class="d-flex flex-column align-center">
              <v-icon :icon="mdiEmailFastOutline" size="x-large" />
              <div class="explanation text-center">
                email список <br />
                для уведомлений
              </div>
            </div>
          </v-btn>

        </v-btn-toggle>

      </v-col>

      <v-col :cols="12">
        <NuxtPage />
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
.tab {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
