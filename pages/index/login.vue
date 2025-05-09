<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import { mdiEye, mdiEyeOff } from '@mdi/js';
const auth = useAuth()
let router = useRouter()

const { meta, handleSubmit, handleReset } = useForm({
  validationSchema: {
    password(value: string) {
      if (value?.length >= 6) return true
      return 'нужно 6 символов'
    },
    email(value: string) {
      if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value)) return true
      return 'неправильный формат email'
    },
  },
})

const email = useField('email')
const password = useField('password')
let show_password = ref(false)

let loading = ref(false)

const login = handleSubmit(async values => {
  loading.value = true

  let res = await auth.login(values.email, values.password)
  console.log(res);
  
  if (res.status.value == 'success') {
    router.push('/')
  }
  loading.value = false
})
</script>

<template>
  <v-container>
    <!-- <BackButton></BackButton> -->

    <v-col   cols="12" xs="12" sm="10" md="7" lg="5" 
    class="ma-auto">
   
        <div class="text-h6 font-weight-bold pa-8 text-center">Вход</div>
  
        <v-form @submit.prevent="login" class="d-flex flex-column align-center justify-center w-100">
          <v-text-field 
            label="Email"
            type="email"
            placeholder="vasya@ya.ru"
            v-model="email.value.value"
            :error-messages="email.errorMessage.value"
            variant="outlined"
            density="compact"
            class="w-100"
          />          

          <v-text-field 
            label="Пароль"
            v-model="password.value.value"
            :append-inner-icon="show_password ? mdiEye : mdiEyeOff"
            @click:append-inner="show_password = !show_password"
            :type="show_password ? 'text' : 'password'"
            :error-messages="password.errorMessage.value"
            variant="outlined"
            density="compact"
            class="w-100"
          />

          <v-btn type="submit" :disabled="!meta.valid" color="primary">Войти</v-btn>
        </v-form>
  
        <div 
          @click="router.push('/registration')" 
          :loading="loading"
          class="text-body-2 pa-2 w-100 cursor-pointer font-weight-semibold text-center"
        >
          регистрация
        </div>
        <div
          @click="router.push('/forgot-password')" 
          class="text-body-2 w-100 cursor-pointer font-weight-semibold text-center"
        >
          восстановить пароль
        </div>
   
    </v-col>
  </v-container>
</template>