// navisionServiceItemTemplate.js

/**
 * Template for sending Service Item to Navision via SOAP
 * Replace the values from your reactive form `formData` before sending
 */

export function buildNavisionServiceItem(formData) {
  return {
    No: formData.No || '', // Required
    Item_No: formData.itemNumber || '', // Required
    Description: formData.itemDescription || '',
    Brand: formData.brand || '',
    Serial_No: formData.serialNumber || '', // Required
    Warranty_Date: formatDate(formData.warrantyDate), // Format: YYYY-MM-DD
    Customer_No: formData.customerNumber || '',
    Customer_Name: formData.customerName || '',
    User: formData.user || '',
    Phone_No: formData.phoneNumber || '',
    Purchase_At: formData.purchaseAt || '',
    Post_Code: formData.postCode || '',
    Contact: formData.contact || '',
    Sales_Date: formatDate(formData.salesDate), // Format: YYYY-MM-DD
    Sold_At: formData.soldAt || '',
    Status: formData.status || 'Installed',
    Model: formData.model || '',
    Active: formData.active || 'Yes',
    Card_No: formData.cardNumber || '',
  }
}

/**
 * Utility: format date string to YYYY-MM-DD
 * Handles empty or invalid dates
 */
function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}
