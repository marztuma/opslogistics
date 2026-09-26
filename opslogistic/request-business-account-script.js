const API_URL = 'http://localhost:5000/api';

document.getElementById('businessAccountForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const loadingMsg = document.getElementById('businessLoadingMsg');
    const errorMsg = document.getElementById('businessErrorMsg');
    const formContainer = document.getElementById('businessFormContainer');
    const confirmationSection = document.getElementById('businessConfirmation');

    loadingMsg.style.display = 'block';
    errorMsg.style.display = 'none';

    try {
        const formData = {
            company_name: document.getElementById('companyName').value,
            website: document.getElementById('website').value || null,
            contact_name: document.getElementById('contactName').value,
            email: document.getElementById('workEmail').value,
            phone: document.getElementById('phone').value || null,
            current_carrier: document.getElementById('currentCarrier').value || null,
            shipment_type: document.getElementById('shipmentType').value,
            shipping_lanes: document.getElementById('shippingLanes').value,
            shipping_frequency: document.querySelector('.freq-btn.active').dataset.freq || 'weekly',
            additional_notes: document.getElementById('additionalNotes').value || null,
            status: 'pending_business_account'
        };

        const response = await fetch(`${API_URL}/customers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const customerId = data.customer_id || data.id || 'pending';

        // Display confirmation
        loadingMsg.style.display = 'none';
        formContainer.style.display = 'none';
        confirmationSection.style.display = 'block';

        document.getElementById('confirmCustomerId').textContent = customerId;
        document.getElementById('confirmCompany').textContent = formData.company_name;
        document.getElementById('confirmEmail').textContent = formData.email;
        document.getElementById('confirmDate').textContent = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        // Button handlers
        document.getElementById('confirmNewBtn').addEventListener('click', () => {
            formContainer.style.display = 'block';
            confirmationSection.style.display = 'none';
            document.getElementById('businessAccountForm').reset();
            document.querySelectorAll('.freq-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelector('.freq-btn[data-freq="weekly"]').classList.add('active');
        });

    } catch (error) {
        loadingMsg.style.display = 'none';
        errorMsg.style.display = 'block';
        errorMsg.textContent = `Error: ${error.message}. Please try again or call +1 858-428-7703.`;
        console.error('Form submission error:', error);
    }
});

// Frequency button toggle
document.querySelectorAll('.freq-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.freq-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});
