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
// SOAP Client Factory
// --------------------------
export async function getNavClient(wsdlName = 'Service_Item_Card') {
  const NAVUSERNAME = process.env.SOAP_USERNAME
  const NAVUSERPASSWORD = process.env.SOAP_PASSWORD
  const DOMAIN = process.env.SOAP_DOMAIN || ''
  const WSDL_URL = `http://192.168.1.200:7047/DynamicsNAV110/WS/FORTRESS_LIVE/Page/${wsdlName}?wsdl`
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

    // Log SOAP requests and responses
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
// Fetch Service Item by Item_No + Serial_No
// ===================================================================
router.get('/service-items', async (req, res) => {
  const { itemNo, serialNo } = req.query
  if (!itemNo || !serialNo) {
    return res.status(400).json({ success: false, error: 'Both itemNo and serialNo are required.' })
  }

  try {
    const client = await getNavClient('Service_Item_Card')

    const params = {
      filter: [
        { Field: 'Item_No', Criteria: itemNo },
        { Field: 'Serial_No', Criteria: serialNo },
      ],
      setSize: 1,
    }

    logNav('📨 NAV ReadMultiple params', params)

    const [result] = await client.ReadMultipleAsync(params)
    logNav('📬 NAV ReadMultiple result', result)

    const item = result?.ReadMultiple_Result?.Service_Item_Card?.[0]
    if (!item) {
      logNav('⚠️ No item found', { itemNo, serialNo })
      return res.status(404).json({
        success: false,
        message: `No service item found for Item_No=${itemNo} and Serial_No=${serialNo}.`,
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
// Create or Update Service Item Card
// ===================================================================
router.post('/service-items', async (req, res) => {
  const formData = req.body
  console.log('\n📨 Received Service Item form data:', formData)
  if (!formData?.itemNumber || !formData?.serialNumber)
    return res
      .status(400)
      .json({ success: false, error: 'Item Number and Serial Number are required.' })

  try {
    const client = await getNavClient('Service_Item_Card')
    const payload = { ...formData }

    // NAV does not allow updates to certain fields
    delete payload.itemNumber
    delete payload.serialNumber
    delete payload.isNew

    logNav('🚀 NAV SOAP Payload', payload)

    const [result] = formData.isNew
      ? await client.CreateAsync({ Service_Item_Card: payload })
      : await client.UpdateAsync({ Service_Item_Card: payload })

    logNav('📦 NAV SOAP Raw Response', result)

    const card =
      result?.Service_Item_Card ||
      result?.Create_Result?.Service_Item_Card ||
      result?.Update_Result?.Service_Item_Card ||
      null

    res.json({ success: true, data: card })
  } catch (err) {
    console.error('❌ NAV SOAP error:', err)
    res.status(500).json({ success: false, error: err.message })
  }
})

// ===================================================================
// GET /soap/customers?search=ABC
// Fetch Customers by Name (CustomerCard service)
// ===================================================================
router.get('/customers', async (req, res) => {
  const search = req.query.search
  if (!search) return res.json({ success: true, data: [] })

  const NAVUSERNAME = process.env.SOAP_USERNAME
  console.log('\n📨 NAV Customer Search Username:', NAVUSERNAME)
  const NAVUSERPASSWORD = process.env.SOAP_PASSWORD
  console.log('\n📨 NAV Customer Search Password:', NAVUSERPASSWORD)
  const DOMAIN = process.env.SOAP_DOMAIN || ''
  console.log('\n📨 NAV Customer Search Domain:', DOMAIN)
  const WSDL_URL = `http://192.168.1.200:7047/DynamicsNAV110/WS/FORTRESS_LIVE/Page/Customer_Card?wsdl`
  console.log('\n📨 NAV Customer Search WSDL URL:', WSDL_URL)

  try {
    const security = new soap.NTLMSecurity({
      username: NAVUSERNAME,
      password: NAVUSERPASSWORD,
      domain: DOMAIN,
      negotiate: true,
    })
    console.log('\n📨 NAV Customer Search Security Configured', security)
    const wsdl_headers = {}
    const wsdl_options = {}
    security.addHeaders(wsdl_headers)
    security.addOptions(wsdl_options)

    const client = await soap.createClientAsync(WSDL_URL, { wsdl_headers, wsdl_options })
    client.setSecurity(security)

    const params = {
      filter: [{ Field: 'Search_Name', Criteria: `*${search}*` }],
      setSize: 10,
    }

    console.log('\n📨 NAV Customer Search params:', params)

    const [result] = await client.ReadMultipleAsync(params)

    console.log('\n📬 NAV Customer Search result:', result)

    const customers =
      result?.ReadMultiple_Result?.CustomerCard || result?.ReadMultiple_Result?.Customer_Card || []

    res.json({ success: true, data: customers })
  } catch (err) {
    console.error('❌ Error fetching customers:', err)
    res.status(500).json({ success: false, error: err.message })
  }
})

//------------------------------------------------------------
// POST /soap/customers
// Create or Update Customer (from form submission)
// ------------------------------------------------------------
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
    const client = await getNavClient('CustomerCard')

    const payload = {
      Name: formData.customerName,
      Title: formData.title || '',
      ID_Number: formData.idNumber || '',
      // Trading_Name: formData.tradingName || '',  ❌ remove or rename
      // Registered_to_MRA_as: formData.registeredMraName || '',
      // Customer_Category: formData.customerCategory || '',
      Customer_Group: formData.customerGroup || '',
      Customer_Type_MRA: formData.customerType || '',
      // Blocked: formData.status || ' ',
      // Financed_By: formData.financedBy || '',
      Address: formData.address1 || '',
      Address_2: formData.address2 || '',
      Post_Code: formData.postCode || '',
      City: formData.city || '',
      Country_Region_Code: formData.country || '',
      Phone_No: formData.phoneNumber || '',
      E_Mail: formData.email || '',
      Fax_No: formData.faxNumber || '',
    }

    // 🩹 Remove No if empty — NAV will auto-generate
    if (formData.customerNumber) {
      payload.No = formData.customerNumber
    }

    logNav('🚀 NAV SOAP Create Payload', payload)

    // ✅ Always create
    const [result] = await client.CreateAsync({ CustomerCard: payload })
    logNav('📦 NAV SOAP Raw Response', result)

    const card = result?.CustomerCard || result?.Create_Result?.CustomerCard || null

    if (!card) throw new Error('NAV did not return a valid CustomerCard.')

    res.json({ success: true, data: card })
  } catch (err) {
    console.error('❌ NAV SOAP Error:', err)
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
