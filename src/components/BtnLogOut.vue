<template>
  <q-btn flat color="primary" icon="logout" label="Logout" @click="logout" />
</template>

<script setup>
import axios from 'axios'

async function logout() {
  try {
    await axios.post('/api/logout')
  } catch (err) {
    console.error('Logout error:', err)
  } finally {
    window.location.href = '/login' // forces full page reload
  }
}
</script>
