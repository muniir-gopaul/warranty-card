<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-form ref="mainForm" @submit.prevent="handleSubmit">
      <!-- SECTION: General Info -->
      <MainContainer>
        <div class="row q-col-gutter-md">
          <div class="col-12">
            <h2 class="text-subtitle1 text-weight-bold">{{ title }}</h2>
          </div>

          <div class="col-12 col-md-6">
            <q-input
              v-model="formData.customerNumber"
              type="number"
              outlined
              dense
              :rules="[required]"
              label="Customer No."
            />
            <q-input
              v-model="formData.customerName"
              type="text"
              outlined
              dense
              :rules="[required]"
              label="Name"
            />
            <q-input
              v-model="formData.title"
              type="text"
              outlined
              dense
              :rules="[required]"
              label="Title"
            />
            <q-input
              v-model="formData.idNumber"
              type="number"
              outlined
              dense
              :rules="[required]"
              label="ID Number"
            />
            <q-input
              v-model="formData.tradingName"
              type="text"
              outlined
              dense
              :rules="[required]"
              label="Trading Name"
            />
            <q-input
              v-model="formData.registeredMraName"
              type="text"
              outlined
              dense
              :rules="[required]"
              label="Registered to MRA as"
            />
          </div>

          <div class="col-12 col-md-6">
            <q-select
              v-model="formData.customerCategory"
              :options="customerCategoryOptions"
              outlined
              dense
              :rules="[required]"
              label="Customer Category"
            />
            <q-select
              v-model="formData.customerGroup"
              :options="customerGroupOptions"
              outlined
              dense
              :rules="[required]"
              label="Customer Group"
            />
            <q-select
              v-model="formData.customerType"
              :options="customerTypeOptions"
              outlined
              dense
              :rules="[required]"
              label="Customer Type"
            />
            <q-select
              v-model="formData.status"
              :options="statusOptions"
              outlined
              dense
              :rules="[required]"
              label="Status (Blocked)"
            />
            <q-input
              v-model="formData.financedBy"
              type="text"
              outlined
              dense
              :rules="[required]"
              label="Financed By"
            />
          </div>
        </div>
      </MainContainer>

      <!-- SECTION: Address & Contact -->
      <MainContainer>
        <h2 class="text-subtitle1 text-weight-bold q-mb-md">Address & Contact</h2>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input
              v-model="formData.address1"
              outlined
              dense
              label="Address 1"
              :rules="[required]"
            />
            <q-input
              v-model="formData.address2"
              outlined
              dense
              label="Address 2"
              :rules="[required]"
            />
            <q-input
              v-model="formData.postCode"
              type="number"
              outlined
              dense
              label="Post Code"
              :rules="[required]"
            />
            <q-input v-model="formData.city" outlined dense label="City" :rules="[required]" />
            <q-input
              v-model="formData.country"
              outlined
              dense
              label="Country"
              :rules="[required]"
            />
          </div>

          <div class="col-12 col-md-6">
            <q-input
              v-model="formData.phoneNumber"
              type="tel"
              outlined
              dense
              label="Phone Number"
              :rules="[required]"
            />
            <q-input
              v-model="formData.email"
              type="email"
              outlined
              dense
              label="Email"
              :rules="[emailRule]"
            />
            <q-input v-model="formData.faxNumber" type="text" outlined dense label="Fax Number" />
          </div>
        </div>
      </MainContainer>

      <!-- ACTION BUTTONS -->
      <div class="q-pa-md flex flex-center">
        <q-btn :loading="loading" label="Save" color="primary" type="submit" />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import MainContainer from 'components/MainContainer.vue'
import { reactive, ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import axios from 'axios'

defineProps({
  title: { type: String, default: 'Create Customer' },
})

const $q = useQuasar()
const mainForm = ref(null)
const loading = ref(false)
const records = ref([])

// Reusable validation rules
const required = (val) => !!val || 'Required'
const emailRule = (val) => !val || /.+@.+\..+/.test(val) || 'Invalid email'

// Dropdown data
const customerCategoryOptions = ref([
  { label: 'Retail', value: 'retail' },
  { label: 'Wholesale', value: 'wholesale' },
  { label: 'Corporate', value: 'corporate' },
])
const customerGroupOptions = ref([
  { label: 'Group A', value: 'A' },
  { label: 'Group B', value: 'B' },
])

const customerTypeOptions = ref([
  { label: 'Individual', value: 'individual' },
  { label: 'Company', value: 'company' },
])
const statusOptions = ['Active', 'Blocked']

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
  financedBy: '',
  address1: '',
  address2: '',
  postCode: '',
  city: '',
  country: '',
  phoneNumber: '',
  email: '',
  faxNumber: '',
})

onMounted(async () => {
  try {
    const res = await axios.get('/api/itemcard')
    if (res.data.success) {
      records.value = res.data.data
    } else {
      console.error('API error:', res.data.error)
    }
  } catch (err) {
    console.error('Fetch error:', err)
  }
})

async function handleSubmit() {
  const valid = await mainForm.value.validate()
  if (!valid) return

  loading.value = true
  try {
    const payload = { ...formData }
    const res = await axios.post('/api/soap-save', payload)
    $q.notify({ type: 'positive', message: 'Customer saved successfully!' })
    console.log('✅ Save response:', res.data)
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
</style>
