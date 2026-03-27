/**
 * admin-dashboard.js 
 * Fixed for Multi-Category (Arrays) and Schema Alignment
 */

const _supabase = window._supabase;

if (!_supabase) {
    console.error("CRITICAL ERROR: Supabase connection failed.");
}

const inventoryForm = document.getElementById('inventory-form');

if (inventoryForm) {
    inventoryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // If the button says "Update", we don't run the Upload logic here
        const saveBtn = document.querySelector('.btn-primary');
        if (saveBtn.innerText === "Update Product") return;

        const name = document.getElementById('prod-title').value;
        const price = document.getElementById('prod-price').value;
        const brand = document.getElementById('prod-brand').value;
        const desc = document.getElementById('prod-desc').value;
        
        // FIX: Get categories as an array to avoid "malformed array literal"
        const catSelect = document.getElementById('prod-cat');
        let categories = [];
        if (catSelect.tagName === 'SELECT') {
            categories = Array.from(catSelect.selectedOptions).map(opt => opt.value);
        } else {
            categories = [catSelect.value.toLowerCase().trim()];
        }
        
        const fileInput = document.getElementById('prod-img-file');
        const file = fileInput ? fileInput.files[0] : null;

        if (!file) {
            alert("Please select a sneaker image to upload.");
            return;
        }

        await handleProductUpload(name, price, brand, desc, categories, file);
    });
}

async function handleProductUpload(name, price, brand, desc, categories, file) {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { data: uploadData, error: uploadError } = await _supabase.storage
            .from('sneaker-images')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = _supabase.storage
            .from('sneaker-images')
            .getPublicUrl(filePath);

        await addSneakerToSupabase(name, price, brand, publicUrl, desc, categories);

        inventoryForm.reset();
        document.getElementById('file-name-display').innerText = "";

    } catch (err) {
        alert("Upload Failed: " + err.message);
    }
}
async function addSneakerToSupabase(name, price, brand, imgUrl, desc, categories) {
    console.log("SneakerLab: Preparing to save product...");

    try {
        // 1. Grab the "Was Price" (Compare Price) from the HTML input
        const comparePriceInput = document.getElementById('prod-compare-price');
        const comparePrice = comparePriceInput && comparePriceInput.value ? parseFloat(comparePriceInput.value) : null;

        // 2. Calculate Total Stock from the variant table rows
        let totalStock = 0;
        const variantRows = document.querySelectorAll('#variant-list tr');
        
        // This maps your UI variants into a clean JSON array for Supabase
        const variantsArr = Array.from(variantRows).map(row => {
            const size = row.querySelector('.v-size').value;
            const stock = parseInt(row.querySelector('.v-stock').value || 0);
            totalStock += stock; // Add to our running total
            return { size, stock };
        });

        // 3. Send the data to Supabase
        const { error } = await _supabase.from('products').insert([{ 
            name: name, 
            price: parseFloat(price), 
            compare_at_price: comparePrice, // Perfectly mapped here
            brand: brand.toUpperCase().trim(), 
            image_url: imgUrl, 
            description: desc, 
            category: categories, // Expects an Array []
            stock_quantity: totalStock,
            variants: variantsArr // Stores the sizes/stock in your JSONB column
        }]);

        if (error) throw error;

        // 4. Success Actions
        alert("Sneaker Lab: Product added successfully!");
        
        // Reset the form and refresh the table
        const inventoryForm = document.getElementById('inventory-form');
        if (inventoryForm) inventoryForm.reset();
        
        if (typeof refreshInventoryList === "function") {
            refreshInventoryList();
        }

    } catch (err) {
        console.error("Critical Upload Error:", err.message);
        alert("Database Error: " + err.message);
    }
}

async function refreshInventoryList() {
    const { data: products, error } = await _supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    const tbody = document.getElementById('inventory-list-body');
    if (!tbody || error) return;

    tbody.innerHTML = '';
    products.forEach(item => {
        tbody.innerHTML += `
            <tr data-id="${item.id}">
                <td><img src="${item.image_url}" style="width:50px; height:50px; object-fit:contain; background:#f4f4f4; border-radius:4px;"></td>
                <td><strong>${item.name}</strong><br><small>${item.brand || ''}</small></td>
                <td>$${item.price}</td>
                <td>
                    <button onclick="editProduct('${item.id}')" class="btn-secondary" style="margin-right:10px; cursor:pointer;">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button onclick="deleteProduct('${item.id}')" style="color:red; background:none; border:none; cursor:pointer;">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

async function editProduct(productId) {
    const { data: product, error } = await _supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

    if (error) return alert("Could not fetch product details.");

    // Fill Form
    document.getElementById('prod-title').value = product.name;
    document.getElementById('prod-price').value = product.price;
    document.getElementById('prod-brand').value = product.brand;
    document.getElementById('prod-desc').value = product.description;

    // Set Multi-select Categories
    const catSelect = document.getElementById('prod-cat');
    if (product.category && Array.isArray(product.category)) {
        Array.from(catSelect.options).forEach(opt => {
            opt.selected = product.category.includes(opt.value);
        });
    }

    // Load Variants
    const variantTable = document.getElementById('variant-list');
    variantTable.innerHTML = ""; 
    if (product.variants && Array.isArray(product.variants)) {
        product.variants.forEach(v => {
            const row = variantTable.insertRow();
            row.innerHTML = `
                <td><input type="text" value="${v.size}" class="v-size"></td>
                <td><input type="number" value="${v.stock}" class="v-stock"></td>
                <td><button type="button" onclick="this.parentElement.parentElement.remove()" style="color:red; background:none; border:none;"><i class="fa-solid fa-trash"></i></button></td>
            `;
        });
    }

    // Switch Button to Update Mode
    const saveBtn = document.querySelector('.btn-primary');
    saveBtn.innerText = "Update Product";
    
    // Change form submission to Update
    inventoryForm.onsubmit = async (e) => {
        e.preventDefault();
        await updateExistingProduct(productId);
    };

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function updateExistingProduct(productId) {
    const selectedCats = Array.from(document.getElementById('prod-cat').selectedOptions).map(o => o.value);
    
    const variantRows = document.querySelectorAll('#variant-list tr');
    const variantsArr = Array.from(variantRows).map(row => ({
        size: row.querySelector('.v-size').value,
        stock: parseInt(row.querySelector('.v-stock').value || 0)
    }));

    const totalStock = variantsArr.reduce((sum, v) => sum + v.stock, 0);

    const updatedData = {
        name: document.getElementById('prod-title').value,
        price: parseFloat(document.getElementById('prod-price').value),
        description: document.getElementById('prod-desc').value,
        brand: document.getElementById('prod-brand').value,
        category: selectedCats, // Correctly sends as array []
        variants: variantsArr,
        stock_quantity: totalStock
    };

    const { error } = await _supabase
        .from('products')
        .update(updatedData)
        .eq('id', productId);

    if (error) {
        alert("Update failed: " + error.message);
    } else {
        alert("Product Updated Successfully!");
        location.reload(); 
    }
}

window.deleteProduct = async (id) => {
    if (confirm("Delete this product permanently?")) {
        const { error } = await _supabase.from('products').delete().eq('id', id);
        if (error) alert(error.message);
        else refreshInventoryList();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('inventory-list-body')) refreshInventoryList();
});
let isBulkEditing = false;

// 1. Toggle between view mode and edit mode
function toggleBulkEdit() {
    const tbody = document.getElementById('inventory-list-body');
    const rows = tbody.querySelectorAll('tr');
    const btn = document.getElementById('bulk-edit-btn');

    if (!isBulkEditing) {
        // Switch to Edit Mode
        rows.forEach(row => {
            const stockCell = row.cells[2]; // Assuming Price is index 2
            const qtyCell = row.cells[1];   // Adjust index based on your table
            
            // Turn the price and stock into inputs
            const currentPrice = stockCell.innerText.replace('$', '');
            stockCell.innerHTML = `<input type="number" class="bulk-price" value="${currentPrice}" style="width:80px">`;
        });
        
        btn.innerText = "Save All Changes";
        btn.className = "btn-primary"; // Highlight the save action
        isBulkEditing = true;
    } else {
        saveBulkChanges();
    }
}

// 2. Collect all changes and send to Supabase
async function saveBulkChanges() {
    const tbody = document.getElementById('inventory-list-body');
    const rows = tbody.querySelectorAll('tr');
    const updates = [];

    rows.forEach(row => {
        const id = row.getAttribute('data-id'); // We need to add this attribute in refreshInventoryList
        const newPrice = row.querySelector('.bulk-price').value;

        if (id) {
            updates.push({
                id: id,
                price: parseFloat(newPrice)
            });
        }
    });

    try {
        // Loop through and update each (Supabase doesn't do a single-call multi-row update easily for different values)
        const promises = updates.map(item => 
            _supabase.from('products').update({ price: item.price }).eq('id', item.id)
        );

        await Promise.all(promises);
        
        alert("Bulk Update Successful!");
        isBulkEditing = false;
        document.getElementById('bulk-edit-btn').innerText = "Bulk Edit Stock";
        refreshInventoryList();
    } catch (err) {
        console.error("Bulk Update Failed:", err.message);
    }
}