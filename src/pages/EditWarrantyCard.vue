<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-form ref="mainForm" @submit.prevent="handleSubmit">
      <!-- GENERAL SECTION -->
      <MainContainer>
        <div class="row">
          <div class="col-12">
            <p class="text-h6 text-primary no-margin">Search for an item</p>
            <q-separator color="grey-4" class="q-mb-md" />
          </div>
        </div>
        <div class="row q-gutter-x-lg">
          <div class="col-12 col-md-4">
            <q-input
              v-model="formData.itemNumber"
              label="Item No."
              dense
              outlined
              :rules="[(val) => !!val || 'Required']"
            />
          </div>

          <div class="col-12 col-md-4">
            <q-input
              v-model="formData.serialNumber"
              label="Serial No."
              dense
              outlined
              :rules="[(val) => !!val || 'Required']"
            />
          </div>

          <div class="col-12 col-md-3">
            <q-btn
              color="light-blue-10"
              icon="search"
              label="Search Item"
              class="rounded-borders"
              :disable="!formData.itemNumber || !formData.serialNumber"
              @click="handleSearch"
            />
          </div>
        </div>
      </MainContainer>

      <div v-if="formData && formData.itemNumber" class="row">
        <div class="col-12">
          <h1 class="text-h3 no-margin">{{ formData.WarrantyNo }} : {{ formData.Description }}</h1>
        </div>
      </div>

      <div v-else class="text-grey q-pa-md">
        <q-icon name="info" size="sm" class="q-mr-sm" />
        No Service Item loaded yet.
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
              v-model="formData.Description"
              dense
              outlined
              label="Description"
              class="q-mb-md"
            />
            <q-input
              v-model="formData.itemDescription"
              dense
              outlined
              label="Item Description"
              class="q-mb-md"
            />
            <q-input v-model="formData.brand" dense outlined label="Brand" class="q-mb-md" />
            <q-input v-model="formData.model" dense outlined label="Model" class="q-mb-md" />
            <q-select
              class="q-mb-md"
              v-model="formData.status"
              :options="statusOptions"
              emit-value
              map-options
              dense
              outlined
              label="Status"
            />
            <q-select
              class="q-mb-md"
              v-model="formData.active"
              :options="['Yes', 'No']"
              dense
              outlined
              label="Active"
            />
            <q-input
              v-model="formData.ServiceItemGroupCode"
              dense
              outlined
              label="Service Item Group Code"
              class="q-mb-md"
            />
            <q-input
              v-model="formData.ServiceItemComponents"
              dense
              outlined
              label="Service Item Components"
              class="q-mb-md"
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
            >
            </q-input>
            <q-input
              class="q-mb-md"
              v-model="formData.WarrantyOnLabour"
              dense
              outlined
              label="Warranty On Labour"
            >
            </q-input>
            <q-input
              class="q-mb-md"
              v-model="formData.WarrantyOnTransport"
              dense
              outlined
              label="Warranty On Transport"
            />

            <q-input
              class="q-mb-md"
              v-model="formData.WarrantyOnGasThermostat"
              dense
              outlined
              label="Warranty On Gas Thermostat"
            />

            <q-input
              class="q-mb-md"
              v-model="formData.WarrantyOnCompressor"
              dense
              outlined
              label="Warranty On Compressor"
            />
            <q-input
              class="q-mb-md"
              v-model="formData.WarrantyOnMotor"
              dense
              outlined
              label="Warranty On Motor"
            />

            <q-input
              class="q-mb-md"
              v-model="formData.WarrantyStartingDateParts"
              mask="date"
              dense
              outlined
              label="Warranty Starting Date (Parts)"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="formData.WarrantyStartingDateParts">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <q-input
              class="q-mb-md"
              v-model="formData.WarrantyEndingDateParts"
              mask="date"
              dense
              outlined
              label="Warranty Ending Date (Parts)"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="formData.WarrantyEndingDateParts">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <q-input
              class="q-mb-md"
              v-model="formData.WarrantyPercentParts"
              dense
              outlined
              label="Warranty % (Parts)"
            />

            <q-input
              class="q-mb-md"
              v-model="formData.WarrantyStartingDateLabour"
              mask="date"
              dense
              outlined
              label="Warranty Starting Date (Labour)"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="formData.WarrantyStartingDateLabour">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <q-input
              class="q-mb-md"
              v-model="formData.WarrantyEndingDateLabour"
              mask="date"
              dense
              outlined
              label="Warranty Ending Date (Labour)"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="formData.WarrantyEndingDateLabour">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <q-input
              class="q-mb-md"
              v-model="formData.WarrantyPercentLabour"
              dense
              outlined
              label="Warranty % (Labour)"
            />
          </div>
        </div>
      </MainContainer>

      <!-- Customer Form -->
      <MainContainer>
        <div class="row">
          <div class="col-12">
            <h2 class="text-h6 text-primary no-margin">Customer</h2>
            <q-separator color="grey-4" class="q-mb-md" />
          </div>

          <!-- <q-btn color="light-blue-10" label="Create Customer" to="/create-customer" /> -->
        </div>

        <div class="row q-col-gutter-lg">
          <div class="col col-md-6">
            <q-input
              class="q-mb-md"
              label="Customer No."
              v-model.number="formData.customerNumber"
              type="number"
              dense
              outlined
            />
            <q-input label="Name" v-model="formData.customerName" dense outlined class="q-mb-md" />
            <q-input
              class="q-mb-md"
              label="Phone Number"
              v-model="formData.phoneNumber"
              type="number"
              dense
              outlined
            />
            <q-input label="Post Code" v-model="formData.postCode" dense outlined class="q-mb-md" />
            <q-input label="Address" v-model="formData.address" dense outlined class="q-mb-md" />
            <q-input label="City" v-model="formData.city" dense outlined class="q-mb-md" />
          </div>

          <div class="col col-md-6">
            <q-input label="Contact" v-model="formData.contact" dense outlined class="q-mb-md" />
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
          <q-btn label="Save" color="light-blue-10" type="submit" />
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

function normalizeFormData() {
  const NAV_STATUS_OPTIONS = [
    '_blank_',
    'Own_Service_Item',
    'Installed',
    'Temporarily_Installed',
    'Defective',
  ]
  const NAV_ACTIVE_OPTIONS = ['Yes', 'No']

  if (!NAV_STATUS_OPTIONS.includes(formData.status)) formData.status = 'Installed'
  if (!NAV_ACTIVE_OPTIONS.includes(formData.active)) formData.active = 'Yes'

  if (!isNewItem() && !formData.No) {
    throw new Error('Cannot update an item without No (primary key).')
  }
}

function isNewItem() {
  return !formData.No
}

function formatDateForNav(date) {
  if (!date) return ''
  if (date.includes('T')) return date.split('T')[0]
  return date
}

const handleSearch = () => {
  if (formData.itemNumber && formData.serialNumber) {
    fetchItemDetails()
  }
}

async function fetchItemDetails() {
  if (!formData.itemNumber || !formData.serialNumber) {
    $q.notify({
      color: 'warning',
      message: 'Please enter both Item No. and Serial No. before fetching.',
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
      `/soap/service-items?itemNo=${encodeURIComponent(formData.itemNumber)}&serialNo=${encodeURIComponent(formData.serialNumber)}`,
    )

    const item = res.data?.data
    if (res.data?.success && item) {
      Object.assign(formData, {
        WarrantyNo: item.No || '',
        Key: item.Key || '',
        No: item.No || '',

        itemNumber: item.Item_No || '',
        serialNumber: item.Serial_No || '',
        Description: item.Description || '',
        itemDescription: item.Item_Description || '',
        brand: item.Brand || '',
        model: item.Model || '',
        status: item.Status || 'Installed',
        active: item.Active || 'Yes',
        ServiceItemGroupCode: item.Service_Item_Group_Code || '',
        ServiceItemComponents: item.Service_Item_Components || '',

        WarrantyOnSpareParts: item.Warranty_On_Spare_Parts || '',
        WarrantyOnLabour: item.Warranty_On_Labour || '',
        WarrantyOnTransport: item.Warranty_On_Transport || '',
        WarrantyOnGasThermostat: item.Warranty_On_Gas_Thermostat || '',
        WarrantyOnCompressor: item.Warranty_On_Compressor || '',
        WarrantyOnMotor: item.Warranty_On_Motor || '',
        WarrantyStartingDateParts: item.Warranty_Starting_Date_Parts || '',
        WarrantyEndingDateParts: item.Warranty_Ending_Date_Parts || '',
        WarrantyPercentParts: item.Warranty_Percent_Parts || '',
        WarrantyStartingDateLabour: item.Warranty_Starting_Date_Labour || '',
        WarrantyEndingDateLabour: item.Warranty_Ending_Date_Labour || '',
        WarrantyPercentLabour: item.Warranty_Percent_Labour || '',

        customerNumber: item.Customer_No || '',
        customerName: item.Name || '',
        user: item.User_Owner || '',
        phoneNumber: item.Phone_No_of_User_Owner || '',
        purchaseAt: item.Purchased_At || '',
        postCode: item.Post_Code || '',
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
    } else {
      Object.keys(formData).forEach((k) => (formData[k] = ''))
      formData.status = 'Installed'
      formData.active = 'Yes'
      $q.notify({
        color: 'warning',
        message: `Service Item not found for Item No. ${formData.itemNumber} and Serial ${formData.serialNumber}.`,
        position: 'top',
      })
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

    // Format all date fields
    formData.salesDate = formatDateForNav(formData.salesDate)
    formData.WarrantyStartingDateParts = formatDateForNav(formData.WarrantyStartingDateParts)
    formData.WarrantyEndingDateParts = formatDateForNav(formData.WarrantyEndingDateParts)
    formData.WarrantyStartingDateLabour = formatDateForNav(formData.WarrantyStartingDateLabour)
    formData.WarrantyEndingDateLabour = formatDateForNav(formData.WarrantyEndingDateLabour)

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
</script>

<style lang="css" scoped>
.q-form {
  max-width: 960px;
  width: 100%;
}
</style>
