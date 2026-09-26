// FAQ Database
const faqs = [
    {
        id: 1,
        category: 'basics',
        featured: true,
        icon: '📦',
        question: 'What is the difference between parcel and freight shipping?',
        answer: 'Parcel shipping is for packages up to 150 lbs that fit in standard boxes. Freight shipping is for larger items, pallets, or multiple boxes combined. We handle both. Parcel is faster and simpler; freight requires more documentation but handles oversized cargo. Choose parcel for small packages under 150 lbs, freight for anything larger or heavier.'
    },
    {
        id: 2,
        category: 'pricing',
        featured: true,
        icon: '💰',
        question: 'Why are quotes different from final pricing?',
        answer: 'Initial quotes are estimates based on weight and dimensions. Final pricing accounts for actual packaging, any special handling, customs complexity, and current fuel surcharges. Once you submit a shipment, we provide a final invoice before pickup. This ensures you always know the exact cost before we move your freight.'
    },
    {
        id: 3,
        category: 'shipping',
        featured: true,
        icon: '🚚',
        question: 'How long does a shipment take?',
        answer: 'Delivery time depends on route and service type. Domestic: 2-5 days. International express: 5-10 days. Standard international: 10-20 days. Air freight is faster but costs more. Ocean freight is cheapest but slower (2-4 weeks). We provide exact timelines in your quote before booking.'
    },
    {
        id: 4,
        category: 'tracking',
        featured: true,
        icon: '📍',
        question: 'Can I track my shipment in real-time?',
        answer: 'Yes! All shipments include real-time tracking. You get a tracking number immediately upon pickup. Use it on our website to see location, status, and estimated delivery. You also receive automatic email updates at each milestone: pickup, customs clearance, out for delivery, and delivery confirmation.'
    },
    {
        id: 5,
        category: 'issues',
        featured: true,
        icon: '⚠️',
        question: 'What if something goes wrong with my shipment?',
        answer: 'We have insurance on all shipments. If damage or loss occurs, contact us immediately with photos. We file a claim with the carrier. For delays, we investigate and work to get your freight moving. Call us 24/7 at +1 858-428-7703 for urgent issues. We respond to all problems within 2 hours.'
    },
    {
        id: 6,
        category: 'basics',
        featured: true,
        icon: '☎️',
        question: 'How do I contact customer support?',
        answer: 'Multiple ways to reach us: Phone +1 858-428-7703 (24/7). Email via our contact form on the support page. Live chat on our website. All methods are monitored continuously. For shipment-specific questions, provide your tracking number for faster resolution.'
    },
    {
        id: 7,
        category: 'pricing',
        icon: '📊',
        question: 'Do you offer volume discounts?',
        answer: 'Yes! Businesses shipping regularly qualify for volume pricing. Contact our business team about account setup and custom pricing. We also offer pricing breaks for regular routes. More volume = better rates. Minimum shipments required for discount eligibility vary by route.'
    },
    {
        id: 8,
        category: 'shipping',
        icon: '📦',
        question: 'What items cannot be shipped?',
        answer: 'Prohibited items include: hazardous materials (without proper licensing), liquids, explosives, perishables (without special handling), and certain controlled items. Restricted items require special documentation: batteries, electronics, fragile goods. Always declare contents accurately. We advise you on restrictions before booking.'
    },
    {
        id: 9,
        category: 'basics',
        icon: '🌍',
        question: 'Do you ship to all countries?',
        answer: 'We ship to virtually every country globally. Some countries have stricter customs rules or longer processing times. We provide country-specific guidance at quote time. Certain countries have temporary restrictions due to trade or conflict — we'll inform you if your destination is affected.'
    },
    {
        id: 10,
        category: 'pricing',
        icon: '🛑',
        question: 'What are tariffs and who pays them?',
        answer: 'Tariffs are import taxes charged by the destination country. Generally, the receiver pays tariffs (unless you pre-arrange otherwise). Tariff rates vary by country, product type, and value. We calculate estimated tariffs in quotes. See our Tariff Updates page for current rates by country.'
    },
    {
        id: 11,
        category: 'tracking',
        icon: '🔍',
        question: 'Why is my shipment delayed?',
        answer: 'Delays happen due to customs clearance (most common), weather, carrier capacity, or route changes. We inform you immediately if delays occur. Most customs delays resolve within 24-48 hours. We actively communicate status — if you haven\'t heard from us, your shipment is on schedule. Check your tracking number for live updates.'
    },
    {
        id: 12,
        category: 'issues',
        icon: '❌',
        question: 'What is your refund or cancellation policy?',
        answer: 'Cancellations before pickup: full refund. Cancellations during transit: subject to carrier policies (usually partial refund). Delivered shipments: no refunds (but we can issue returns shipping). Damage/loss claims: we file insurance claims and reimburse within claim settlement period. Contact us immediately for cancellations.'
    },
    {
        id: 13,
        category: 'shipping',
        icon: '📏',
        question: 'How do you calculate shipping rates?',
        answer: 'Rates are based on: weight, dimensions, distance, service level (express vs. standard), and fuel surcharges. We also consider pickup/delivery locations (rural vs. urban) and special handling needs. Get an exact quote by entering your shipment details. Rates update quarterly — your quote is valid for 30 days.'
    },
    {
        id: 14,
        category: 'basics',
        icon: '🔐',
        question: 'Is my shipment insured?',
        answer: 'Standard insurance covers 95% of declared value up to $5,000. Higher coverage available for premium. Hazardous materials have different coverage rules. Declare full value accurately for proper coverage. File claims within 30 days of delivery with photos/documentation. Most claims settle within 10-15 business days.'
    },
    {
        id: 15,
        category: 'tracking',
        icon: '📧',
        question: 'How do I get delivery notifications?',
        answer: 'Automatic notifications sent via email to your address on the shipment. Includes: pickup confirmation, customs clearance, out for delivery, delivery confirmation. Sign up for SMS notifications in your account settings. Track anytime via our website with your tracking number. Change notification preferences any time.'
    },
    {
        id: 16,
        category: 'issues',
        icon: '🎯',
        question: 'What happens if a delivery address is wrong?',
        answer: 'Caught before pickup: free address change. During transit: carrier will attempt correction (may incur charges). After delivery: we arrange re-delivery if possible. Always double-check addresses before confirming shipments. If wrong address is discovered, contact us immediately — options depend on current location.'
    },
    {
        id: 17,
        category: 'pricing',
        icon: '🚁',
        question: 'When should I use air vs ocean shipping?',
        answer: 'Use air freight: urgent shipments, high-value items, perishables, lightweight cargo. Cost: higher but arrives in 5-10 days. Use ocean freight: large volumes, heavy items, cost-sensitive, standard timelines. Cost: 70% cheaper but 2-4 weeks. Blend both (air + ocean) for medium-priority, large shipments.'
    },
    {
        id: 18,
        category: 'shipping',
        icon: '📋',
        question: 'What documentation do I need to ship internationally?',
        answer: 'Required: commercial invoice, packing list, shipper/receiver details. Customs declaration form. Certificate of origin (for preferential trade). Country-specific documents vary. We guide you on exact requirements based on origin, destination, and product type. Most documentation uploaded when creating shipment.'
    },
    {
        id: 19,
        category: 'basics',
        icon: '💳',
        question: 'What payment methods do you accept?',
        answer: 'We accept credit cards (Visa, Mastercard, Amex), bank transfers, PayPal, and company invoicing. Business accounts can arrange net-30 or net-60 terms. Prepayment required for most shipments; some account holders can pay on invoice. Select payment method during checkout.'
    },
    {
        id: 20,
        category: 'issues',
        icon: '📞',
        question: 'How fast can you respond to emergencies?',
        answer: 'Our emergency hotline: +1 858-428-7703 (24/7, no wait time for business customers). We can usually reroute or expedite shipments within 1 hour. Fastest emergency service: call directly (don\'t email). Have your tracking number ready. Not all emergencies can be resolved, but we\'ll explore every option.'
    }
];

let currentCategory = 'all';
let currentSearch = '';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    displayFeatured();
    displayFAQs();
    setupSearch();
    setupTabs();
});

function displayFeatured() {
    const featured = faqs.filter(f => f.featured).slice(0, 6);
    const grid = document.getElementById('featuredGrid');

    grid.innerHTML = featured.map(faq => `
        <div class="featured-card" onclick="scrollToFAQ(${faq.id})">
            <div class="featured-icon">${faq.icon}</div>
            <div class="featured-question">${faq.question}</div>
            <div class="featured-preview">${faq.answer.substring(0, 80)}...</div>
        </div>
    `).join('');
}

function displayFAQs() {
    const sectionsContainer = document.getElementById('faqSections');

    // Filter FAQs
    let filtered = faqs;
    if (currentCategory !== 'all') {
        filtered = filtered.filter(f => f.category === currentCategory);
    }
    if (currentSearch) {
        filtered = filtered.filter(f =>
            f.question.toLowerCase().includes(currentSearch.toLowerCase()) ||
            f.answer.toLowerCase().includes(currentSearch.toLowerCase())
        );
    }

    if (filtered.length === 0) {
        sectionsContainer.innerHTML = '<div class="no-results">No FAQs match your search. <a href="support-chat.html" style="color: var(--primary-blue);">Contact us directly</a> for help.</div>';
        return;
    }

    // Group by category
    const grouped = {};
    filtered.forEach(faq => {
        if (!grouped[faq.category]) grouped[faq.category] = [];
        grouped[faq.category].push(faq);
    });

    // Display grouped FAQs
    const categoryLabels = {
        basics: 'Basics',
        shipping: 'Shipping',
        pricing: 'Pricing',
        tracking: 'Tracking',
        issues: 'Issues & Support'
    };

    let html = '';
    Object.entries(grouped).forEach(([category, items]) => {
        html += `<div class="faq-section">
            <h2 class="section-title">${categoryLabels[category]}</h2>
            ${items.map(faq => `
                <div class="faq-item" id="faq-${faq.id}">
                    <div class="faq-question" onclick="toggleFAQ(${faq.id})">
                        <span class="faq-question-text">${faq.icon} ${faq.question}</span>
                        <div class="faq-toggle">+</div>
                    </div>
                    <div class="faq-answer" id="answer-${faq.id}">
                        ${faq.answer}
                    </div>
                </div>
            `).join('')}
        </div>`;
    });

    sectionsContainer.innerHTML = html;
}

function toggleFAQ(id) {
    const item = document.getElementById(`faq-${id}`);
    const answer = document.getElementById(`answer-${id}`);

    item.classList.toggle('open');
    answer.classList.toggle('show');
}

function scrollToFAQ(id) {
    const item = document.getElementById(`faq-${id}`);
    if (item) {
        if (!item.classList.contains('open')) {
            toggleFAQ(id);
        }
        item.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function filterByCategory(category) {
    currentCategory = category;

    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    displayFAQs();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        displayFAQs();
    });
}

function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns[0].classList.add('active');
}
