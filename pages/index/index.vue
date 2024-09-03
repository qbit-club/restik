<script lang="ts" setup>

useHead({
    title: 'Глазов - есть!'
})
const restStore = useRest()
const appState = useApp()
const router = useRouter()



let rests = ref()
let loading = ref(true)
let isShow = ref(false)
let filter = ref<string>('')

async function getRests() {
    let { data } = await restStore.get()
    rests.value = data.value
    // loading.value = false
}

let restsWithFilter = computed(() => {
    if (filter.value == null) {
        filter.value = ''
        appState.restFilter  = ''
    }
    if (filter.value.length > 2) {
        appState.restFilter  = filter.value
        return rests.value?.filter((rest: any) =>
            rest.title.toLowerCase().includes(filter.value.toLowerCase()) ||
            rest.description.toLowerCase().includes(filter.value.toLowerCase()) ||
            rest.type.toLowerCase().includes(filter.value.toLowerCase())
        )
    } else {

        return rests.value
    }

})



onMounted(() => {
    // Для появления картинок вместе, а не друг за другом
    let imagePromises: Promise<void>[] = [];

    document.querySelectorAll('img').forEach((img) => {
        let imgPromise = new Promise<void>((resolve) => {
            if (img.complete) {
                resolve();
            } else {
                img.onload = () => resolve();
                img.onerror = () => resolve();
            }
        });
        imagePromises.push(imgPromise);
    });

    Promise.all(imagePromises).then(() => {
        loading.value = false;
    });

    
});
 appState.restFilter? filter.value = appState.restFilter: ''
getRests()
</script>

<template>

    <v-col cols="12" class="d-flex align-center justify-center">
        <ClientOnly>
            <v-text-field v-model='filter' prepend-inner-icon="mdi-magnify" density="compact" max-width="300px"
                variant="solo" hide-details single-line placeholder="найти" clear-icon="mdi-close-circle"
                clearable></v-text-field>
        </ClientOnly>
        <!-- <v-icon icon="mdi-magnify" class="ma-2" @click="showSearch" /> -->
    </v-col>
    <v-col cols="12" class="loading" v-if="loading">
        <img src="../../assets/icons/kvak.gif" alt="">
    </v-col>
    <v-col v-else cols="6" md="4" lg="3" v-for="rest, index in restsWithFilter" :key="index">
        <NuxtLink :to="`/${rest?.alias}`">
        
            <div class="h-100 d-flex flex-column justify-space-between">
                <p v-if="rest.type" class="text-center p-clamp font-weight-light">{{ rest.type.toLowerCase() }}</p>
                <v-divider v-if="rest.type" width="50%" style="margin-left: auto; margin-right: auto;"></v-divider>
            
                <h3 class="text-center h3-clamp">{{ rest.title }}</h3>
                <v-img :src="rest.images?.logo" class="w-100 rounded-lg" aspect-ratio="1"  cover></v-img>
                <div class="d-flex justify-center">
                    <v-rating v-model="rest.rating" color="yellow-accent-4" size="12" style="font-size:10px;"
                        half-increments :readonly="true" v-if="rest.rating"></v-rating>
                </div>
            </div>
        </NuxtLink>
    </v-col>
</template>
<style scoped>
.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translateY(150px);
}

.rating {
    line-height: 1;
    font-size: 14px;
}
</style>
