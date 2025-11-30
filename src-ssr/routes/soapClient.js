// routes/navisionFilter.js
import express from 'express'
import soap from 'soap'
import util from 'util'
import http from 'http'

const router = express.Router()

// --------------------------
// Utility logging helper
// --------------------------
function logNav(label, data) {
  const timestamp = new Date().toISOString()
  console.log(`\n🧭 [${timestamp}] ${label}:`)
  console.log(util.inspect(data, { colors: true, depth: null, compact: false }))
}

// =======================================================
// ✅ NTLM SAFE HTTP AGENT (NO KEEP-ALIVE, SINGLE SOCKET)
// =======================================================
const ntlmAgent = new http.Agent({
  keepAlive: false, // ❌ NTLM breaks with keep-alive
  maxSockets: 1, // ✅ single socket required
})

// =======================================================
// ✅ NAV SOAP CLIENT CACHE (NTLM MUST BE REUSED)
// =======================================================
const navClientCache = {}

// --------------------------
// ✅ NTLM SOAP Client Factory (SAFE)
// --------------------------
export async function getNavClient(wsdlName = 'Service_Item_Card') {
  if (navClientCache[wsdlName]) {
    return navClientCache[wsdlName]
  }

  const NAVUSERNAME = process.env.SOAP_USERNAME
  const NAVUSERPASSWORD = process.env.SOAP_PASSWORD
  const DOMAIN = process.env.SOAP_DOMAIN || 'SRVNAV'

  const WSDL_URL = `http://192.168.1.200:7047/DynamicsNAV110/WS/FORTRESS_LIVE/Page/${wsdlName}?wsdl`

  try {
    const security = new soap.NTLMSecurity({
      username: NAVUSERNAME,
      password: NAVUSERPASSWORD,
      domain: DOMAIN,
    })

    const wsdl_headers = {}
    const wsdl_options = { httpAgent: ntlmAgent }

    security.addHeaders(wsdl_headers)
    security.addOptions(wsdl_options)

    const client = await soap.createClientAsync(WSDL_URL, {
      wsdl_headers,
      wsdl_options,
    })

    client.setSecurity(security)

    client.on('request', (xml) => {
      console.log('\n📤 NAV SOAP REQUEST:\n', xml)
    })

    client.on('response', (xml) => {
      console.log('\n📥 NAV SOAP RESPONSE:\n', xml)
    })

    navClientCache[wsdlName] = client

    logNav('✅ NTLM NAV SOAP Client Ready', {
      WSDL_URL,
      NAVUSERNAME,
      DOMAIN,
    })

    return client
  } catch (err) {
    console.error('❌ Failed to create NTLM NAV SOAP client:', err)
    throw err
  }
}

// ===================================================================
// GET /soap/service-items?itemNo=123&serialNo=456
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
// ===================================================================
router.post('/service-items', async (req, res) => {
  const formData = req.body
  console.log('\n📨 Received Service Item form data:', formData)

  if (!formData?.itemNumber || !formData?.serialNumber) {
    return res.status(400).json({
      success: false,
      error: 'Item Number and Serial Number are required.',
    })
  }

  try {
    const client = await getNavClient('Service_Item_Card')
    const payload = { ...formData }

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
// ✅ GET /soap/customers?search=ABC (FIXED)
// ===================================================================
router.get('/customers', async (req, res) => {
  const search = req.query.search
  if (!search) return res.json({ success: true, data: [] })

  try {
    // ✅ MUST BE Customer_Card
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
// ✅ POST /soap/customers
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

    if (formData.customerNumber) {
      payload.No = formData.customerNumber
    }

    logNav('🚀 NAV SOAP Create Payload', payload)

    const [result] = await client.CreateAsync({ Customer_Card: payload })
    logNav('📦 NAV SOAP Raw Response', result)

    const card = result?.Customer_Card || result?.Create_Result?.Customer_Card || null

    if (!card) throw new Error('NAV did not return a valid Customer Card.')

    res.json({ success: true, data: card })
  } catch (err) {
    console.error('❌ NAV SOAP Error:', err)
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
