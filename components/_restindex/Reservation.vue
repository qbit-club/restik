<script setup lang="ts">
import type { RestFromDb } from '~/types/rest-from-db.interface';

defineProps<{
    rest: RestFromDb
}>()
</script>

<template>
    <div>
        <h3 class="mb-4 mt-4">
          Бронирование столиков
        </h3>
        <p>
            тут будет механизм бронирования столиков
        </p>
    </div>
</template>
<style lang="scss" scoped></style>
