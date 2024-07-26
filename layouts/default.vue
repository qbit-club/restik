<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
const { width } = useWindowSize()

const router = useRouter()
let auth = useAuth()

let navigationDrawer = ref<boolean>(false)

const routes = [
  {
    value: '/',
    title: "Выбор ресторана",
    icon: "mdi-home-outline"
  },
  {
    value: '/cabinet-user/profile',
    title: "Пользователь",
    icon: "mdi-account-outline"
  },
  {
    value: '/cabinet-admin',
    title: "Администратор",
    icon: "mdi-account-outline"
  },
  {
    value: '/cabinet-manager',
    title: "Менеджер",
    icon: "mdi-account-outline"
  },

]

// создает timeout, после которого можно нажать на кнопку,
// без этой функции анимация открытия ломается
let canClickOnSpeedDial = ref(true)
// если не верите - закомментируйте тело функции и нажмите очень много раз
function ensureCanClick() {
  if (canClickOnSpeedDial.value == false) return
  canClickOnSpeedDial.value = false
  setTimeout(() => {
    canClickOnSpeedDial.value = true
  }, 400)
}

let appStore = useApp()
await auth.checkAuth()
await appStore.getAppState()
</script>
<template>
  <v-responsive>
    <v-app class="overflow-y-auto" style="max-height: 100dvh">
      <!-- <v-app-bar :elevation="0" class="d-none d-md-block">
        <div class="w-100 d-flex justify-space-between align-center">

          <div class="flex-grow-1 flex-shrink-0"> 
            <img src="../assets/images/logo.jpg"  alt="logo" @click="router.push('/')"/>
          </div>
          <v-icon icon="mdi-hamburger" class="ma-6" @click="navigationDrawer = !navigationDrawer" />

        </div>

      </v-app-bar> -->
      <div class="d-none d-md-block ">
        <div class="logo">
          <img src="../assets/images/logo.svg" alt="logo" @click="router.push('/')"  height="100%" />
        </div>
       
        <v-icon icon="mdi-hamburger" class="menu-button"
          @click="navigationDrawer = !navigationDrawer" />
      </div>

      <v-speed-dial transition="fade-transition" class="d-flex d-md-none">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn v-bind="canClickOnSpeedDial ? activatorProps : null"
            style="position: fixed; bottom: 40px; right:20px; z-index: 999;" icon="mdi-hamburger"
            class="d-flex d-md-none" @click="ensureCanClick"></v-btn>
        </template>

        <v-btn key="2" to="/" icon="mdi-home-outline"></v-btn>
        <v-btn key="2" to="/cabinet" icon="mdi-account-outline"></v-btn>
        <v-btn key="2" to="/cabinet-admin" icon="mdi-account-outline"></v-btn>
        <v-btn key="2" to="/cabinet-manager" icon="mdi-account-outline"></v-btn>

      </v-speed-dial>


      <ClientOnly>
        <!-- только на экранах md и больше, потому что на телефоне можно свайпнуть и navigation-drawer появится -->
        <v-navigation-drawer v-if="width > 960" :model-value="navigationDrawer" location="right" temporary persistent
          >
          

          <v-list nav>
            <v-list-item v-for="route of routes" :prepend-icon="route.icon" :to="route.value" :title="route.title"
              :value="route.value" @click="navigationDrawer=false"></v-list-item>
          </v-list>
        </v-navigation-drawer>
      </ClientOnly>

      <v-main class="main">
        <!-- pages go here -->
        <NuxtPage />
        <!-- pages go here -->
      </v-main>
    </v-app>
  </v-responsive>
</template>

<style scoped lang="scss">
.menu-button{
position: fixed;
top: 25px;
right: 25px;
}
.logo {
position: fixed;
top: 25px;
left: 25px;
padding: 5px;
border-radius: 50%;
width:50px;
aspect-ratio: 1;
display:flex;
justify-content: center;
align-items: center;

background: rgba(255, 255, 255, 0.7);
}



</style>
