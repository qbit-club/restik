<script setup lang="ts">

const emit = defineEmits(['uploadMenuItemImage'])
let menuItemImageInput = ref<{
  files: File[]
}>({
  files: []
})
function uploadImage() {
  const file = menuItemImageInput.value.files[menuItemImageInput.value.files.length - 1]
  emit('uploadMenuItemImage', file)
}
</script>
<template>
  <div>
    <input type="file" accept="image/*" ref="menuItemImageInput" id="uploadMenuItemImage" @change="uploadImage"
      style="display: none">
    <label for="uploadMenuItemImage">
      <div class="file-input-label">
        <v-icon icon="mdi-camera" size="x-large" />
        <span class="explanation text-center">фото</span>
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
  width: 130px;
  aspect-ratio: 1;
}
</style>