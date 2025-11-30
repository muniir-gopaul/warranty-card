<template>
  <q-page class="flex flex-center">
    <q-form ref="mainForm" @submit.prevent="handleSubmit" class="q-pa-md">
      <!-- GENERAL SECTION -->
      <MainContainer class="no-margin">
        <div class="row flex align-center">
          <div class="col-5">
            <p class="text-h5 text-bold flex items-center text-grey-7 no-margin">
              <i class="material-icons q-mr-md">list_alt</i>Service Item Card
            </p>
          </div>

          <!-- Toolbar: Print / Create / Edit -->
          <div class="col-7 flex flex-end justify-end">
            <q-btn
              icon="print"
              color="orange-14"
              label="Print"
              class="rounded-borders q-mr-md"
              @click="handleGenerateDocx"
              outline
              :disable="!canPrint"
            />
            <q-btn
              icon="create"
              label="Create"
              color="light-blue-14"
              class="rounded-borders q-mr-md"
              size="md"
              @click="startCreateNew"
              outline
            />
            <q-btn
              icon="update"
              label="Edit Warranty Card"
              color="green"
              class="rounded-borders"
              size="md"
              @click="startEdit"
              outline
            />
          </div>
        </div>
      </MainContainer>

      <!-- Header -->
      <div v-if="formData && formData.WarrantyNo" class="row q-mt-sm">
        <div class="col-12">
          <h1 class="text-h5 q-mb-sm q-ml-sm">
            {{ formData.WarrantyNo }} - {{ formData.itemDescription }}
          </h1>
        </div>
      </div>

      <div v-else class="text-grey q-py-md flex items-center">
        <q-icon name="info" size="sm" class="q-mr-sm" />
        <p class="text-h6 no-margin">No Service Item loaded yet.</p>
      </div>

      <!-- General Information -->
      <MainContainer>
        <div class="row">
          <div class="col-12">
            <h2 class="text-h6 text-primary no-margin">General Information</h2>
            <q-separator color="grey-4" class="q-mb-md" />
          </div>
        </div>

        <div class="row q-col-gutter-lg">
          <!-- Left -->
          <div class="col-12 col-md-6">
            <!-- Item No & Serial: editable only when creating a new item -->
            <q-input
              v-model="formData.itemNumber"
              label="Item No."
              dense
              outlined
              :rules="[(val) => !!val]"
              :readonly="isFormLocked"
              class="no-padding q-mb-md"
            />

            <q-input
              v-model="formData.serialNumber"
              label="Serial No."
              dense
              outlined
              :rules="[(val) => !!val]"
              :readonly="isFormLocked"
              class="no-padding q-mb-md"
            />

            <!-- Search button (visible if update toggle ON) -->
            <div v-if="isUpdate" class="row">
              <div class="flex items-center justify-center full-width">
                <q-btn
                  color="secondary"
                  icon="search"
                  label="Search Item"
                  class="rounded-borders"
                  :disable="!formData.itemNumber || !formData.serialNumber"
                  @click="handleSearch"
                  outline
                />
                <q-separator color="grey-4" class="q-my-md full-width" />
              </div>
            </div>
            <!--
            <q-input
              v-model="formData.Description"
              dense
              outlined
              label="Description"
              :readonly="isFormLocked"
              class="q-mb-md"
            /> -->

            <q-input
              v-model="formData.itemDescription"
              dense
              outlined
              label="Item Description"
              class="q-mb-md"
              :readonly="isFormLocked"
            />

            <q-input
              v-model="formData.brand"
              dense
              outlined
              label="Brand"
              class="q-mb-md"
              :readonly="true"
            />
            <!--
            <q-input
              v-model="formData.model"
              dense
              outlined
              label="Model"
              class="q-mb-md"
              :readonly="isFormLocked"
            /> -->

            <q-select
              class="q-mb-md"
              v-model="formData.status"
              :options="statusOptions"
              emit-value
              map-options
              dense
              outlined
              label="Status"
              :readonly="isFormLocked"
            />

            <q-select
              class="q-mb-md"
              v-model="formData.active"
              :options="['Yes', 'No']"
              dense
              outlined
              label="Active"
              :readonly="isFormLocked"
            />

            <q-input
              v-model="formData.ServiceItemGroupCode"
              dense
              outlined
              label="Service Item Group Code"
              class="q-mb-md"
              :readonly="true"
            />

            <q-input
              label="Warranty Start Date"
              v-model="formData.WarrantyStartDate"
              mask="date"
              dense
              outlined
              class="q-mb-md"
              :readonly="isFormLocked"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="formData.WarrantyStartDate">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <!-- Right -->
          <div class="col-12 col-md-6">
            <q-input
              class="q-mb-md"
              v-model="formData.WarrantyOnSpareParts"
              type="number"
              dense
              outlined
              label="Warranty On Spare Parts"
              :readonly="true"
            />
            <q-input
              class="q-mb-md"
              v-model="formData.WarrantyOnLabour"
              dense
              outlined
              label="Warranty On Labour"
              :readonly="true"
            />
            <q-input
              class="q-mb-md"
              v-model="formData.WarrantyOnTransport"
              dense
              outlined
              label="Warranty On Transport"
              :readonly="true"
            />
            <q-input
              class="q-mb-md"
              v-model="formData.WarrantyOnGasThermostat"
              dense
              outlined
              label="Warranty On Gas Thermostat"
              :readonly="true"
            />
            <q-input
              class="q-mb-md"
              v-model="formData.WarrantyOnCompressor"
              dense
              outlined
              label="Warranty On Compressor"
              :readonly="true"
            />
            <q-input
              class="q-mb-md"
              v-model="formData.WarrantyOnMotor"
              dense
              outlined
              label="Warranty On Motor"
              :readonly="true"
            />

            <q-input
              class="q-mb-md"
              v-model="formData.WarrantyStartingDateParts"
              dense
              outlined
              label="Warranty Starting Date (Parts)"
              :readonly="true"
            />
            <q-input
              class="q-mb-md"
              v-model="formData.WarrantyEndingDateParts"
              mask="date"
              dense
              outlined
              label="Warranty Ending Date (Parts)"
              :readonly="true"
            />
            <!-- <q-input
              class="q-mb-md"
              v-model="formData.WarrantyPercentParts"
              dense
              outlined
              label="Warranty % (Parts)"
              :readonly="true"
            /> -->

            <q-input
              class="q-mb-md"
              v-model="formData.WarrantyStartingDateLabor"
              mask="date"
              dense
              outlined
              label="Warranty Starting Date (Labour)"
              :readonly="true"
            />
            <q-input
              class="q-mb-md"
              v-model="formData.WarrantyEndingDateLabor"
              mask="date"
              dense
              outlined
              label="Warranty Ending Date (Labour)"
              :readonly="true"
            />
            <!-- <q-input
              class="q-mb-md"
              v-model="formData.WarrantyPercentLabor"
              dense
              outlined
              label="Warranty % (Labour)"
              :readonly="true"
            /> -->
          </div>
        </div>
      </MainContainer>

      <!-- Customer Form -->
      <MainContainer>
        <div class="row">
          <div class="col-12">
            <h2 class="text-h6 text-primary no-margin">
              Customer No. {{ formData.customerNumber }}
            </h2>
          </div>
          <q-separator color="grey-4" class="full-width" />
        </div>

        <div class="row">
          <div class="col-12">
            <q-btn
              color="secondary"
              label="Create new customer"
              size="md"
              icon="person_add"
              class="q-my-md"
              outline
              @click="goToCreateCustomer"
            />
          </div>
        </div>

        <div class="row q-col-gutter-lg">
          <!-- Left Column -->
          <div class="col col-md-6">
            <q-select
              ref="customerSelect"
              v-model="formData.customerName"
              :options="customerOptions"
              option-label="label"
              option-value="value"
              emit-value
              use-input
              input-debounce="0"
              clearable
              dense
              outlined
              label="Name"
              :loading="loadingCustomers"
              @update:model-value="onCustomerSelected"
              @filter="onCustomerFilter"
              @clear="clearCustomer"
              :rules="[(val) => !!val]"
              :readonly="isFormLocked"
              class="no-padding q-mb-md"
            >
              <template v-slot:append>
                <q-btn dense flat round icon="search" @click="onSearchClick" />
              </template>
            </q-select>

            <!-- Customer Details -->
            <q-input
              label="Customer No."
              v-model="formData.customerNumber"
              dense
              outlined
              class="q-mb-md"
              readonly
            />
            <q-input
              label="Phone Number"
              v-model="formData.phoneNumber"
              type="number"
              dense
              outlined
              class="q-mb-md"
              readonly
            />

            <q-input
              label="Address"
              v-model="formData.address"
              dense
              outlined
              class="q-mb-md"
              readonly
            />
            <q-input label="City" v-model="formData.city" dense outlined class="q-mb-md" readonly />
          </div>

          <!-- Right Column -->
          <div class="col col-md-6">
            <q-input
              label="Contact"
              v-model="formData.contact"
              dense
              outlined
              class="q-mb-md"
              readonly
            />

            <q-input
              label="Sales Date"
              v-model="formData.salesDate"
              mask="date"
              dense
              outlined
              class="q-mb-md"
              :readonly="isFormLocked"
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
              label="Invoice No."
              v-model="formData.invoiceNo"
              dense
              outlined
              class="q-mb-md"
              :readonly="isFormLocked"
            />
            <q-input
              label="Sold At (Shop)"
              v-model="formData.soldAt"
              dense
              outlined
              class="q-mb-md"
              :readonly="isFormLocked"
            />
          </div>
        </div>

        <div class="row">
          <q-separator color="grey-4" class="full-width" />
          <div class="col-12 flex flex-center">
            <q-btn
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
import { reactive, ref, watch, onMounted, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import axios from 'axios'
import MainContainer from 'components/MainContainer.vue'
import { buildNavisionServiceItem } from './navisionServiceItemTemplate.js'
import { generateWarrantyDocx } from './generatedocx.js'

const $q = useQuasar()
const router = useRouter()

// ---------------------------
// Reactive state & form data
// ---------------------------
const isUpdate = ref(false) // small UI toggle used for search
const isFormLocked = ref(true) // main lock for inputs

const formData = reactive({
  WarrantyNo: '',
  Key: '',
  No: '',
  itemNumber: '',
  serialNumber: '',
  // Description: '',
  itemDescription: '',
  brand: '',
  // model: '',
  status: 'Installed',
  active: 'Yes',
  ServiceItemGroupCode: '',
  // ServiceItemComponents: '',
  WarrantyOnSpareParts: '',
  WarrantyOnLabour: '',
  WarrantyOnTransport: '',
  WarrantyOnGasThermostat: '',
  WarrantyOnCompressor: '',
  WarrantyOnMotor: '',
  WarrantyStartDate: '',
  WarrantyStartingDateParts: '',
  WarrantyEndingDateParts: '',
  // WarrantyPercentParts: '',
  WarrantyStartingDateLabor: '',
  WarrantyEndingDateLabor: '',
  // WarrantyPercentLabor: '',
  customerNumber: '',
  customerName: '',
  user: '',
  phoneNumber: '',
  purchaseAt: '',
  postCode: '',
  contact: '',
  salesDate: '',
  invoiceNo: '',
  soldAt: '',
  address: '',
  city: '',
})

// ---------------------------
// Button / UI states
// ---------------------------
const canPrint = ref(false)
const canSave = ref(false)
const canCreate = ref(false)
const canEdit = ref(false)
const canCreateCustomer = ref(false)

// ---------------------------
// Customer search state
// ---------------------------
const currentInput = ref('')
const customerOptions = ref([])
const loadingCustomers = ref(false)
const customerSelect = ref(null)

// ---------------------------
// Helpers
// ---------------------------
function isNewItem() {
  return !formData.No
}

function validateForm() {
  // you can expand rules here; for now minimal set required by you
  return !!(
    formData.itemNumber &&
    formData.serialNumber &&
    formData.customerName &&
    formData.customerNumber &&
    formData.salesDate &&
    formData.invoiceNo
  )
}

// watch form to update canSave (only when form is unlocked)
watch(
  formData,
  () => {
    canSave.value = !isFormLocked.value && validateForm()
  },
  { deep: true },
)

// ---------------------------
// status options
// ---------------------------
const statusOptions = [
  { label: '_blank_', value: '_blank_' },
  { label: 'Own_Service_Item', value: 'Own_Service_Item' },
  { label: 'Installed', value: 'Installed' },
  { label: 'Temporarily_Installed', value: 'Temporarily_Installed' },
  { label: 'Defective', value: 'Defective' },
]

// ---------------------------
// Lock / unlock / reset flows
// ---------------------------
function lockForm() {
  isFormLocked.value = true
  // after locking (i.e. after save / after fetch) these should be available
  canEdit.value = true
  canCreate.value = true
  canPrint.value = !!formData.No // print only if we have an item id (No) OR allow for drafted printing if desired
  canCreateCustomer.value = false
  canSave.value = false
}

// function unlockForm() {
//   isFormLocked.value = false
//   // while editing a new or unlocked form
//   canSave.value = validateForm()
//   canEdit.value = false
//   canCreate.value = false
//   canPrint.value = false
//   canCreateCustomer.value = false
// }

function startCreateNew() {
  // prepare UI for creating a new service item
  Object.keys(formData).forEach((k) => {
    formData[k] = ''
  })
  formData.status = 'Installed'
  formData.active = 'Yes'
  isUpdate.value = false
  isFormLocked.value = false
  canSave.value = false
  canCreate.value = false
  canEdit.value = false
  canPrint.value = false
  canCreateCustomer.value = false
}

function startEdit() {
  // Allow editing only when an item exists
  // if (!formData.No) {
  //   $q.notify({ color: 'warning', message: 'No item loaded to edit.' })
  //   return
  // }
  // unlock but we can keep itemNumber/serialNumber readonly by checks in template
  isFormLocked.value = false
  isUpdate.value = true
  canSave.value = validateForm()
  canEdit.value = false
  canCreate.value = false
  canPrint.value = false
  canCreateCustomer.value = false
}

// ---------------------------
// Persistence when navigating to create-customer and back
// ---------------------------
function goToCreateCustomer() {
  // persist current form to sessionStorage
  try {
    sessionStorage.setItem('serviceFormData', JSON.stringify(formData))
  } catch (err) {
    console.warn('Could not persist form to sessionStorage', err)
  }
  router.push('/create-customer')
}

onMounted(() => {
  // restore if user came back from create-customer
  try {
    const saved = sessionStorage.getItem('serviceFormData')
    if (saved) {
      const parsed = JSON.parse(saved)
      // merge into reactive formData
      Object.assign(formData, parsed)
      sessionStorage.removeItem('serviceFormData')
      // user returning, keep form unlocked so they can finish
      isFormLocked.value = false
      canSave.value = validateForm()
    } else {
      // initial load: lock everything and ensure create/save disabled
      isFormLocked.value = true
      canPrint.value = false
      canCreate.value = false
      canEdit.value = false
      canCreateCustomer.value = false
      canSave.value = false
    }
  } catch (err) {
    console.warn('restore failed', err)
  }
})

// ---------------------------
// API / SOAP interactions
// ---------------------------
const handleSearch = () => {
  if (formData.itemNumber && formData.serialNumber) {
    fetchItemDetails()
  } else {
    $q.notify({ color: 'warning', message: 'Please enter both Item No. and Serial No.' })
  }
}

async function fetchItemDetails() {
  if (!formData.itemNumber || !formData.serialNumber) {
    $q.notify({
      color: 'warning',
      message: 'Please enter both Item No. and Serial No.',
      position: 'top',
    })
    return
  }

  try {
    $q.loading.show({
      message: 'Fetching Service Item...',
      spinnerColor: 'white',
      backgroundColor: 'rgba(0,0,0,0.6)',
    })

    const res = await axios.get(
      `/soap/service-items?itemNo=${encodeURIComponent(formData.itemNumber)}&serialNo=${encodeURIComponent(
        formData.serialNumber,
      )}`,
    )

    const item = res.data?.data
    if (res.data?.success && item) {
      Object.assign(formData, {
        WarrantyNo: item.No || '',
        Key: item.Key || '',
        No: item.No || '',

        itemNumber: item.Item_No || '',
        serialNumber: item.Serial_No || '',
        // Description: item.Description || '',
        itemDescription: item.Item_Description || '',
        brand: item.Brand || '',
        model: item.Model || '',
        status: item.Status || 'Installed',
        active: item.Active || 'Yes',
        ServiceItemGroupCode: item.Service_Item_Group_Code || '',
        ServiceItemComponents: item.Service_Item_Components || '',

        WarrantyOnSpareParts:
          item.Warranty_on_Spareparts !== undefined ? item.Warranty_on_Spareparts.toString() : '',
        WarrantyOnLabour:
          item.Warranty_on_Labour !== undefined ? item.Warranty_on_Labour.toString() : '',
        WarrantyOnTransport:
          item.Warranty_on_Transport !== undefined ? item.Warranty_on_Transport.toString() : '',
        WarrantyOnGasThermostat:
          item.Warranty_on_Gas_Thermostat !== undefined
            ? item.Warranty_on_Gas_Thermostat.toString()
            : '',
        WarrantyOnCompressor:
          item.Warranty_on_Compressor !== undefined ? item.Warranty_on_Compressor.toString() : '',
        WarrantyOnMotor:
          item.Warranty_on_Motor !== undefined ? item.Warranty_on_Motor.toString() : '',

        WarrantyStartingDateParts: item.Warranty_Starting_Date_Parts || '',
        WarrantyEndingDateParts: item.Warranty_Ending_Date_Parts || '',
        WarrantyPercentParts: item.Warranty_Percent_Parts || '',
        WarrantyStartingDateLabor: item.Warranty_Starting_Date_Labor || '',
        WarrantyEndingDateLabor: item.Warranty_Ending_Date_Labor || '',
        WarrantyStartDate: item.Warranty_Start_Date || '',

        customerNumber: item.Customer_No || '',
        customerName: item.Name || '',
        user: item.User_Owner || '',
        phoneNumber: item.Phone_No_of_User_Owner || '',
        address: item.Address || '',
        city: item.City || '',
        purchaseAt: item.Purchased_At || '',
        // postCode: item.Post_Code || '',
        contact: item.Contact || '',
        salesDate: item.Sales_Date || '',
        invoiceNo: item.Invoice_No || '',
        soldAt: item.Sold_At_Shop || '',
      })

      $q.notify({
        color: 'positive',
        message: `Service Item ${formData.itemNumber} / ${formData.serialNumber} loaded successfully.`,
        position: 'top',
      })

      // After loading existing data, lock the form and enable available actions
      lockForm()
      canCreate.value = true
      canEdit.value = true
      canPrint.value = true
    } else {
      // No item found: keep the form unlocked so user can create new if needed
      Object.keys(formData).forEach((k) => (formData[k] = ''))
      formData.status = 'Installed'
      formData.active = 'Yes'
      $q.notify({
        color: 'warning',
        message: `Service Item not found for Item No. ${formData.itemNumber} and Serial ${formData.serialNumber}.`,
        position: 'top',
      })
      // keep unlocked for creating
      isFormLocked.value = false
      canCreate.value = true
      canCreateCustomer.value = false
    }
  } catch (err) {
    console.error('Fetch error:', err)
    $q.notify({
      color: 'negative',
      message: 'Error fetching Service Item from Navision.',
      position: 'top',
    })
  } finally {
    $q.loading.hide()
  }
}

// normalize & helpers
function normalizeFormData() {
  const NAV_STATUS_OPTIONS = [
    '_blank_',
    'Own_Service_Item',
    'Installed',
    'Temporarily_Installed',
    'Defective',
  ]
  const NAV_ACTIVE_OPTIONS = ['Yes', 'No']

  formData.status = NAV_STATUS_OPTIONS.includes(formData.status) ? formData.status : 'Installed'
  formData.active = NAV_ACTIVE_OPTIONS.includes(formData.active) ? formData.active : 'Yes'

  if (!isNewItem() && !formData.No) {
    throw new Error('Cannot update an item without No (primary key).')
  }
}

function formatDateForNav(date) {
  return date ? (date.includes('T') ? date.split('T')[0] : date) : ''
}

// Submit
async function handleSubmit() {
  // Save only if unlocked and valid
  if (isFormLocked.value) {
    $q.notify({ color: 'warning', message: 'Unlock form to make changes before saving.' })
    return
  }

  if (!formData.itemNumber || !formData.serialNumber) {
    $q.notify({
      color: 'negative',
      message: 'Item Number and Serial Number are required.',
      position: 'top',
    })
    return
  }

  try {
    normalizeFormData()

    // Format date fields
    const dateFields = [
      'salesDate',
      'WarrantyStartDate',
      'WarrantyStartingDateParts',
      'WarrantyEndingDateParts',
      'WarrantyStartingDateLabor',
      'WarrantyEndingDateLabor',
    ]
    dateFields.forEach((field) => {
      formData[field] = formatDateForNav(formData[field])
    })

    // Build Navision payload
    const serviceItemPayload = buildNavisionServiceItem(formData)
    const payload = {
      ...serviceItemPayload,
      itemNumber: formData.itemNumber,
      serialNumber: formData.serialNumber,
      isNew: isNewItem(),
      ...(isNewItem() ? {} : { Key: formData.Key }),
    }

    $q.loading.show({
      message: 'Submitting to Navision...',
      spinnerColor: 'white',
      backgroundColor: 'rgba(0,0,0,0.6)',
    })

    const res = await axios.post('/soap/service-items', payload)

    if (res.data?.success) {
      const updated = res.data.data
      if (updated?.No) formData.No = updated.No
      if (updated?.Key) formData.Key = updated.Key

      $q.notify({
        color: 'positive',
        message: `Service Item ${formData.itemNumber} / ${formData.serialNumber} saved successfully.`,
        position: 'top',
      })

      // After a successful save, lock form and enable other actions
      lockForm()
      canCreate.value = true
      canEdit.value = true
      canPrint.value = true

      // Refresh saved data if desired
      await fetchSavedData(formData.itemNumber, formData.serialNumber)
    } else {
      $q.notify({
        color: 'negative',
        message: res.data?.error || 'Failed to submit Service Item.',
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

// fetch saved data (keeps consistent with fetchItemDetails)
async function fetchSavedData(itemNumber, serialNumber) {
  try {
    const res = await axios.get(`/soap/service-items?itemNo=${itemNumber}&serialNo=${serialNumber}`)
    if (res.data?.success && res.data.data) {
      const savedData = res.data.data

      // Merge all relevant fields, same as fetchItemDetails
      Object.assign(formData, {
        WarrantyNo: savedData.No || '',
        Key: savedData.Key || '',
        No: savedData.No || '',

        itemNumber: savedData.Item_No || '',
        serialNumber: savedData.Serial_No || '',
        itemDescription: savedData.Item_Description || '',
        brand: savedData.Brand || '',
        model: savedData.Model || '',
        status: savedData.Status || 'Installed',
        active: savedData.Active || 'Yes',
        ServiceItemGroupCode: savedData.Service_Item_Group_Code || '',
        ServiceItemComponents: savedData.Service_Item_Components || '',

        WarrantyOnSpareParts:
          savedData.Warranty_on_Spareparts !== undefined
            ? savedData.Warranty_on_Spareparts.toString()
            : '',
        WarrantyOnLabour:
          savedData.Warranty_on_Labour !== undefined ? savedData.Warranty_on_Labour.toString() : '',
        WarrantyOnTransport:
          savedData.Warranty_on_Transport !== undefined
            ? savedData.Warranty_on_Transport.toString()
            : '',
        WarrantyOnGasThermostat:
          savedData.Warranty_on_Gas_Thermostat !== undefined
            ? savedData.Warranty_on_Gas_Thermostat.toString()
            : '',
        WarrantyOnCompressor:
          savedData.Warranty_on_Compressor !== undefined
            ? savedData.Warranty_on_Compressor.toString()
            : '',
        WarrantyOnMotor:
          savedData.Warranty_on_Motor !== undefined ? savedData.Warranty_on_Motor.toString() : '',

        WarrantyStartingDateParts: savedData.Warranty_Starting_Date_Parts || '',
        WarrantyEndingDateParts: savedData.Warranty_Ending_Date_Parts || '',
        WarrantyPercentParts: savedData.Warranty_Percent_Parts || '',
        WarrantyStartingDateLabor: savedData.Warranty_Starting_Date_Labor || '',
        WarrantyEndingDateLabor: savedData.Warranty_Ending_Date_Labor || '',
        WarrantyStartDate: savedData.Warranty_Start_Date || '',

        customerNumber: savedData.Customer_No || '',
        customerName: savedData.Name || '',
        user: savedData.User_Owner || '',
        phoneNumber: savedData.Phone_No_of_User_Owner || '',
        address: savedData.Address || '',
        city: savedData.City || '',
        purchaseAt: savedData.Purchased_At || '',
        // postCode: savedData.Post_Code || '',
        contact: savedData.Contact || '',
        salesDate: savedData.Sales_Date || '',
        invoiceNo: savedData.Invoice_No || '',
        soldAt: savedData.Sold_At_Shop || '',
      })
      // keep locked state after refresh
      lockForm()
      $q.notify({
        color: 'positive',
        message: `Data fetched successfully for Item No. ${itemNumber}`,
        position: 'top',
      })
    } else {
      $q.notify({
        color: 'negative',
        message: 'Failed to fetch saved data.',
        position: 'top',
      })
    }
  } catch (err) {
    console.error('Error fetching saved data:', err)
    $q.notify({
      color: 'negative',
      message: 'Error fetching saved data.',
      position: 'top',
    })
  }
}

// ---------------------------
// Customer search & selection
// ---------------------------
async function onSearchClick() {
  if (!currentInput.value) {
    $q.notify({ color: 'warning', message: 'Enter something to search', position: 'top' })
    return
  }

  loadingCustomers.value = true
  customerOptions.value = []

  try {
    const res = await axios.get(`/soap/customers?search=${encodeURIComponent(currentInput.value)}`)
    const list = res.data?.data || []

    if (!list.length) {
      // per your requirement: if nothing found, enable Create Customer and navigate
      $q.notify({
        color: 'warning',
        message: 'No customers found — redirecting to create customer.',
      })
      // persist form and go to create-customer
      try {
        sessionStorage.setItem('serviceFormData', JSON.stringify(formData))
      } catch (err) {
        console.warn('sessionStorage set failed', err)
      }
      router.push('/create-customer')
      return
    }

    customerOptions.value = list.map((c) => ({
      label: c.Name,
      value: c.No,
      raw: c,
    }))

    await nextTick()
    customerSelect.value?.showPopup()
  } catch (err) {
    console.error('Customer fetch failed:', err)
    $q.notify({ color: 'negative', message: 'Error fetching customer data', position: 'top' })
  } finally {
    loadingCustomers.value = false
  }
}

async function onCustomerSelected(selected) {
  if (!selected) return

  const customer = customerOptions.value.find((c) => c.value === selected)
  if (!customer) return

  formData.customerName = customer.label
  const customerRaw = customer.raw

  try {
    const res = await axios.get(
      `/soap/customers?search=${encodeURIComponent(customerRaw.Search_Name)}`,
    )

    if (res.data && res.data.data) {
      const detailedCustomer = res.data.data[0]
      formData.customerNumber = detailedCustomer.No || ''
      formData.address = detailedCustomer.Address || ''
      formData.city = detailedCustomer.City || ''
      // formData.postCode = detailedCustomer.Post_Code || ''
      formData.phoneNumber = detailedCustomer.Phone_No || ''
      formData.contact = detailedCustomer.ContactName || ''
      formData.purchaseAt = detailedCustomer.Purchased_At || ''
      formData.salesDate = detailedCustomer.Sales_Date || ''
      formData.invoiceNo = detailedCustomer.Invoice_No || ''
      // after picking an existing customer, enable save if form valid
      canCreateCustomer.value = false
      canSave.value = !isFormLocked.value && validateForm()
    }
  } catch (err) {
    console.error('Failed to fetch customer details:', err)
    $q.notify({ color: 'negative', message: 'Failed to fetch customer details', position: 'top' })
  }
}

function onCustomerFilter(val, update) {
  currentInput.value = val
  update(val)
}

function clearCustomer() {
  formData.customerNumber = ''
  formData.customerName = ''
  formData.address = ''
  formData.city = ''
  formData.postCode = ''
  formData.phoneNumber = ''
  formData.contact = ''
  formData.purchaseAt = ''
  formData.salesDate = ''
  formData.invoiceNo = ''
  customerOptions.value = []
  currentInput.value = ''
  canCreateCustomer.value = false
}

// ---------------------------
// DOCX generator
// ---------------------------
async function handleGenerateDocx() {
  if (!canPrint.value) {
    // safety: ensure print is allowed
    if (!canPrint.value) {
      $q.notify({ color: 'warning', message: 'Print is not available.' })
      return
    }
  }

  try {
    $q.loading.show({
      message: 'Generating document...',
      spinnerColor: 'white',
      backgroundColor: 'rgba(0,0,0,0.6)',
    })

    await generateWarrantyDocx({
      Description_ServiceItem: formData.itemDescription,
      SparepartsTxt: formData.WarrantyOnSpareParts,
      LabourTxt: formData.WarrantyOnLabour,
      TransportTxt: formData.WarrantyOnTransport,
      GasThermostatTxt: formData.WarrantyOnGasThermostat,
      CompressorTxt: formData.WarrantyOnCompressor,
      CustomerName: formData.customerName,
      Brand: formData.brand,
      Model: formData.model,
      SerialNo: formData.serialNumber,
      SoldBy: formData.soldAt,
      Location_ServiceItem: formData.purchaseAt,
      InvoiceNo: formData.invoiceNo,
      WarrantyStartDateTxt: formData.WarrantyStartDate,
      No_ServiceItem: formData.itemNumber,
      AddressTxt: formData.address,
    })

    $q.notify({ color: 'positive', message: 'Document generated.' })
  } catch (error) {
    console.error('Error generating document:', error)
    $q.notify({ color: 'negative', message: 'Error generating document', position: 'top' })
  } finally {
    $q.loading.hide()
  }
}
</script>

<style lang="css" scoped>
.q-form {
  max-width: 960px;
  width: 100%;
}
</style>
