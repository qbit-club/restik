<script setup lang="ts">
import {mdiCamera}  from '@mdi/js';
const emit = defineEmits(['uploadHeaderImage'])
let headerImageInput = ref<{
  files: File[]
}>({
  files: []
})
function uploadImage() {
  const file = headerImageInput.value.files[headerImageInput.value.files.length - 1]
  emit('uploadHeaderImage', file)
}
</script>
<template>
  <div>
    <input type="file" accept="image/*" ref="headerImageInput" id="uploadHeaderImage" @change="uploadImage" style="display: none">
    <label for="uploadHeaderImage">
      <div class="file-input-label">
        <v-icon :icon="mdiCamera" size="x-large" />
        <span class="explanation text-center">шапка <br> ресторана</span>
      </div>
    </label>
  </div>
</template>
<style scoped lang="scss">
.file-input-label {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: 1px dashed black;
  padding: 10px;
  border-radius: 5px;
  margin: 10px;
  width: 100px;
  aspect-ratio: 1;
}
</style>