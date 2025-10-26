<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          {{ title }}
          <!-- Welcome, {{ user }}! -->
        </q-toolbar-title>

        <slot name="header-actions" />

        <q-btn flat icon="logout" label="Logout" @click="logout" />
      </q-toolbar>
    </q-header>

    <!-- Page Content -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Footer -->
    <q-footer class="bg-grey-8 text-white">
      <div class="text-center q-pa-sm">© {{ new Date().getFullYear() }} MyApp</div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import axios from 'axios'
defineProps({
  title: {
    type: String,
    default: 'Warranty Card Management',
  },
  user: {
    type: String,
    default: () => {
      if (typeof window !== 'undefined') {
        const u = localStorage.getItem('user')
        return u ? JSON.parse(u).name : ''
      }
      return ''
    },
  },
})

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
<style scoped>
.q-page {
  padding-top: 80px;
  min-height: calc(100vh - 100px);
}
</style>
