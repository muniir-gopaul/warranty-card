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

      <!-- General Information -->
      <MainContainer>
        <div class="row">
          <div class="col-12">
            <h2 class="text-subtitle1 text-weight-bold">General Information</h2>
          </div>
          <!-- Left -->
          <div class="col-12 col-md-6 q-pa-md">
            <q-input
              v-model.number="formData.No"
              type="number"
              dense
              outlined
              label="Warranty No."
            />
            <q-input
              v-model="formData.itemNumber"
              label="Item No."
              dense
              outlined
              :rules="[(val) => !!val || 'Required']"
              @blur="fetchItemDetails"
            />
            <q-input v-model="formData.itemDescription" dense outlined label="Item Description" />
            <q-input v-model="formData.brand" dense outlined label="Brand" />
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
            <q-input v-model="formData.model" dense outlined label="Model" />
            <q-select
              v-model="formData.status"
              :options="statusOptions"
              emit-value
              map-options
              dense
              outlined
              label="Status"
            />
            <q-select
              v-model="formData.active"
              :options="['Yes', 'No']"
              dense
              outlined
              label="Active"
            />
            <q-input
              v-model="formData.warrantyDate"
              mask="date"
              dense
              outlined
              label="Warranty Start Date"
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
            />
            <q-input label="Name" v-model="formData.customerName" dense outlined />
            <q-input label="User/Owner" v-model="formData.user" dense outlined />
            <q-input
              label="Phone Number"
              v-model="formData.phoneNumber"
              type="number"
              dense
              outlined
            />
            <q-input label="Purchased At" v-model="formData.purchaseAt" dense outlined />
          </div>

          <div class="col col-md-6 q-pa-md">
            <q-input label="Post Code" v-model="formData.postCode" dense outlined />
            <q-input label="Contact" v-model="formData.contact" dense outlined />
            <q-input label="Sales Date" v-model="formData.salesDate" mask="date" dense outlined>
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
            <q-input label="Sold At (Shop)" v-model="formData.soldAt" dense outlined />
          </div>
        </div>
      </MainContainer>

      <div class="row q-ma-lg">
        <div class="col-12 flex flex-center">
          <q-btn label="Save" color="primary" type="submit" />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import MainContainer from 'components/MainContainer.vue'
import { reactive } from 'vue'
import { useQuasar } from 'quasar'
import axios from 'axios'
import { buildNavisionServiceItem } from './navisionServiceItemTemplate.js'

const $q = useQuasar()

const statusOptions = [
  { label: '_blank_', value: '_blank_' },
  { label: 'Own_Service_Item', value: 'Own_Service_Item' },
  { label: 'Installed', value: 'Installed' },
  { label: 'Temporarily_Installed', value: 'Temporarily_Installed' },
  { label: 'Defective', value: 'Defective' },
]

function normalizeFormData() {
  // Ensure NAV Option fields are valid
  const NAV_STATUS_OPTIONS = [
    '_blank_',
    'Own_Service_Item',
    'Installed',
    'Temporarily_Installed',
    'Defective',
  ]

  const NAV_ACTIVE_OPTIONS = ['Yes', 'No']

  // Set defaults if invalid
  if (!NAV_STATUS_OPTIONS.includes(formData.status)) {
    formData.status = 'Installed'
  }

  if (!NAV_ACTIVE_OPTIONS.includes(formData.active)) {
    formData.active = 'Yes'
  }

  // Ensure No is sent for updates
  if (!formData.isNew && !formData.No) {
    throw new Error('Cannot update an item without No (primary key).')
  }
}

const formData = reactive({
  No: '',
  itemNumber: '',
  itemDescription: '',
  brand: '',
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

async function fetchItemDetails() {
  if (!formData.itemNumber) return

  try {
    $q.loading.show({
      message: 'Fetching item details...',
      spinnerColor: 'white',
      backgroundColor: 'rgba(0,0,0,0.6)',
    })

    // Fetch a single Service Item from NAV
    const res = await axios.get(`/soap/service-items/${formData.itemNumber}`)
    const item = res.data?.data

    if (res.data?.success && item) {
      // Populate all form fields
      formData.No = item.No || '' // NAV primary key
      formData.Key = item.Key || '' // NAV update key
      formData.itemNumber = item.Item_No || ''
      formData.itemDescription = item.Description || ''
      formData.brand = item.Brand || ''
      formData.model = item.Model || item['Product Group Code'] || ''
      formData.serialNumber = item.Serial_No || ''
      formData.status = item.Status || 'Installed'
      formData.active = item.Active || 'Yes'
      formData.warrantyDate = item.Warranty_Starting_Date_Parts || ''
      formData.customerNumber = item.Customer_No || ''
      formData.customerName = item.Name || ''
      formData.user = item.User_Owner || ''
      formData.phoneNumber = item.Phone_No_of_User_Owner || ''
      formData.purchaseAt = item.Purchased_At || ''
      formData.postCode = item.Post_Code || ''
      formData.contact = item.Contact || ''
      formData.salesDate = item.Sales_Date || ''
      formData.soldAt = item.Sold_At_Shop || ''

      $q.notify({
        color: 'positive',
        message: `Service Item ${formData.itemNumber} loaded successfully.`,
        position: 'top',
      })
    } else {
      // Clear form for new entry
      formData.No = ''
      formData.Key = ''
      formData.itemDescription = ''
      formData.brand = ''
      formData.model = ''
      formData.serialNumber = ''
      formData.status = 'Installed'
      formData.active = 'Yes'
      formData.warrantyDate = ''
      formData.customerNumber = ''
      formData.customerName = ''
      formData.user = ''
      formData.phoneNumber = ''
      formData.purchaseAt = ''
      formData.postCode = ''
      formData.contact = ''
      formData.salesDate = ''
      formData.soldAt = ''

      $q.notify({
        color: 'warning',
        message: `Service Item ${formData.itemNumber} not found.`,
        position: 'top',
      })
    }
  } catch (err) {
    console.error('Fetch error:', err)
    $q.notify({
      color: 'negative',
      message: 'Error fetching item details.',
      position: 'top',
    })
  } finally {
    $q.loading.hide()
  }
}

/**
 * Handle form submit → Send Service Item to Navision
 */
async function handleSubmit() {
  if (!formData.itemNumber || !formData.serialNumber) {
    $q.notify({
      color: 'negative',
      message: 'Item Number and Serial Number are required.',
      position: 'top',
    })
    return
  }

  normalizeFormData() // ensures default values, dates, Status, Active, etc.
  const serviceItemPayload = buildNavisionServiceItem(formData)

  try {
    $q.loading.show({
      message: 'Submitting to Navision...',
      spinnerColor: 'white',
      backgroundColor: 'rgba(0,0,0,0.6)',
    })

    const res = await axios.post('/soap/service-items', {
      ...serviceItemPayload,
      itemNumber: formData.itemNumber,
      serialNumber: formData.serialNumber,
      isNew: !formData.No,
      ...(formData.Key && { Key: formData.Key }), // only for updates
      ...(formData.No && !formData.isNew ? { No: formData.No } : {}), // send No for update
    })

    if (res.data?.success) {
      if (!formData.No && res.data?.data?.No) {
        formData.No = res.data.data.No
      }

      $q.notify({
        color: 'positive',
        message: `Service Item ${formData.No || formData.itemNumber} submitted successfully!`,
        position: 'top',
      })
    } else {
      $q.notify({
        color: 'negative',
        message: res.data?.error || 'Failed to submit service item.',
        position: 'top',
      })
    }
  } catch (err) {
    console.error('SOAP Submit Error:', err)
    const navError = err.response?.data?.error || err.message || 'Unexpected error submitting item.'
    $q.notify({ color: 'negative', message: navError, position: 'top' })
  } finally {
    $q.loading.hide()
  }
}
</script>
