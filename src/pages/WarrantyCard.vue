<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-form ref="mainForm" @submit.prevent="handleSubmit">
      <!-- GENERAL SECTION -->
      <MainContainer>
        <div class="row">
          <div class="col-12 flex justify-between">
            <q-btn color="secondary" label="Create Customer" to="/create-customer" />
            <q-btn color="primary" icon="print" label="Print" flat dense @click="printPage" />
          </div>
        </div>
      </MainContainer>

      <MainContainer>
        <div class="row">
          <div class="col-12">
            <h2 class="text-subtitle1 text-weight-bold">General Information</h2>
          </div>
          <!-- Left -->
          <div class="col-12 col-md-6 q-pa-md">
            <q-input
              v-model.number="formData.cardNumber"
              type="number"
              dense
              outlined
              :rules="[(val) => !!val || 'Required']"
              label="Warranty No."
            />
            <q-select
              v-model="formData.itemNumber"
              :options="itemOptions"
              dense
              outlined
              :rules="[(val) => !!val || 'Please select an item']"
              label="Item No."
            />
            <q-input
              v-model="formData.itemDescription"
              dense
              outlined
              :rules="[(val) => !!val || 'Required']"
              label="Item Description"
            />
            <q-input
              v-model="formData.serialNumber"
              dense
              outlined
              :rules="[(val) => !!val || 'Required']"
              label="Serial No."
            />
          </div>

          <!-- Right -->
          <div class="col-12 col-md-6 q-pa-md">
            <q-select
              v-model="formData.model"
              :options="modelOptions"
              dense
              outlined
              :rules="[(val) => !!val || 'Please select a model']"
              label="Model"
            />
            <q-select
              v-model="formData.status"
              :options="statusOptions"
              dense
              outlined
              :rules="[(val) => !!val || 'Please select a status']"
              label="Status"
            />
            <q-select
              v-model="formData.active"
              :options="['Yes', 'No']"
              dense
              outlined
              :rules="[(val) => !!val || 'Please select Yes or No']"
              label="Active"
            />
            <q-input
              v-model="formData.warrantyDate"
              mask="date"
              dense
              outlined
              :rules="['date']"
              label="Warranty Date"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="formData.warrantyDate">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>
      </MainContainer>

      <!-- Customer Form -->
      <MainContainer>
        <div class="row">
          <div class="container-header">
            <div class="col-12">
              <h2 class="text-subtitle1 text-weight-bold">Customer</h2>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col col-md-6 q-pa-md">
            <q-input
              label="Customer No."
              v-model.number="formData.customerNumber"
              type="number"
              dense
              outlined
              :rules="[(val) => !!val || 'Required']"
            />
            <q-input
              label="Name"
              v-model="formData.customerName"
              dense
              outlined
              :rules="[(val) => !!val || 'Required']"
            />
            <q-input
              label="User/Owner"
              v-model="formData.user"
              dense
              outlined
              :rules="[(val) => !!val || 'Required']"
            />
            <q-input
              label="Phone Number"
              v-model="formData.phoneNumber"
              type="number"
              dense
              outlined
              :rules="[(val) => !!val || 'Required']"
            />
            <q-input
              label="Purchased At"
              v-model="formData.purchaseAt"
              dense
              outlined
              :rules="[(val) => !!val || 'Required']"
            />
          </div>

          <div class="col col-md-6 q-pa-md">
            <q-input
              label="Post Code"
              v-model="formData.postCode"
              dense
              outlined
              :rules="[(val) => !!val || 'Required']"
            />
            <q-input
              label="Contact"
              v-model="formData.contact"
              dense
              outlined
              :rules="[(val) => !!val || 'Required']"
            />
            <q-input
              label="Warranty Date"
              v-model="formData.salesDate"
              mask="date"
              dense
              outlined
              :rules="['date']"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="formData.salesDate">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-input
              label="Sold At (Shop)"
              v-model="formData.soldAt"
              dense
              outlined
              :rules="[(val) => !!val || 'Required']"
            />
          </div>
        </div>
      </MainContainer>

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

const records = ref([])

onMounted(async () => {
  try {
    const res = await axios.get('/api/soap/customers')
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

  // try {
  //   const payload = { ...formData }
  //   console.log('📤 Posting JSON:', payload)
  //   const res = await axios.post('/api/soap-save', payload)
  //   console.log('✅ Save response:', res.data)
  // } catch (err) {
  //   console.error('❌ SOAP Save error:', err)
  // }
}
</script>
