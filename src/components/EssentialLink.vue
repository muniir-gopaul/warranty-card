<template>
  <q-item clickable @click="goToLink">
    <!-- Left icon -->
    <q-item-section v-if="props.icon" avatar>
      <q-icon :name="props.icon" />
    </q-item-section>

    <!-- Main content -->
    <q-item-section>
      <q-item-label>{{ props.title }}</q-item-label>
      <q-item-label caption>{{ props.caption }}</q-item-label>
    </q-item-section>

    <!-- Logout button on the right -->
    <q-item-section side>
      <q-btn flat color="primary" icon="logout" label="Logout" @click="logout" />
    </q-item-section>
  </q-item>
</template>

<script setup>
import { useRouter } from 'vue-router'
import axios from 'axios'

const props = defineProps({
  title: { type: String, required: true },
  caption: { type: String, default: '' },
  link: { type: String, default: '#' },
  icon: { type: String, default: '' },
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
