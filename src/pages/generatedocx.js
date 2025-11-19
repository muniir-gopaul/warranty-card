import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import axios from 'axios'

export async function generateWarrantyDocx(data) {
  const response = await axios.get('/assets/warranty-template.docx', {
    responseType: 'arraybuffer',
  })

  const zip = new PizZip(response.data)
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true })
  doc.setData(data)

  try {
    doc.render()
  } catch (error) {
    console.error('Docxtemplater error:', error)
    throw error
  }
  console.log(data)

  const blob = doc.getZip().generate({ type: 'blob' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `Warranty_${data.InvoiceNo || 'Document'}.docx`

  link.click()
}
