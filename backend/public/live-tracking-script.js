// Mock tracking data for demo
const mockTrackingData = {
    'OPS2024001': {
        tracking_number: 'OPS2024001',
        status: 'in_transit',
        origin: 'New York, USA',
        destination: 'London, UK',
        current_location: 'Atlantic Ocean',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        estimated_delivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        progress: 65,
        timeline: [
            { status: 'picked_up', time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), location: 'New York, USA', description: 'Shipment picked up from warehouse' },
            { status: 'customs_cleared', time: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000), location: 'JFK Airport, New York', description: 'Cleared customs inspection' },
            { status: 'in_transit', time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), location: 'Atlantic Ocean', description: 'In transit via air freight' },
            { status: 'out_for_delivery', time: null, location: null, description: 'Out for delivery' },
            { status: 'delivered', time: null, location: null, description: 'Delivered' }
        ],
        updates: [
            { time: new Date(Date.now() - 30 * 60 * 1000), message: 'Shipment updated location: 15% through Atlantic crossing' },
            { time: new Date(Date.now() - 2 * 60 * 60 * 1000), message: 'Package weight verified: 2.5 kg' },
            { time: new Date(Date.now() - 5 * 60 * 60 * 1000), message: 'Customs clearance completed successfully' }
        ]
    },
    'OPS2024002': {
        tracking_number: 'OPS2024002',
        status: 'delivered',
        origin: 'Los Angeles, USA',
        destination: 'Tokyo, Japan',
        current_location: 'Tokyo, Japan',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        estimated_delivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        progress: 100,
        timeline: [
            { status: 'picked_up', time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), location: 'Los Angeles, USA', description: 'Shipment picked up from warehouse' },
            { status: 'in_transit', time: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), location: 'LAX Airport', description: 'Loaded onto aircraft' },
            { status: 'arrived', time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), location: 'Narita Airport, Tokyo', description: 'Arrived at destination airport' },
            { status: 'out_for_delivery', time: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000), location: 'Tokyo, Japan', description: 'Out for delivery' },
            { status: 'delivered', time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), location: 'Tokyo, Japan', description: 'Delivered successfully' }
        ],
        updates: [
            { time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), message: '✓ Delivered to recipient at Tokyo address' },
            { time: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000), message: 'Out for delivery in Tokyo' }
        ]
    }
};

let currentTracking = null;
let ws = null;
let updateInterval = null;

// Handle Enter key in search
document.getElementById('trackingInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') loadTracking();
});

function loadTracking() {
    const trackingNumber = document.getElementById('trackingInput').value.trim().toUpperCase();

    if (!trackingNumber) {
        alert('Please enter a tracking number');
        return;
    }

    // Check mock data (in real app, this would be API call)
    const data = mockTrackingData[trackingNumber];

    if (!data) {
        alert(`Tracking number "${trackingNumber}" not found. Try: OPS2024001 or OPS2024002`);
        return;
    }

    currentTracking = data;
    displayTracking();
    setupLiveUpdates();
}

function displayTracking() {
    if (!currentTracking) return;

    const data = currentTracking;

    // Show/hide sections
    document.getElementById('trackingContent').style.display = 'block';
    document.getElementById('emptyState').style.display = 'none';

    // Header info
    document.getElementById('displayTrackingNumber').textContent = data.tracking_number;

    const statusBadge = document.getElementById('statusBadge');
    statusBadge.textContent = data.status.replace('_', ' ').toUpperCase();
    statusBadge.className = 'status-badge ' + data.status;

    // Details
    document.getElementById('currentLocation').textContent = data.current_location;
    document.getElementById('estimatedDelivery').textContent = formatDate(data.estimated_delivery);
    document.getElementById('progress').textContent = data.progress + '%';

    // Updates
    displayUpdates();

    // Timeline
    displayTimeline();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function displayUpdates() {
    const updates = currentTracking.updates || [];
    const listContainer = document.getElementById('updatesList');

    if (updates.length === 0) {
        listContainer.innerHTML = '<div style="color: var(--text-light); text-align: center; padding: 1rem;">No updates yet</div>';
        return;
    }

    listContainer.innerHTML = updates.map((update, idx) => `
        <div class="update-item ${idx === 0 ? 'new' : ''}">
            <div style="font-size: 0.8rem; color: #666; margin-bottom: 0.25rem;">${formatTime(update.time)}</div>
            <div>${update.message}</div>
        </div>
    `).join('');
}

function displayTimeline() {
    const timeline = currentTracking.timeline || [];
    const container = document.getElementById('timelineContainer');

    container.innerHTML = timeline.map((item, idx) => {
        const isCompleted = item.time !== null;
        const isLast = idx === timeline.length - 1;
        const isCurrent = isCompleted && !timeline.slice(idx + 1).some(t => t.time !== null);

        return `
            <div class="timeline-item">
                <div class="timeline-marker">
                    <div class="timeline-dot ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}"></div>
                    ${!isLast ? `<div class="timeline-connector ${isCompleted ? 'completed' : ''}"></div>` : ''}
                </div>
                <div class="timeline-content">
                    ${item.time ? `<div class="timeline-time">${formatDate(item.time)}</div>` : ''}
                    <div class="timeline-title">${item.description}</div>
                    ${item.location ? `<div class="location-badge">${item.location}</div>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Mock live update simulation
function setupLiveUpdates() {
    // Clear any existing interval
    if (updateInterval) clearInterval(updateInterval);

    // Simulate live updates every 30 seconds
    updateInterval = setInterval(() => {
        if (currentTracking && Math.random() > 0.5) {
            // Simulate progress update
            if (currentTracking.progress < 100) {
                currentTracking.progress += Math.random() * 15;
                if (currentTracking.progress > 100) currentTracking.progress = 100;

                document.getElementById('progress').textContent = Math.round(currentTracking.progress) + '%';
            }

            // Simulate new update message
            const messages = [
                'Location updated: Now ' + Math.round(currentTracking.progress) + '% through journey',
                'Shipment scanned at transit point',
                'Weight verified and documentation confirmed',
                'Customs pre-clearance initiated',
                'On schedule for delivery'
            ];

            const newUpdate = {
                time: new Date(),
                message: messages[Math.floor(Math.random() * messages.length)]
            };

            currentTracking.updates.unshift(newUpdate);
            displayUpdates();

            // Show notification
            if (document.getElementById('liveNotif').checked) {
                showNotification(newUpdate.message);
            }
        }
    }, 30000);

    // Show initial notification
    showNotification('📍 Live tracking started for ' + currentTracking.tracking_number);
}

function showNotification(message) {
    // Create floating notification
    const notif = document.createElement('div');
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border: 2px solid #0055CC;
        border-radius: 8px;
        padding: 1rem 1.5rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notif.textContent = message;
    document.body.appendChild(notif);

    setTimeout(() => {
        notif.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 4000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Utility functions
function formatDate(date) {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatTime(date) {
    if (!date) return '—';
    return new Date(date).toLocaleTimeString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (updateInterval) clearInterval(updateInterval);
});

// WebSocket setup (for real-time backend integration)
function initWebSocket(trackingNumber) {
    // This would connect to your Node.js + Socket.io backend
    // ws = new WebSocket(`wss://your-api.com/tracking/${trackingNumber}`);
    //
    // ws.onmessage = (event) => {
    //     const update = JSON.parse(event.data);
    //     currentTracking.updates.unshift(update);
    //     displayUpdates();
    //     showNotification(update.message);
    // };
    //
    // ws.onerror = () => {
    //     console.error('WebSocket connection failed, falling back to polling');
    //     setupLiveUpdates(); // Fallback to interval-based updates
    // };
}
