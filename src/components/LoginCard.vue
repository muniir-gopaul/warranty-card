<template>
  <q-card class="q-pa-lg" style="min-width: 350px">
    <q-card-section>
      <div class="text-h6 text-center">Login</div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-form @submit.prevent="onSubmit" class="q-gutter-md">
        <q-input filled v-model="username" label="Username" dense autofocus />
        <q-input filled v-model="password" label="Password" type="password" dense />

        <div v-if="error" class="text-negative text-center q-mb-sm">{{ error }}</div>

        <div class="row justify-center">
          <q-btn label="Login" type="submit" color="primary" />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

async function onSubmit() {
  try {
    const res = await axios.post('/api/login/login', {
      username: username.value,
      password: password.value,
    })
    if (res.data.success) {
      await router.push('/landing') // protected page
    } else {
      error.value = res.data.message
    }
  } catch (err) {
    error.value = err.response?.data?.error || err.message
  }
}
</script>
