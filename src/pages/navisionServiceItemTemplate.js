// navisionServiceItemTemplate.js

/**
 * Template for sending Service Item to Navision via SOAP
 * Replace the values from reactive form `formData` before sending
 */
export function buildNavisionServiceItem(formData) {
  const isNew = !formData.No

  const payload = {
    Model: formData.model || '',
    Status: formData.status || 'Installed',
    Active: formData.active || 'Yes',
    Name: formData.customerName || '',
    Contact: formData.contact || '',
    Post_Code: formData.postCode || '',
    User_Owner: formData.user || '',
    Phone_No_of_User_Owner: formData.phoneNumber || '',
    Purchased_At: formData.purchaseAt || '',
    Invoice_No: formData.invoiceNo || '',
    Sold_At_Shop: formData.soldAt || '',
    ...(formData.salesDate ? { Sales_Date: formatDate(formData.salesDate) } : {}),
    ...(formData.WarrantyStartDate
      ? { Warranty_Start_Date: formatDate(formData.WarrantyStartDate) }
      : {}),
    ...(isNew
      ? {
          Item_No: formData.itemNumber || '',
          Serial_No: formData.serialNumber || '',
          Customer_No: formData.customerNumber || '',
        }
      : {}),
  }

  // NAV cannot update keys for existing items
  if (!isNew) {
    delete payload.Item_No
    delete payload.Serial_No
    delete payload.Customer_No
  }

  return payload
}

/**
 * Utility: format date string to YYYY-MM-DD
 * Handles empty or invalid dates
 */
function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
