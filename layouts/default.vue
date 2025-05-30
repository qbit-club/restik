<script setup lang="ts">
import { useWindowSize } from "@vueuse/core"
import { mdiClose, mdiMenu, mdiHomeOutline, mdiAccountOutline, mdiShieldCrownOutline, mdiAccountTieOutline, mdiLogout, mdiLogin } from '@mdi/js';
const { width } = useWindowSize()

const router = useRouter()
let userStore = useAuth()

let navigationDrawer = ref<boolean>(false)

let { user } = storeToRefs(userStore)

let appStore = useApp()
await userStore.checkAuth()
await appStore.getAppState()

let isAdmin = computed(() => {
  return user?.value?.roles?.includes('admin') ?? false
})
let isManager = computed(() => {
  return user?.value?.roles?.includes('manager') ?? false
})
let isLoggedIn = computed(() => {
  if (user?.value?._id) return true
  return false
})

async function logout() {
  let res = await userStore.logout()
  if (res.status.value == "success") {
    navigationDrawer.value = false
    router.push("/")
  }
}
</script>
<template>
  <v-responsive>
    <v-app class="overflow-y-auto" style="max-height: 100vh">
      <div>
        <v-btn :icon="mdiMenu" density="comfortable" outlined color="primary" class="menu-button"
          @click="navigationDrawer = !navigationDrawer" />
      </div>

      <ClientOnly>
        <v-navigation-drawer v-model="navigationDrawer" location="top" :mobile="false" elevation="0" temporary
          class="custom-top-drawer">
          <v-container>
            <v-row class="justify-center">
              <v-col cols="12" md="6" class="d-flex justify-space-between align-center">
                <div>
                  <v-img src="../assets/images/logo.svg" width="40"></v-img>

                </div>

                <h3 style="font-family: 'Sensei', sans-serif;">Глазов-есть!</h3>


                <v-icon :icon="mdiClose" color="accent" class="cursor-pointer"
                  @click="navigationDrawer = false"></v-icon>
              </v-col>
            </v-row>
            <v-row class="justify-center">
              <v-col cols="12" md="6">
                <v-list>

                  <v-list-item :prepend-icon="mdiHomeOutline" to="/" @click="navigationDrawer = false"
                    :active="router.currentRoute.value.path == '/' ? true : false">
                    <div style="font-size: 0.8rem; font-weight: 500">Кафе/магазины</div>
                  </v-list-item>

                  <v-list-item :prepend-icon="mdiAccountOutline" to="/cabinet-user/orders"
                    @click="navigationDrawer = false">
                    <div style="font-size: 0.8rem; font-weight: 500">Мои заказы</div>
                  </v-list-item>

                  <v-list-item :prepend-icon="mdiShieldCrownOutline" to="/cabinet-admin/rest-list"
                    @click="navigationDrawer = false" v-if="isAdmin">
                    <div style="font-size: 0.8rem; font-weight: 500">Администратор</div>
                  </v-list-item>

                  <v-list-item :prepend-icon="mdiAccountTieOutline" to="/cabinet-manager/orders"
                    @click="navigationDrawer = false" v-if="isManager">
                    <div style="font-size: 0.8rem; font-weight: 500">Менеджер</div>
                  </v-list-item>

                  <v-list-item @click="logout" :prepend-icon="mdiLogout" v-if="isLoggedIn">
                    <div style="font-size: 0.8rem; font-weight: 500">Выйти</div>
                  </v-list-item>

                  <v-list-item @click="router.push('/login')" :prepend-icon="mdiLogin" v-else>
                    <div style="font-size: 0.8rem; font-weight: 500">Войти</div>
                  </v-list-item>
                  <v-list-item>
                    <div class="d-flex justify-center align-center" style="font-size: 0.8rem; font-weight: 900">Пишите в
                      телеграм <a href="https://t.me/grachevrv" target="_blank">
                        <img class="ma-2" src="~/assets/icons/telegram.svg" alt="Изображение не загрузилось"></a></div>


                  </v-list-item>


                </v-list>

              </v-col>
              <!-- <v-col cols="12" class="d-flex justify-center">
                <img src="~/assets/icons/kvak.gif" alt="">
              </v-col> -->
            </v-row>
          </v-container>
        </v-navigation-drawer>
      </ClientOnly>

      <v-main>
        <!-- pages go here -->
        <NuxtPage />
        <!-- pages go here -->
      </v-main>

      <ClientOnly>
        <v-footer class="footer d-flex justify-center flex-column">
          <div class="mb-2">
            <span class="description" @click="router.push('/about-site/description-and-restrictions')">
              Описание и ограничения
            </span>
          </div>
          <a href="https://storage.yandexcloud.net/politica/Politica%20confidetcionalnosty.pdf" target="_blank">
            <div class="mb-2 description">
              Политика конфиденциальности
            </div>
          </a>

          <a href="https://vk.com/qbitclub" target="_blank">
            <img src="../assets/images/madewithlove.png" alt="" style="max-width:100px">
          </a>
        </v-footer>
      </ClientOnly>
    </v-app>
  </v-responsive>
</template>

<style scoped lang="scss">
.description {
  font-weight: 600;
  font-size: clamp(0.8125rem, 0.7131rem + 0.2841vw, 0.9375rem);
  cursor: pointer;
}

.menu-button {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 999;
}

.logo {
  position: fixed;
  top: 25px;
  left: 25px;
  padding: 5px;
  border-radius: 50%;
  width: 50px;
  aspect-ratio: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  background: rgba(255, 255, 255, 0.7);
}

.footer {
  background: rgb(84, 185, 117);
  background: radial-gradient(circle, rgba(84, 185, 117, 1) 0%, rgba(250, 178, 50, 1) 0%, rgba(84, 185, 117, 1) 100%);
  max-height: 110px;
}
</style>
