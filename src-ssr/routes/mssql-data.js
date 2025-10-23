// src-ssr/routes/login.js
import { Router } from 'express'
import dotenv from 'dotenv'
import soap from 'soap'

dotenv.config()
const router = Router()

/**
 * 🔧 SOAP CONFIG
 */
const SOAP_BASE_URL =
  process.env.SOAP_BASE_URL || 'http://SAPMOBILE:7047/DynamicsNAV110/ws/CRONUS%20UK%20Ltd./Page'
const SOAP_USER = process.env.SOAP_USERNAME || 'your_nav_user'
const SOAP_PASS = process.env.SOAP_PASSWORD || 'your_nav_password'

/**
 * 🧩 Create SOAP Client (helper)
 */
async function createSoapClient(serviceName) {
  const wsdlUrl = `${SOAP_BASE_URL}/${serviceName}?wsdl`
  const client = await soap.createClientAsync(wsdlUrl, {
    wsdl_headers: {
      Authorization: 'Basic ' + Buffer.from(`${SOAP_USER}:${SOAP_PASS}`).toString('base64'),
    },
  })
  client.setSecurity(new soap.BasicAuthSecurity(SOAP_USER, SOAP_PASS))
  return client
}

router.get('/soap/customers', async (req, res) => {
  try {
    const client = await createSoapClient('CustomerCard')

    // Call ReadMultiple method from NAV SOAP Page
    const [result] = await client.ReadMultipleAsync({
      filter: [],
      setSize: 50,
    })

    const customers = result?.CustomerCard || result?.Customer_Card || result || []

    res.json({ success: true, data: customers })
  } catch (err) {
    console.error('[SOAP FETCH ERROR]', err)
    res.status(500).json({ success: false, error: err.message })
  }
})

/**
 * 🟢 SOAP TEST ENDPOINT - Service_Item_Card
 */
router.get('/soap/service-items', async (req, res) => {
  try {
    const client = await createSoapClient('Service_Item_Card')

    const [result] = await client.ReadMultipleAsync({
      filter: [],
      setSize: 50,
    })

    const items = result?.Service_Item_Card || result?.ServiceItemCard || result || []

    res.json({ success: true, data: items })
  } catch (err) {
    console.error('[SOAP SERVICE FETCH ERROR]', err)
    res.status(500).json({ success: false, error: err.message })
  }
})

/**
 * 🟢 SOAP CREATE / UPDATE Example
 */
router.post('/soap/customers', async (req, res) => {
  try {
    const client = await createSoapClient('CustomerCard')
    const { customer } = req.body

    const [result] = await client.UpdateAsync({
      CustomerCard: customer,
    })

    res.json({ success: true, data: result })
  } catch (err) {
    console.error('[SOAP UPDATE ERROR]', err)
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
