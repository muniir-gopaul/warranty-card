<template>
  <q-page class="flex flex-center">
    <q-form ref="mainForm" @submit.prevent="handleSubmit" class="q-pa-lg">
      <!-- Header -->
      <div v-if="formData.customerNumber" class="row q-mt-sm">
        <div class="col-12">
          <h1 class="text-h5 q-mb-sm q-ml-sm text-primary">
            {{ formData.customerNumber }} - {{ formData.customerName }}
          </h1>
        </div>
      </div>

      <div v-else class="text-grey q-py-md flex items-center">
        <q-icon name="info" size="sm" class="q-mr-sm" />
        <p class="text-h6 no-margin">No customer created yet.</p>
      </div>

      <!-- SECTION: Create Customer -->
      <MainContainer>
        <div class="row">
          <div class="col-12">
            <h2 class="text-h6 text-primary no-margin">Create Customer</h2>
            <q-separator color="grey-4" class="q-mb-md" />
          </div>
        </div>

        <div class="row q-col-gutter-lg">
          <!-- left -->
          <div class="col-12 col-md-6">
            <q-input
              v-model="formData.customerNumber"
              type="text"
              outlined
              dense
              label="Customer No."
            />
            <q-input
              v-model="formData.customerName"
              type="text"
              outlined
              dense
              :rules="[required]"
              label="Name"
              class="q-my-md"
            />
            <q-input v-model="formData.title" type="text" outlined dense label="Title" />
            <q-input
              v-model="formData.idNumber"
              type="text"
              outlined
              dense
              label="ID Number"
              class="q-my-md"
            />
            <q-input
              v-model="formData.tradingName"
              type="text"
              outlined
              dense
              label="Trading Name"
              class="q-my-md"
            />
          </div>

          <!-- right -->
          <div class="col-12 col-md-6">
            <q-select
              v-model="formData.customerGroup"
              :options="customerGroupOptions"
              outlined
              dense
              :rules="[required]"
              label="Customer Group"
              emit-value
              map-options
            />
            <q-select
              v-model="formData.customerType"
              :options="customerTypeOptions"
              outlined
              dense
              :rules="[required]"
              label="Customer Type"
              emit-value
              map-options
            />

            <q-input
              v-model="formData.MRAType"
              type="text"
              outlined
              dense
              label="Customer Type for MRA"
              class="q-my-md"
            />
          </div>
        </div>
      </MainContainer>

      <!-- SECTION: Address & Contact -->
      <MainContainer>
        <div class="row">
          <div class="col-12">
            <h2 class="text-h6 text-primary no-margin">Address & Contact</h2>
            <q-separator color="grey-4" class="q-mb-md" />
          </div>
        </div>

        <div class="row q-col-gutter-lg">
          <!-- Left Column -->
          <div class="col-12 col-md-6">
            <q-input
              v-model="formData.address1"
              outlined
              dense
              label="Address 1"
              :rules="[required]"
              class="q-my-md"
            />
            <q-input v-model="formData.address2" outlined dense label="Address 2" class="q-my-md" />
            <q-input
              v-model="formData.postCode"
              type="text"
              outlined
              dense
              label="Post Code"
              class="q-my-md"
            />
            <q-input
              v-model="formData.city"
              outlined
              dense
              label="City"
              :rules="[required]"
              class="q-my-md"
            />
            <q-input v-model="formData.country" outlined dense label="Country" class="q-my-md" />
          </div>

          <!-- Right Column -->
          <div class="col-12 col-md-6">
            <q-input
              v-model="formData.phoneNumber"
              type="tel"
              outlined
              dense
              label="Phone Number"
              class="q-my-md"
            />
            <q-input
              v-model="formData.email"
              type="email"
              outlined
              dense
              label="Email"
              :rules="[emailRule]"
              class="q-my-md"
            />
            <q-input
              v-model="formData.faxNumber"
              type="text"
              outlined
              dense
              label="Fax Number"
              class="q-my-md"
            />
          </div>
        </div>

        <!-- ACTION BUTTONS -->
        <div class="row">
          <q-separator color="grey-4" class="full-width" />
          <div class="col-12 flex flex-center">
            <q-btn
              :loading="loading"
              icon="cloud_upload"
              color="light-blue-14"
              label="Submit"
              class="rounded-borders q-mt-md"
              @click="handleSubmit"
              outline
              :disable="!canSave"
            />
          </div>
        </div>
      </MainContainer>
    </q-form>
  </q-page>
</template>

<script setup>
import MainContainer from 'components/MainContainer.vue'
import { reactive, ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import axios from 'axios'

const $q = useQuasar()
const mainForm = ref(null)
const loading = ref(false)

// Validation
const required = (val) => !!val || 'Required'
const emailRule = (val) => !val || /.+@.+\..+/.test(val) || 'Invalid email'

// Dropdown data
// const customerCategoryOptions = ref([{ label: 'STANDARD', value: '0' }])
const customerGroupOptions = ref([{ label: 'Customer', value: '_CUSTOMER' }])
const customerTypeOptions = ref([
  { label: 'B2B', value: 'B2B' },
  { label: 'B2C', value: 'B2C' },
])
// const statusOptions = ref([{ label: 'Active', value: 'Active' }])

// Form model
const formData = reactive({
  customerNumber: '',
  customerName: '',
  title: '',
  idNumber: '',
  tradingName: '',
  registeredMraName: '',
  customerCategory: '',
  customerGroup: '',
  customerType: '',
  status: '',
  MRAType: '',
  address1: '',
  address2: '',
  postCode: '',
  city: '',
  country: '',
  phoneNumber: '',
  email: '',
  faxNumber: '',
})

const canSave = computed(
  () => !!formData.customerName && !!formData.customerCategory && !!formData.customerGroup,
)

async function handleSubmit() {
  const valid = await mainForm.value.validate()
  if (!valid) return

  loading.value = true
  try {
    const res = await axios.post('/soap/customers', formData)

    if (res.data.success) {
      const customer = res.data.data

      // ✅ Fill back NAV data (auto number, defaults, etc.)
      formData.customerNumber = customer.No || formData.customerNumber
      formData.customerName = customer.Name || formData.customerName
      formData.city = customer.City || formData.city
      formData.country = customer.Country_Region_Code || formData.country
      formData.email = customer.E_Mail || formData.email

      $q.notify({ type: 'positive', message: 'Customer saved successfully!' })
      console.log('✅ NAV Create Result:', customer)
    } else {
      $q.notify({ type: 'negative', message: 'Save failed: ' + res.data.error })
      console.error('❌ API error:', res.data.error)
    }
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Save failed. Check console.' })
    console.error('❌ SOAP Save error:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.full-width {
  width: 100%;
  max-width: 1440px;
  margin: auto;
}
.q-form {
  max-width: 960px;
  width: 100%;
}
</style>
