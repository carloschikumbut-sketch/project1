// Note: Config will be added in the final connection step
const db = firebase.firestore();

async function loadOrders() {
    const snapshot = await db.collection("orders").orderBy("createdAt", "desc").get();
    const listBody = document.getElementById('order-list-body');
    
    let allOrders = [];

    listBody.innerHTML = snapshot.docs.map(doc => {
        const order = doc.data();
        allOrders.push({ id: doc.id, ...order });
        
        const date = order.createdAt ? order.createdAt.toDate().toLocaleDateString() : 'N/A';
        const statusClass = order.status === 'Fulfilled' ? 'status-fulfilled' : 'status-unfulfilled';

        return `
            <tr>
                <td><strong>#${doc.id.substring(0, 5)}</strong></td>
                <td>${date}</td>
                <td>${order.customerName || 'Guest'}</td>
                <td>${order.total}</td>
                <td><span class="status-pill status-fulfilled">Paid</span></td>
                <td><span class="status-pill ${statusClass}">${order.status || 'Unfulfilled'}</span></td>
                <td>${order.items.length} items</td>
                <td><button onclick="viewInvoice('${doc.id}')" style="border:none; background:none; cursor:pointer;"><i class="fa-solid fa-ellipsis"></i></button></td>
            </tr>
        `;
    }).join('');

    // Save for Export
    window.currentOrders = allOrders;
}

// BULK ACTION: Export to Excel (Requirement met)
function exportOrdersToExcel() {
    if(!window.currentOrders) return;
    
    const worksheet = XLSX.utils.json_to_sheet(window.currentOrders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SneakerLab_Orders");
    XLSX.writeFile(workbook, "SNEAKERLAB_Orders_Report.xlsx");
}

window.onload = loadOrders;