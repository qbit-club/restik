<script setup lang="ts">
import { mdiEye, mdiEyeOff } from '@mdi/js';
import { useRouter } from 'vue-router'
import { useField, useForm } from 'vee-validate'

import _ from 'lodash'

const router = useRouter()
const auth = useAuth()
let agreement = ref(true)
const { meta, handleSubmit, handleReset, validate } = useForm<{
  name: string,
  email: string,
  password: string,
}>({
  initialValues: {
    name: '',
    email: '',
    password: '',
  },
  validationSchema: {
    name(value: string) {
      if (value?.length === 0) return 'введите фамилию, имя'
      if (value?.length < 4) return 'слишком короткое имя и фамилия'
      if (value?.length > 22) return 'слишком длинное имя и фамилия'

      return true
    },
    email(value: string) {
      if (value?.length === 0) return 'введите почту'
      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value))
        return 'неправильно ведено'

      return true
    },
    password(value: string) {
      if (value?.length === 0) return 'введите пароль'
      if (value?.length < 8) return 'минимум 8 символов'
      if (value?.length > 30) return 'слишком длинный пароль'

      return true
    },
  },
})

let name = useField<string>('name')
let email = useField<string>('email')
let password = useField<string>('password')

let show_password = ref(false)


let loading = ref(false)

const submit = handleSubmit(async values => {
  loading.value = true

  await auth.registration(values)
    .then((res: Boolean) => {
      if (res) router.push(`/`)
    })

  loading.value = false
})
</script>

<template>
  <v-container>
    <!-- <BackButton /> -->

    <v-col cols="12" xs="12" sm="10" md="7" lg="5" class="ma-auto">

      <div class="text-h6 font-weight-bold pa-8 text-center">
        Регистрация
      </div>

      <v-form class=" w-100 align-center justify-center d-flex flex-column" @submit="submit">
        <v-text-field label="Имя Фамилия" type="name" placeholder="Иван Иванов" v-model="name.value.value"
          :error-messages="name.errors.value" variant="outlined" density="compact" class="w-100" />

        <v-text-field label="Email" type="email" placeholder="vasya@ya.ru" v-model="email.value.value"
          :error-messages="email.errors.value" variant="outlined" density="compact" class="w-100" />

        <v-text-field label="Пароль" v-model="password.value.value"
          :append-inner-icon="show_password ? mdiEye : mdiEyeOff" @click:append-inner="show_password = !show_password"
          :type="show_password ? 'text' : 'password'" :error-messages="password.errorMessage.value" variant="outlined"
          density="compact" class="w-100" />
        <div class="d-flex ">
          <v-checkbox v-model="agreement" class="mr-4">

          </v-checkbox >
          <span>Я даю согласие на обработку персональных данных согласно <a
              href="https://storage.yandexcloud.net/politica/Politica%20confidetcionalnosty.pdf"
              target="_blank"><b>Правил</b></a> </span>
        </div>

        <v-btn type="submit" :disabled="!meta.valid||!agreement" :loading="loading" color="primary">
          Отправить
        </v-btn>
      </v-form>

      <div @click="router.push('/login')"
        class="text-body-2 pa-2 w-100 cursor-pointer font-weight-semibold text-center">
        вход
      </div>

    </v-col>
  </v-container>
</template>