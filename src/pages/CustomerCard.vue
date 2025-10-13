<template>
  <q-page class="flex flex-center">
    <q-form ref="mainForm" @submit.prevent="handleSubmit">
      <div class="row q-gutter-lg">
        <div class="col-6">
          <!-- GENERAL SECTION -->
          <MainContainer>
            <div class="row">
              <div class="col-12">
                <h2 class="text-subtitle1 text-weight-bold">{{ title }}</h2>
              </div>
              <!-- Left -->
              <div class="col-12 col-md-6 q-pa-md">
                <q-input
                  v-model.number="formData.customerNumber"
                  type="number"
                  dense
                  outlined
                  :rules="[(val) => !!val || 'Required']"
                  label="Customer No."
                />
                <q-input
                  v-model.number="formData.customerName"
                  type="text"
                  dense
                  outlined
                  :rules="[(val) => !!val || 'Required']"
                  label="Name"
                />
                <q-input
                  v-model.number="formData.title"
                  type="text"
                  dense
                  outlined
                  :rules="[(val) => !!val || 'Required']"
                  label="Title"
                />
                <q-input
                  v-model.number="formData.IdNumber"
                  type="number"
                  dense
                  outlined
                  :rules="[(val) => !!val || 'Required']"
                  label="ID Number"
                />
                <q-input
                  v-model.number="formData.tradingName"
                  type="text"
                  dense
                  outlined
                  :rules="[(val) => !!val || 'Required']"
                  label="Trading Name"
                />
                <q-input
                  v-model.number="formData.rgisteredMraName"
                  type="text"
                  dense
                  outlined
                  :rules="[(val) => !!val || 'Required']"
                  label="Registered to MRA as"
                />
              </div>

              <!-- Right -->
              <div class="col-12 col-md-6 q-pa-md">
                <q-select
                  v-model="formData.customerCategory"
                  :options="customerCategoryOptions"
                  dense
                  outlined
                  :rules="[(val) => !!val || 'Please select an item']"
                  label="Customer Category"
                />
                <q-select
                  v-model="formData.customerGroup"
                  :options="customerGroupOptions"
                  dense
                  outlined
                  :rules="[(val) => !!val || 'Please select an item']"
                  label="Customer Group"
                />
                <q-select
                  v-model="formData.customerType"
                  :options="customerTypeOptions"
                  dense
                  outlined
                  :rules="[(val) => !!val || 'Please select an item']"
                  label="Customer Type"
                />
                <q-select
                  v-model="formData.status"
                  :options="statusOptions"
                  dense
                  outlined
                  :rules="[(val) => !!val || 'Please select an item']"
                  label="Status (Blocked)"
                />
                <q-input
                  v-model.number="formData.financedBy"
                  type="text"
                  dense
                  outlined
                  :rules="[(val) => !!val || 'Required']"
                  label="Financed By"
                />
              </div>
            </div>
          </MainContainer>
        </div>
        <div class="col-6">
          <!-- Customer Form -->
          <MainContainer>
            <div class="row">
              <div class="container-header">
                <div class="col-12">
                  <h2 class="text-subtitle1 text-weight-bold">Address & Contact</h2>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col col-md-6 q-pa-md">
                <q-input
                  label="Address 1"
                  v-model.number="formData.address1"
                  type="text"
                  dense
                  outlined
                  :rules="[(val) => !!val || 'Required']"
                />
                <q-input
                  label="Address 2"
                  v-model.number="formData.address2"
                  type="text"
                  dense
                  outlined
                  :rules="[(val) => !!val || 'Required']"
                />
                <q-input
                  label="Post Code"
                  v-model.number="formData.postCode"
                  type="number"
                  dense
                  outlined
                  :rules="[(val) => !!val || 'Required']"
                />

                <q-input
                  label="City"
                  v-model.number="formData.city"
                  type="text"
                  dense
                  outlined
                  :rules="[(val) => !!val || 'Required']"
                />
                <q-input
                  label="Country"
                  v-model.number="formData.country"
                  type="text"
                  dense
                  outlined
                  :rules="[(val) => !!val || 'Required']"
                />
              </div>

              <div class="col col-md-6 q-pa-md">
                <q-input
                  label="Phone Number"
                  v-model="formData.phoneNumber"
                  type="number"
                  dense
                  outlined
                  :rules="[(val) => !!val || 'Required']"
                />
                <q-input
                  label="Email"
                  v-model="formData.email"
                  type="email"
                  dense
                  outlined
                  :rules="[(val) => !!val || 'Required']"
                />
                <q-input
                  label="Fax Number"
                  v-model="formData.faxNumber"
                  type="number"
                  dense
                  outlined
                  :rules="[(val) => !!val || 'Required']"
                />
              </div>
            </div>
          </MainContainer>
        </div>
      </div>

      <div class="row q-ma-lg">
        <div class="col-12 flex flex-center">
          <!-- SAVE BUTTON -->
          <q-btn label="Save" color="primary" type="submit" />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import MainContainer from 'components/MainContainer.vue'
import { reactive, ref, onMounted } from 'vue'
import axios from 'axios'

defineProps({
  title: {
    type: String,
    default: 'Create customer',
  },
})

const records = ref([])

onMounted(async () => {
  try {
    const res = await axios.get('/api/itemcard')
    console.log('API response:', res.data)
    if (res.data.success) {
      records.value = res.data.data
    } else {
      console.error('API error:', res.data.error)
    }
  } catch (err) {
    console.error('Fetch error:', err)
  }
})

// Select Options
const itemOptions = ['Item-001', 'Item-002', 'Item-003']
const modelOptions = ['Model-A', 'Model-B', 'Model-C']
const statusOptions = ['Installed', 'Not installed']

const formData = reactive({
  cardNumber: '',
  itemNumber: '',
  itemDescription: '',
  serialNumber: '',
  model: '',
  status: 'Installed',
  active: 'Yes',
  warrantyDate: '',
  customerNumber: '',
  customerName: '',
  user: '',
  phoneNumber: '',
  purchaseAt: '',
  postCode: '',
  contact: '',
  salesDate: '',
  soldAt: '',
})

const mainForm = ref(null)

async function handleSubmit() {
  if (!mainForm.value) return
  const valid = await mainForm.value.validate()
  if (!valid) return

  try {
    const payload = { ...formData }
    console.log('📤 Posting JSON:', payload)
    const res = await axios.post('/api/soap-save', payload)
    console.log('✅ Save response:', res.data)
  } catch (err) {
    console.error('❌ SOAP Save error:', err)
  }
}
</script>
