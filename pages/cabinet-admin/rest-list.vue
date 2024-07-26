<script lang="ts" setup>
import _ from "lodash"
import type { RestFromDb } from "../../types/rest-from-db.interface.ts"
useHead({
    title: 'Список ресторанов'
})

const restStore = useRest()
const router = useRouter()



let rests = ref<RestFromDb[] | []>()

let isShow = ref(false)
let filter = ref<string>('')

let restsWithFilter = computed(() => {
    if (filter.value == null) {
        filter.value = ''
    }
    if (filter.value.length > 2) {
        return rests.value?.filter((rest: any) =>
            rest.title.toLowerCase().includes(filter.value.toLowerCase()) ||
            rest.description.toLowerCase().includes(filter.value.toLowerCase())
        )
    } else {
        return rests.value
    }

})
let getRestList = async () => {
    let { data } = await restStore.get()
    rests.value = data.value
}
let deleteRest = async (id: string) => {
    await restStore.deleteRest(id)
    await getRestList()
}

let showSearch = () => {
    if (filter.value == '') {
        isShow.value = !isShow.value
    }
}
getRestList()

</script>

<template>
    <v-container>

        <v-row class="pt-4 pb-16">
            <v-col cols="12">
                <h3>Список ресторанов</h3>
            </v-col>
            <v-col cols="12" class="d-flex  align-center">
                <v-icon icon="mdi-magnify" class="ma-2" @click="showSearch" />
                <transition name="fade">
                    <v-text-field v-model='filter' v-if="isShow" density="compact" variant="solo" hide-details
                        single-line placeholder="поиск ресторана" clear-icon="mdi-close-circle"
                        clearable></v-text-field>
                </transition>

            </v-col>

            <v-col cols="12" v-for="rest, index in restsWithFilter" :key="index">
                <div class="d-flex justify-space-between">
                    <div class="d-flex align-center cursor-pointer" @click="router.push(`/${rest.alias}`)">
                        <div style="width: 50px">
                            <v-img :src="rest.images.logo"></v-img>
                        </div>

                        <h4 class="ma-4"> {{ rest.title }}</h4>
                    </div>
                    <div class="d-flex">
                        <div class="d-flex flex-column align-center pa-4 cursor-pointer"
                            @click="router.push(`/cabinet-admin/rest-info?rest_id=${rest._id}`)">
                            <v-icon icon="mdi-pencil" size="x-large" />
                            <div class="explanation text-center">редактировать</div>

                        </div>
                        <div class="d-flex flex-column align-center pa-4">
                            <v-icon icon="mdi-eye-off-outline" size="x-large" />
                            <div class="explanation text-center">спрятать</div>

                        </div>
                        <div class="d-flex flex-column align-center pa-4" @click="deleteRest(rest._id)">
                            <v-icon icon="mdi-trash-can-outline" size="x-large" />
                            <div class="explanation text-center">удалить</div>

                        </div>
                    </div>
                </div>
                <v-divider></v-divider>
            </v-col>

        </v-row>
    </v-container>
</template>
