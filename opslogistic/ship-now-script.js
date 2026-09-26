// Ship Now Form Handler
const API_URL = 'http://localhost:5000/api';

document.getElementById('shipNowForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('shipSubmitBtn');
    const loadingMsg = document.getElementById('shipLoadingMsg');
    const errorMsg = document.getElementById('shipErrorMsg');
    const form = document.getElementById('shipNowForm');
    const confirmation = document.getElementById('shipConfirmation');

    // Show loading state
    submitBtn.style.display = 'none';
    loadingMsg.style.display = 'block';
    errorMsg.style.display = 'none';

    try {
        // Prepare form data
        const formData = {
            origin_address_id: 1, // Would be user's saved address
            destination_address_id: 2, // Would be selected destination
            shipment_type: 'parcel',
            service_type: 'express',
            weight: parseFloat(document.getElementById('pickupWeight').value) || 0,
            dimensions: document.getElementById('pickupDimensions').value,
            contents: document.getElementById('pickupWhat').value,
            items: [
                {
                    description: document.getElementById('pickupWhat').value,
                    quantity: parseInt(document.getElementById('pickupPieces').value) || 1,
                    weight: parseFloat(document.getElementById('pickupWeight').value) || 0,
                    value: 0,
                    hs_code: ''
                }
            ]
        };

        // Call API
        const response = await fetch(`${API_URL}/shipments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to create shipment');
        }

        // Display confirmation
        document.getElementById('confirmTrackingNumber').textContent = data.shipment.tracking_number;
        document.getElementById('confirmDate').textContent = new Date(data.shipment.created_at).toLocaleDateString();

        // Hide form, show confirmation
        form.style.display = 'none';
        confirmation.style.display = 'block';
        confirmation.scrollIntoView({ behavior: 'smooth' });

    } catch (err) {
        console.error('Ship now error:', err);
        errorMsg.textContent = '❌ ' + (err.message || 'Failed to create shipment');
        errorMsg.style.display = 'block';
        submitBtn.style.display = 'block';
        loadingMsg.style.display = 'none';
    }
});

// Track Shipment Button
document.getElementById('confirmTrackBtn').addEventListener('click', () => {
    const trackingNumber = document.getElementById('confirmTrackingNumber').textContent;
    window.location.href = 'track.html?tracking=' + encodeURIComponent(trackingNumber);
});

// New Shipment Button
document.getElementById('confirmNewBtn').addEventListener('click', () => {
    document.getElementById('shipConfirmation').style.display = 'none';
    document.getElementById('shipNowForm').style.display = 'block';
    document.getElementById('shipNowForm').reset();
    document.getElementById('shipSubmitBtn').style.display = 'block';
    document.getElementById('shipLoadingMsg').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
