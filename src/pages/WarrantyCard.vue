<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-form ref="mainForm" @submit.prevent="handleSubmit">
      <!-- GENERAL SECTION -->
      <MainContainer class="no-margin">
        <div class="row flex align-center">
          <div class="col-6">
            <p class="text-h5 text-bold flex items-center text-grey-7 no-margin">
              <i class="material-icons q-mr-md">list_alt</i>Create a new Service Item Card
            </p>
          </div>
          <div class="col-6 flex flex-end justify-end">
            <q-btn
              icon="print"
              color="deep-orange-14"
              label="Print"
              class="rounded-borders q-mr-md"
              :disable="!formData.No"
              @click="handleSubmit"
            />
            <q-btn
              icon="create"
              label="Edit Service Item"
              color="green"
              class="rounded-borders"
              size="md"
              @click="handleUpdate"
              :disable="isNewItem()"
            />
          </div>
        </div>
      </MainContainer>

      <div v-if="formData && formData.WarrantyNo" class="row">
        <div class="col-12">
          <h1 class="text-h3 no-margin">{{ formData.WarrantyNo }} {{ formData.Description }}</h1>
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
            <q-input
              v-model="formData.itemNumber"
              label="Item No."
              dense
              outlined
              :rules="[(val) => !!val]"
              :readonly="!isNewItem()"
              class="no-padding q-mb-md"
            />
            <q-input
              v-model="formData.serialNumber"
              label="Serial No."
              dense
              outlined
              :rules="[(val) => !!val]"
              :readonly="!isNewItem()"
              class="no-padding q-mb-md"
            />
            <q-btn
              color="light-blue-10"
              icon="search"
              label="Search Item"
              class="rounded-borders"
              :disable="!formData.itemNumber || !formData.serialNumber"
              @click="handleSearch"
              size="md"
            />
            <q-input
              v-model="formData.Description"
              dense
              outlined
              label="Description"
              :readonly="!isNewItem()"
              class="q-mb-md"
            />
            <q-input
              v-model="formData.itemDescription"
              dense
              outlined
              label="Item Description"
              class="q-mb-md"
              readonly
            />
            <q-input
              v-model="formData.brand"
              dense
              outlined
              label="Brand"
              class="q-mb-md"
              readonly
            />
            <q-input
              v-model="formData.model"
              dense
              outlined
              label="Model"
              class="q-mb-md"
              :readonly="!isNewItem()"
            />
            <q-select
              class="q-mb-md"
              v-model="formData.status"
              :options="statusOptions"
              emit-value
              map-options
              dense
              outlined
              label="Status"
              :readonly="!isNewItem()"
            />
            <q-select
              class="q-mb-md"
              v-model="formData.active"
              :options="['Yes', 'No']"
              dense
              outlined
              label="Active"
              :readonly="!isNewItem()"
            />
            <q-input
              v-model="formData.ServiceItemGroupCode"
              dense
              outlined
              label="Service Item Group Code"
              class="q-mb-md"
              :readonly="!isNewItem()"
            />
            <q-input
              v-model="formData.ServiceItemComponents"
              dense
              outlined
              label="Service Item Components"
              class="q-mb-md"
              :readonly="!isNewItem()"
            />
            <q-input
              v-model="formData.WarrantyStartDate"
              dense
              outlined
              label="Warranty Start Date"
              class="q-mb-md"
              :readonly="!isNewItem()"
            />
          </div>

          <!-- Right -->
          <div class="col-12 col-md-6">
            <q-input
              class="q-mb-md"
              v-model="formData.WarrantyOnSpareParts"
              dense
              outlined
              label="Warranty On Spare Parts"
              :readonly="!isNewItem()"
            />
            <q-input
              class="q-mb-md"
              v-model="formData.WarrantyOnLabour"
              dense
              outlined
              label="Warranty On Labour"
              :readonly="!isNewItem()"
            />
            <q-input
              class="q-mb-md"
              v-model="formData.WarrantyOnTransport"
              dense
              outlined
              label="Warranty On Transport"
              :readonly="!isNewItem()"
            />
            <q-input
              class="q-mb-md"
              v-model="formData.WarrantyOnGasThermostat"
              dense
              outlined
              label="Warranty On Gas Thermostat"
              :readonly="!isNewItem()"
            />
            <q-input
              class="q-mb-md"
              v-model="formData.WarrantyOnCompressor"
              dense
              outlined
              label="Warranty On Compressor"
              :readonly="!isNewItem()"
            />
            <q-input
              class="q-mb-md"
              v-model="formData.WarrantyOnMotor"
              dense
              outlined
              label="Warranty On Motor"
              :readonly="!isNewItem()"
            />

            <q-input
              class="q-mb-md"
              v-model="formData.WarrantyStartingDateParts"
              dense
              outlined
              label="Warranty Starting Date (Parts)"
              :readonly="!isNewItem()"
            />
            <q-input
              class="q-mb-md"
              v-model="formData.WarrantyEndingDateParts"
              mask="date"
              dense
              outlined
              label="Warranty Ending Date (Parts)"
              :readonly="!isNewItem()"
            />
            <q-input
              class="q-mb-md"
              v-model="formData.WarrantyPercentParts"
              dense
              outlined
              label="Warranty % (Parts)"
              :readonly="!isNewItem()"
            />

            <q-input
              class="q-mb-md"
              v-model="formData.WarrantyStartingDateLabour"
              mask="date"
              dense
              outlined
              label="Warranty Starting Date (Labour)"
              :readonly="!isNewItem()"
            />
            <q-input
              class="q-mb-md"
              v-model="formData.WarrantyEndingDateLabour"
              mask="date"
              dense
              outlined
              label="Warranty Ending Date (Labour)"
              :readonly="!isNewItem()"
            />
            <q-input
              class="q-mb-md"
              v-model="formData.WarrantyPercentLabour"
              dense
              outlined
              label="Warranty % (Labour)"
              :readonly="!isNewItem()"
            />
          </div>
        </div>
      </MainContainer>

      <!-- Customer Form -->
      <MainContainer>
        <div class="row">
          <div class="col-12">
            <h2 class="text-h6 text-primary no-margin">Customer: {{ formData.customerNumber }}</h2>
          </div>
          <q-separator color="grey-4" class="full-width" />
        </div>
        <div class="row">
          <div class="col-12 flex">
            <q-btn
              color="green"
              label="Create new customer"
              size="md"
              to="/create-customer"
              icon="person"
              class="q-my-md"
            />
          </div>
        </div>
        <div class="row q-col-gutter-lg">
          <!-- Left Column -->
          <!-- Customer select + search -->
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
              :readonly="!isNewItem()"
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
              label="Post Code"
              v-model="formData.postCode"
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
            />
            <q-input label="Sold At (Shop)" v-model="formData.soldAt" dense outlined />
          </div>
        </div>
      </MainContainer>

      <div class="row q-ma-lg">
        <div class="col-12 flex flex-center">
          <q-btn
            color="light-blue-14"
            icon="save"
            label="Save"
            class="rounded-borders"
            :disable="!formData.itemNumber"
            @click="handleSubmit"
          />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { reactive, ref, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import axios from 'axios'
import { buildNavisionServiceItem } from './navisionServiceItemTemplate.js'
import MainContainer from 'components/MainContainer.vue'

const $q = useQuasar()

// Reactive references
const currentInput = ref('')
const customerOptions = ref([])
const loadingCustomers = ref(false)
const customerSelect = ref(null) // ref to the q-select

// Form data
const formData = reactive({
  WarrantyNo: '',
  Key: '',
  No: '',
  itemNumber: '',
  serialNumber: '',
  Description: '',
  itemDescription: '',
  brand: '',
  model: '',
  status: 'Installed',
  active: 'Yes',
  ServiceItemGroupCode: '',
  ServiceItemComponents: '',
  WarrantyOnSpareParts: '',
  WarrantyOnLabour: '',
  WarrantyOnTransport: '',
  WarrantyOnGasThermostat: '',
  WarrantyOnCompressor: '',
  WarrantyOnMotor: '',
  WarrantyStartDate: '',
  WarrantyStartingDateParts: '',
  WarrantyEndingDateParts: '',
  WarrantyPercentParts: '',
  WarrantyStartingDateLabour: '',
  WarrantyEndingDateLabour: '',
  WarrantyPercentLabour: '',
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
})

// Status and active options
const statusOptions = [
  { label: '_blank_', value: '_blank_' },
  { label: 'Own_Service_Item', value: 'Own_Service_Item' },
  { label: 'Installed', value: 'Installed' },
  { label: 'Temporarily_Installed', value: 'Temporarily_Installed' },
  { label: 'Defective', value: 'Defective' },
]

function isNewItem() {
  return !formData.No
}

// Normalize form data (status and active options)
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

// Format date for Navision
function formatDateForNav(date) {
  return date ? (date.includes('T') ? date.split('T')[0] : date) : ''
}

// Submit form data to Navision
async function handleSubmit() {
  if (!formData.itemNumber) {
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
      'WarrantyStartingDateParts',
      'WarrantyEndingDateParts',
      'WarrantyStartingDateLabour',
      'WarrantyEndingDateLabour',
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

      // Reload the page or fetch the saved data again
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

// Search for customers based on input
async function onSearchClick() {
  if (!currentInput.value) {
    $q.notify({ color: 'warning', message: 'Enter something to search', position: 'top' })
    return
  }

  loadingCustomers.value = true
  customerOptions.value = []

  try {
    const res = await axios.get(`/soap/customers?search=${encodeURIComponent(currentInput.value)}`)
    customerOptions.value = (res.data.data || []).map((c) => ({
      label: c.Name,
      value: c.No,
      raw: c, // Store the entire customer object for later mapping
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

// Handle the customer selection
async function onCustomerSelected(selected) {
  console.log('Customer selected:', selected) // This will log the selected object

  if (!selected) return // If no customer is selected, do nothing

  // Access the raw customer data (from the Proxy object)
  const customer = customerOptions.value.find((c) => c.value === selected)
  if (!customer) return // If the customer is not found, do nothing

  formData.customerName = customer.label

  // Now we can safely access customer.raw to fetch the Search_Name and other details
  const customerRaw = customer.raw
  console.log('Selected Customer Data:', customerRaw) // Log raw customer data for debugging

  // Fetch the customer details using the Search_Name (customer.raw.Search_Name)
  try {
    const res = await axios.get(
      `/soap/customers?search=${encodeURIComponent(customerRaw.Search_Name)}`,
    )

    // Check if we got data
    if (res.data && res.data.data) {
      const detailedCustomer = res.data.data[0] // Assuming we're getting a single customer in the response

      // Update formData with the detailed customer information
      formData.customerNumber = detailedCustomer.No || ''
      formData.address = detailedCustomer.Address || ''
      formData.city = detailedCustomer.City || ''
      formData.postCode = detailedCustomer.Post_Code || ''
      formData.phoneNumber = detailedCustomer.Phone_No || ''
      formData.contact = detailedCustomer.ContactName || ''
      formData.purchaseAt = detailedCustomer.Purchased_At || ''
      formData.salesDate = detailedCustomer.Sales_Date || ''
      formData.invoiceNo = detailedCustomer.Invoice_No || ''
    }
  } catch (err) {
    console.error('Failed to fetch customer details:', err)
    $q.notify({ color: 'negative', message: 'Failed to fetch customer details', position: 'top' })
  }
}

// Function to fetch saved data based on Item No. and Serial No.
async function fetchSavedData(itemNumber, serialNumber) {
  try {
    const res = await axios.get(`/soap/service-items?itemNo=${itemNumber}&serialNo=${serialNumber}`)
    if (res.data?.success && res.data.data) {
      // Populate the form data with the response
      const savedData = res.data.data
      // Object.keys(savedData).forEach((key) => {
      //   if (formData.hasOwnProperty(key)) {
      //     formData[key] = savedData[key] || ''
      //   }
      // })
      console.log(savedData)

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

// Handle input change for filtering the customer search
function onCustomerFilter(val, update) {
  currentInput.value = val
  update(val) // Update the q-select with the typed text for better filtering
}

// Clear customer fields
function clearCustomer() {
  // Reset form fields related to customer
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
}
</script>

<style lang="css" scoped>
.q-form {
  max-width: 960px;
  width: 100%;
}
</style>
