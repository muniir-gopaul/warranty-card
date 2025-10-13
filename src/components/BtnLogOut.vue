<template>
  <q-btn flat color="primary" icon="logout" label="Logout" @click="logout" />
</template>

<script setup>
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

async function logout() {
  try {
    await axios.post('/api/login/logout')
  } catch (err) {
    console.error('Logout error:', err)
  } finally {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
    }
    router.push('/login')
  }
}
</script>
