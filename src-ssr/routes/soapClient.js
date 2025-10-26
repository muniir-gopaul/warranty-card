// routes/navisionFilter.js
import express from 'express'
import soap from 'soap'

const router = express.Router()

export async function getNavClient() {
  const NAVUSERNAME = process.env.SOAP_USERNAME
  const NAVUSERPASSWORD = process.env.SOAP_PASSWORD
  const DOMAIN = process.env.SOAP_DOMAIN || ''
  const WSDL_URL = `http://sapmobile:7047/DynamicsNAV110/WS/CRONUS%20UK%20Ltd./Page/Service_Item_Card?wsdl`

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

    return client
  } catch (err) {
    console.error('❌ Failed to create NAV SOAP client:', err)
    throw err
  }
}

/**
 * GET /service-items/:no
 * Fetch Service Item by No from Navision via SOAP
 */
router.get('/service-items/:no', async (req, res) => {
  const itemNo = req.params.no
  try {
    const client = await getNavClient()
    const params = {
      filter: [{ Field: 'No', Criteria: itemNo }],
      setSize: 1,
    }
    const [result] = await client.ReadMultipleAsync(params)
    const item = result?.ReadMultiple_Result?.Service_Item_Card?.[0]
    if (!item) {
      return res.status(404).json({ success: false, message: `Item No ${itemNo} not found.` })
    }
    res.json({ success: true, data: item }) // full object
  } catch (err) {
    console.error('❌ NAV Filter error:', err)
    res.status(500).json({ success: false, error: err.message })
  }
})

/**
 * POST /service-items
 * Fetch Service Item by No from Navision via SOAP
 */
router.post('/service-items', async (req, res) => {
  const formData = req.body

  // Mandatory validation
  if (!formData?.itemNumber || !formData?.serialNumber) {
    return res.status(400).json({
      success: false,
      error: 'Item Number and Serial Number are required.',
    })
  }

  try {
    const client = await getNavClient()

    // Build payload, including only fields allowed for update
    const payload = {
      // Include primary No only if updating
      ...(formData.No && !formData.isNew ? { No: formData.No } : {}),
      Item_No: formData.itemNumber || '',
      Description: formData.itemDescription || '',
      Brand: formData.brand || '',
      Model: formData.model || '',
      Serial_No: formData.serialNumber || '',
      Status: formData.status || 'Installed',
      Active: formData.active || 'Yes',
      // Only send Warranty Date if provided
      ...(formData.warrantyDate ? { Warranty_Starting_Date_Parts: formData.warrantyDate } : {}),
      // Only send Sales Date if provided
      ...(formData.salesDate ? { Sales_Date: formData.salesDate } : {}),
      // Customer_No is only sent on new items
      ...(formData.isNew && formData.customerNumber
        ? { Customer_No: formData.customerNumber }
        : {}),
      Name: formData.customerName || '',
      User_Owner: formData.user || '',
      Phone_No_of_User_Owner: formData.phoneNumber || '',
      Purchased_At: formData.purchaseAt || '',
      Post_Code: formData.postCode || '',
      Contact: formData.contact || '',
      Sold_At_Shop: formData.soldAt || '',
      // Include Key only for updates
      ...(formData.Key && !formData.isNew ? { Key: formData.Key } : {}),
    }

    console.log('🚀 SOAP Payload:', payload)

    let result
    if (formData.isNew) {
      // Create new Service Item
      ;[result] = await client.CreateAsync({ Service_Item_Card: payload })
    } else {
      // Update existing Service Item
      ;[result] = await client.UpdateAsync({ Service_Item_Card: payload })
    }

    res.json({ success: true, data: result })
  } catch (err) {
    console.error('❌ Navision SOAP error:', err)
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
