var order = [];

function addMenuItem() {
    // Capture input field values
    const name = document.getElementById('name').value;
    const price = parseFloat(document.getElementById('menuItemPrice').value);

    // Validate the name and price before sending
    if (!name || isNaN(price) || price <= 0) {
        return alert('Please provide valid menu name and price');
    }

    // Create an array to store inventory items and their quantities
    const inventoryItems = [];

    // Loop through the inventory items and get the quantities
    document.querySelectorAll('[id^="quantity-"]').forEach((input) => {
        const inventoryId = input.id.split('-')[1];
        const quantity = parseInt(input.value) || 0; // Default to 0 if not provided
        if (quantity > 0) {
            inventoryItems.push({ inventoryId, quantity });
        }
    });

    // Send data to the server (use fetch or AJAX)
    fetch('/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            price: price,
            inventoryItems: inventoryItems
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.reload();
        } else {
            alert('Error adding Menu Item');
        }
    })
    .catch(error => {
        console.error('Error adding menu item:', error);
        alert('Error adding menu item.');
    });
}

// Function to add item to the order list
function addOrder(itemId, itemName, itemPrice) {
    // Check if the item already exists in the order
    let existingItem = order.find(item => item.id === itemId);

    if (existingItem) {
        // If item exists, increase the quantity and update the total price
        existingItem.quantity++;
        existingItem.totalPrice = existingItem.quantity * itemPrice;
    } else {
        // If item doesn't exist, add it to the order
        order.push({
            id: itemId,
            name: itemName,
            price: itemPrice,
            quantity: 1,
            totalPrice: itemPrice
        });
    }

    // Update the order list in the UI
    updateOrderList();
}

// Function to update the order list UI and total price
function updateOrderList() {
    const orderList = document.getElementById('orderSummary');
    orderList.innerHTML = '';  // Clear current order list

    let totalPrice = 0;

    // Loop through the order items and render them
    order.forEach(item => {
        const listItem = document.createElement('li');
        listItem.classList.add('order-item');
        listItem.innerHTML = `${item.name} <span class="badge bg-secondary">x${item.quantity}</span> - <span class="text-success">$${item.totalPrice.toFixed(2)}</span>`;

        orderList.appendChild(listItem);

        // Add to the total price
        totalPrice += item.totalPrice;
    });

    // Update the total price
    document.getElementById('totalPrice').innerText = `Total: $${totalPrice.toFixed(2)}`;
}

// Function to place the order
async function placeOrder() {
    // Assuming 'order' is an array of objects with menu item details like:
    // { id: menuItemID, name: "Item Name", quantity: 2, price: 10.00 }
    const orderData = [];

    // Collect order details including name, id, quantity, and price
    order.forEach(item => {
        orderData.push({
            menuItemID: item.id,
            name: item.name,        // Add the name of the item
            quantity: item.quantity,
            price: item.price
        });
    });

    // Calculate the total amount for the order
    const totalAmount = order.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

    // Send a POST request with the order details
    await fetch('/place-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            totalAmount: totalAmount,
            orderItems: orderData
        })
    })
    window.location.reload();
}
