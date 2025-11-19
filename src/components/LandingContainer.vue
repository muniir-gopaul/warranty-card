<template>
  <div class="landing-layout flex flex-center">
    <div class="landing-card q-pa-lg blue-grey-1">
      <!-- SERVICE ITEM CARD -->
      <q-card-section
        class="card-content flex flex-center justify-center q-pa-lg bg-grey-1 text-blue-grey-8 cursor-pointer"
        @click="goTo('/service-item')"
      >
        <div class="flex flex-center icon-service-item justify-center column text-center">
          <i class="material-icons q-mb-md">list_alt</i>
          <div class="text-h5 text-bold card-title">SERVICE ITEM CARD</div>
        </div>
      </q-card-section>

      <!-- CUSTOMER CARD -->
      <q-card-section
        class="card-content flex flex-center justify-center column q-pa-lg bg-grey-1 text-blue-grey-8 cursor-pointer"
        @click="goTo('/create-customer')"
      >
        <div class="flex flex-center icon-customer-item justify-center column text-center">
          <i class="material-icons q-mb-md">person_add</i>
          <div class="text-h5 text-bold card-title">CUSTOMER CARD</div>
        </div>
      </q-card-section>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const goTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.landing-card {
  display: flex;
  flex-direction: row;
  gap: 24px;
  max-width: 720px;
  width: 100%;
}

.material-icons {
  font-size: 96px;
  color: #455a64;
  transition: color 0.25s ease;
}

.card-title {
  color: #455a64;
  transition: color 0.25s ease;
}

.landing-layout {
  height: 100vh;
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
}

.card-content {
  border: 2px solid #ffffff;
  width: 320px;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
  border-radius: 4px;
}

/* Hover effects */
.card-content:hover {
  transform: translateY(-6px);
  box-shadow: 0 4px 10px rgba(102, 102, 102, 0.1);
}

.card-content:hover .icon-service-item .material-icons,
.card-content:hover .icon-service-item .card-title {
  color: #1976d2;
}

.card-content:hover .icon-customer-item .material-icons,
.card-content:hover .icon-customer-item .card-title {
  color: #ff7300;
}
</style>
