const API_URL = 'http://localhost:5000/api';
let batchShipments = [];

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');

    // Update review tab
    if (tabName === 'review') {
        updateReviewTab();
    }
}

function addShipment() {
    const shipment = {
        id: Date.now(),
        recipient_name: document.getElementById('recipientName').value,
        recipient_email: document.getElementById('recipientEmail').value,
        street: document.getElementById('street').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        postal_code: document.getElementById('postal').value,
        country: document.getElementById('country').value,
        weight: parseFloat(document.getElementById('weight').value),
        contents: document.getElementById('contents').value,
        service_type: document.getElementById('serviceType').value
    };

    // Validate
    if (!shipment.recipient_name || !shipment.weight || !shipment.country) {
        alert('Please fill in all required fields');
        return;
    }

    batchShipments.push(shipment);
    displayManualList();
    clearForm();
    alert(`Shipment added! Total: ${batchShipments.length}`);
}

function clearForm() {
    document.getElementById('recipientName').value = '';
    document.getElementById('recipientEmail').value = '';
    document.getElementById('street').value = '';
    document.getElementById('city').value = '';
    document.getElementById('state').value = '';
    document.getElementById('postal').value = '';
    document.getElementById('country').value = '';
    document.getElementById('weight').value = '';
    document.getElementById('contents').value = '';
    document.getElementById('serviceType').value = 'standard';
}

function displayManualList() {
    const listContainer = document.getElementById('manualList');

    if (batchShipments.length === 0) {
        listContainer.innerHTML = '';
        return;
    }

    listContainer.innerHTML = '<div style="margin-top: 2rem;"><h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 1rem; color: var(--dark-blue);">📋 Shipments in Batch</h3>' +
        batchShipments.map((s, idx) => `
            <div class="shipment-item">
                <div class="shipment-info">
                    <div class="shipment-index">Shipment #${idx + 1}</div>
                    <div class="shipment-summary">${s.recipient_name} → ${s.country}</div>
                    <div class="shipment-details">${s.weight} kg · ${s.service_type} · ${s.contents}</div>
                </div>
                <div class="shipment-actions">
                    <button class="btn btn-small" onclick="editShipment(${s.id})">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="removeShipment(${s.id})">Remove</button>
                </div>
            </div>
        `).join('') + '</div>';
}

function removeShipment(id) {
    batchShipments = batchShipments.filter(s => s.id !== id);
    displayManualList();
}

function editShipment(id) {
    const shipment = batchShipments.find(s => s.id === id);
    if (shipment) {
        document.getElementById('recipientName').value = shipment.recipient_name;
        document.getElementById('recipientEmail').value = shipment.recipient_email;
        document.getElementById('street').value = shipment.street;
        document.getElementById('city').value = shipment.city;
        document.getElementById('state').value = shipment.state;
        document.getElementById('postal').value = shipment.postal_code;
        document.getElementById('country').value = shipment.country;
        document.getElementById('weight').value = shipment.weight;
        document.getElementById('contents').value = shipment.contents;
        document.getElementById('serviceType').value = shipment.service_type;

        removeShipment(id);
        document.querySelector('button[onclick="switchTab(\'manual\')"]').click();
    }
}

function handleCSVUpload() {
    const file = document.getElementById('csvFile').files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const csv = e.target.result;
        const rows = csv.trim().split('\n').slice(1); // Skip header

        const newShipments = rows.map(row => {
            const [name, email, street, city, state, postal, country, weight, contents, service] = row.split(',').map(s => s.trim());
            return {
                id: Date.now() + Math.random(),
                recipient_name: name,
                recipient_email: email,
                street: street,
                city: city,
                state: state,
                postal_code: postal,
                country: country,
                weight: parseFloat(weight),
                contents: contents,
                service_type: service || 'standard'
            };
        }).filter(s => s.recipient_name); // Remove empty rows

        batchShipments = [...batchShipments, ...newShipments];

        const statusDiv = document.getElementById('csvStatus');
        statusDiv.style.display = 'block';
        statusDiv.innerHTML = `<div class="success">✓ Imported ${newShipments.length} shipments! Total in batch: ${batchShipments.length}</div>`;

        setTimeout(() => {
            document.querySelector('button[onclick="switchTab(\'review\')"]').click();
        }, 1500);
    };

    reader.readAsText(file);
}

function downloadTemplate() {
    const template = `Recipient Name,Email,Street,City,State,Postal Code,Country,Weight (kg),Contents,Service Type
John Smith,john@example.com,123 Main St,New York,NY,10001,USA,2.5,Electronics,express
Jane Doe,jane@example.com,456 Oak Ave,London,,SW1A 1AA,UK,1.8,Documents,standard
Bob Johnson,bob@example.com,789 Elm St,Tokyo,,100-0001,Japan,5.0,Package,economy`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shipment-template.csv';
    a.click();
}

function updateReviewTab() {
    if (batchShipments.length === 0) {
        document.getElementById('summaryBox').style.display = 'none';
        document.getElementById('emptyReview').style.display = 'block';
        document.getElementById('reviewList').innerHTML = '';
        return;
    }

    document.getElementById('emptyReview').style.display = 'none';
    document.getElementById('summaryBox').style.display = 'block';

    // Calculate summary
    const totalWeight = batchShipments.reduce((sum, s) => sum + (s.weight || 0), 0);
    const estimatedCost = batchShipments.length * 45; // $45 base per shipment

    document.getElementById('totalShipments').textContent = batchShipments.length;
    document.getElementById('totalWeight').textContent = totalWeight.toFixed(1) + ' kg';
    document.getElementById('estimatedCost').textContent = '$' + estimatedCost.toLocaleString();

    // Display list
    const listContainer = document.getElementById('reviewList');
    listContainer.innerHTML = '<div style="margin-top: 2rem;">' +
        batchShipments.map((s, idx) => `
            <div class="shipment-item">
                <div class="shipment-info">
                    <div class="shipment-index">Shipment #${idx + 1}</div>
                    <div class="shipment-summary">${s.recipient_name}</div>
                    <div class="shipment-details">
                        ${s.street}, ${s.city}, ${s.postal_code} ${s.country} ·
                        ${s.weight} kg · ${s.contents} · ${s.service_type}
                    </div>
                </div>
                <div class="shipment-actions">
                    <button class="btn btn-small btn-danger" onclick="removeShipment(${s.id})">Remove</button>
                </div>
            </div>
        `).join('') + '</div>';
}

async function submitBatch() {
    if (batchShipments.length === 0) {
        alert('No shipments to submit');
        return;
    }

    const confirmed = confirm(`Submit ${batchShipments.length} shipments? This action cannot be undone.`);
    if (!confirmed) return;

    const token = localStorage.getItem('authToken');

    try {
        // Prepare batch payload
        const payload = {
            shipments: batchShipments.map(s => ({
                recipient_name: s.recipient_name,
                recipient_email: s.recipient_email,
                destination_address: `${s.street}, ${s.city}, ${s.state} ${s.postal_code}`,
                destination_country: s.country,
                weight: s.weight,
                contents: s.contents,
                service_type: s.service_type,
                shipment_type: 'parcel'
            }))
        };

        // This would call a batch endpoint like POST /api/shipments/batch
        // For now, we'll simulate the submission
        console.log('Submitting batch:', payload);

        // Simulate submission
        const results = await Promise.all(
            payload.shipments.map(shipment =>
                fetch(`${API_URL}/shipments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(shipment)
                }).then(r => r.json())
            )
        );

        // Show results
        const successCount = results.filter(r => r.tracking_number).length;
        const failureCount = results.length - successCount;

        alert(`Batch submitted!\n\n✓ Success: ${successCount}\n✗ Failed: ${failureCount}\n\nCheck your email for tracking numbers.`);

        clearBatch();
        document.querySelector('button[onclick="switchTab(\'manual\')"]').click();
    } catch (error) {
        console.error('Batch submission error:', error);
        alert('Error submitting batch. Check your connection and try again.');
    }
}

function clearBatch() {
    if (confirm('Clear all shipments in batch? This cannot be undone.')) {
        batchShipments = [];
        displayManualList();
        document.getElementById('summaryBox').style.display = 'none';
        document.getElementById('emptyReview').style.display = 'block';
        document.getElementById('reviewList').innerHTML = '';
    }
}
