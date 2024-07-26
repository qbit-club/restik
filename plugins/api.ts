import { toast } from 'vue3-toastify'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const $apiFetch = $fetch.create({
    baseURL: config.public.apiBase,
    credentials: 'include',
    onRequest({ request, options, error }) {

    },
    onResponse({ response }) {
      // response._data = new myBusinessResponse(response._data)
    },
    onResponseError({ response }) {
      if (response._data.message) {
        toast(response._data.message, { type: 'error' })
      }
      if (response.status === 401) {
        useState('authRedirect').value = useRoute().path
        navigateTo('/login')
      }
    }
  })

  return {
    provide: {
      apiFetch: $apiFetch
    }
  }
})