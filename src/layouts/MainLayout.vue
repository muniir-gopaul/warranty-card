<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header>
      <q-toolbar class="bg-grey-12 shadow-5">
        <q-toolbar-title>
          <q-btn
            icon="verified"
            class="text-blue-grey-8 text-weight-bold text-h5 rounded-borders text-bold"
            flat
            :label="title"
            @click="goTo('/landing')"
          />
          <!-- Welcome, {{ user }}! -->
        </q-toolbar-title>

        <slot name="header-actions" />

        <q-btn
          icon-right="logout"
          size="md"
          outline
          icon-size="12px"
          label="Logout"
          @click="logout"
          class="rounded-borders q-mr-md"
          color="deep-orange-14"
        />
      </q-toolbar>
    </q-header>

    <!-- Page Content -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Footer -->
    <q-footer class="bg-grey-8 text-white">
      <div class="text-center q-pa-sm">© {{ new Date().getFullYear() }} {{ title }}</div>
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
.q-toolbar {
  min-height: 80px;
}
</style>
