// routes/navisionFilter.js
import express from 'express'
import soap from 'soap'
import util from 'util'

const router = express.Router()

// --------------------------
// Utility logging helper
// --------------------------
function logNav(label, data) {
  const timestamp = new Date().toISOString()
  console.log(`\n🧭 [${timestamp}] ${label}:`)
  console.log(util.inspect(data, { colors: true, depth: null, compact: false }))
}

// --------------------------
// SOAP Client Factory (✅ DOMAIN FIX + SHARED)
// --------------------------
export async function getNavClient(wsdlName = 'Service_Item_Card') {
  const NAVUSERNAME = process.env.SOAP_USERNAME
  const NAVUSERPASSWORD = process.env.SOAP_PASSWORD
  const DOMAIN = process.env.SOAP_DOMAIN || ''

  // ✅ MUST MATCH YOUR WORKING CUSTOMER DOMAIN
  const BASE_URL = process.env.SOAP_BASE_URL || 'http://192.168.1.200:7047'

  const WSDL_URL = `${BASE_URL}/DynamicsNAV110/WS/FORTRESS_LIVE/Page/${wsdlName}?wsdl`

  try {
    const security = new soap.NTLMSecurity({
      username: NAVUSERNAME,
      password: NAVUSERPASSWORD,
      domain: DOMAIN,
      negotiate: true,
    })

    const wsdl_headers = {}
    const wsdl_options = {}
    security.addHeaders(wsdl_headers)
    security.addOptions(wsdl_options)

    const client = await soap.createClientAsync(WSDL_URL, { wsdl_headers, wsdl_options })
    client.setSecurity(security)

    client.on('request', (xml) => {
      console.log('\n📤 NAV SOAP REQUEST:\n', xml)
    })

    client.on('response', (xml) => {
      console.log('\n📥 NAV SOAP RESPONSE:\n', xml)
    })

    logNav('✅ NAV SOAP Client created', { WSDL_URL, NAVUSERNAME, DOMAIN })
    return client
  } catch (err) {
    console.error('❌ Failed to create NAV SOAP client:', err)
    throw err
  }
}

// ===================================================================
// GET /soap/service-items?itemNo=123&serialNo=456
// ===================================================================
router.get('/service-items', async (req, res) => {
  const { itemNo, serialNo } = req.query

  if (!itemNo || !serialNo) {
    return res.status(400).json({
      success: false,
      error: 'itemNo and serialNo are required.',
    })
  }

  try {
    const client = await getNavClient('Service_Item_Card')

    // ✅ FIELD NAME FIX
    const params = {
      filter: [
        { Field: 'No', Criteria: itemNo }, // ✅ FIXED
        { Field: 'Serial_No', Criteria: serialNo }, // ✅ OK
      ],
      setSize: 1,
    }

    logNav('📨 NAV ReadMultiple params', params)

    const [result] = await client.ReadMultipleAsync(params)
    logNav('📬 NAV ReadMultiple result', result)

    const item = result?.ReadMultiple_Result?.Service_Item_Card?.[0] || null

    if (!item) {
      return res.status(404).json({
        success: false,
        message: `No service item found for ${itemNo} / ${serialNo}`,
      })
    }

    res.json({ success: true, data: item })
  } catch (err) {
    console.error('❌ NAV Fetch error:', err)
    res.status(500).json({ success: false, error: err.message })
  }
})

// ===================================================================
// POST /soap/service-items
// Create OR Update Service Item
// ===================================================================
router.post('/service-items', async (req, res) => {
  const formData = req.body

  logNav('📨 Received Service Item form data', formData)

  if (!formData?.No || !formData?.Serial_No) {
    return res.status(400).json({
      success: false,
      error: 'No and Serial_No are required.',
    })
  }

  try {
    const client = await getNavClient('Service_Item_Card')

    const payload = { ...formData }

    // ✅ NAV DOES NOT ALLOW THIS FIELD
    delete payload.isNew

    logNav('🚀 NAV SOAP Payload', payload)

    const [result] = formData.isNew
      ? await client.CreateAsync({ Service_Item_Card: payload })
      : await client.UpdateAsync({ Service_Item_Card: payload })

    logNav('📦 NAV SOAP Raw Response', result)

    const card =
      result?.Create_Result?.Service_Item_Card || result?.Update_Result?.Service_Item_Card || null

    res.json({ success: true, data: card })
  } catch (err) {
    console.error('❌ NAV SOAP error:', err)
    res.status(500).json({ success: false, error: err.message })
  }
})

// ===================================================================
// GET /soap/customers?search=ABC
// ===================================================================
router.get('/customers', async (req, res) => {
  const search = req.query.search

  if (!search) {
    return res.json({ success: true, data: [] })
  }

  try {
    const client = await getNavClient('Customer_Card')

    const params = {
      filter: [{ Field: 'Search_Name', Criteria: `*${search}*` }],
      setSize: 10,
    }

    logNav('📨 NAV Customer Search params', params)

    const [result] = await client.ReadMultipleAsync(params)

    logNav('📬 NAV Customer Search result', result)

    const customers =
      result?.ReadMultiple_Result?.Customer_Card || result?.ReadMultiple_Result?.CustomerCard || []

    res.json({ success: true, data: customers })
  } catch (err) {
    console.error('❌ Error fetching customers:', err)
    res.status(500).json({ success: false, error: err.message })
  }
})

// ===================================================================
// POST /soap/customers
// Create OR Update Customer (✅ MULTI-SCREEN SAFE)
// ===================================================================
router.post('/customers', async (req, res) => {
  const formData = req.body
  logNav('📨 Received Customer Form Data', formData)

  if (!formData.customerName) {
    return res.status(400).json({
      success: false,
      error: 'Customer Name is required.',
    })
  }

  try {
    const client = await getNavClient('Customer_Card')

    const payload = {
      Name: formData.customerName,
      Title: formData.title || '',
      ID_Number: formData.idNumber || '',
      Customer_Group: formData.customerGroup || '',
      Customer_Type_MRA: formData.customerType || '',
      Address: formData.address1 || '',
      Address_2: formData.address2 || '',
      Post_Code: formData.postCode || '',
      City: formData.city || '',
      Country_Region_Code: formData.country || '',
      Phone_No: formData.phoneNumber || '',
      E_Mail: formData.email || '',
      Fax_No: formData.faxNumber || '',
    }

    // ✅ ATTACH No ONLY IF UPDATING
    if (formData.customerNumber) {
      payload.No = formData.customerNumber
    }

    logNav('🚀 NAV SOAP Payload', payload)

    const [result] = formData.customerNumber
      ? await client.UpdateAsync({ Customer_Card: payload })
      : await client.CreateAsync({ Customer_Card: payload })

    logNav('📦 NAV SOAP Raw Response', result)

    const card =
      result?.Create_Result?.Customer_Card ||
      result?.Update_Result?.Customer_Card ||
      result?.Customer_Card ||
      null

    if (!card) throw new Error('NAV did not return a valid Customer_Card.')

    res.json({ success: true, data: card })
  } catch (err) {
    console.error('❌ NAV SOAP Error:', err)
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
