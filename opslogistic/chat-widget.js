// OPS Logistics Support Chat Widget
// Include this in your HTML: <script src="chat-widget.js"></script>

(function() {
  const API_URL = '/api/support';
  const WIDGET_ID = 'ops-chat-widget';
  const CHAT_OPEN_KEY = 'ops-chat-open';

  // Create and inject the widget HTML
  function initializeWidget() {
    // Create container
    const container = document.createElement('div');
    container.id = WIDGET_ID;
    container.innerHTML = `
      <div class="ops-chat-widget">
        <div class="ops-chat-button" id="ops-chat-toggle">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span class="ops-chat-label">Help</span>
          <span class="ops-chat-badge" id="ops-chat-badge" style="display: none;">1</span>
        </div>

        <div class="ops-chat-window" id="ops-chat-window">
          <div class="ops-chat-header">
            <h3>OPS Support</h3>
            <button id="ops-chat-close" class="ops-chat-close">×</button>
          </div>

          <div class="ops-chat-content" id="ops-chat-content">
            <!-- Quick options -->
            <div class="ops-quick-options">
              <button class="ops-quick-btn" data-action="faq">View FAQs</button>
              <button class="ops-quick-btn" data-action="search">Search</button>
              <button class="ops-quick-btn" data-action="contact">Contact Us</button>
              <button class="ops-quick-btn" data-action="track">Track Shipment</button>
            </div>
          </div>

          <div class="ops-chat-footer">
            <input
              type="text"
              id="ops-chat-input"
              placeholder="Type your question..."
              class="ops-chat-input"
            >
            <button id="ops-chat-send" class="ops-chat-send">Send</button>
          </div>
        </div>
      </div>

      <style>
        #${WIDGET_ID} * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .ops-chat-widget {
          font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 9999;
        }

        .ops-chat-button {
          width: 60px;
          height: 60px;
          background: #0055CC;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: all 0.3s;
          position: relative;
        }

        .ops-chat-button:hover {
          background: #0047A3;
          box-shadow: 0 6px 16px rgba(0,0,0,0.2);
          transform: scale(1.05);
        }

        .ops-chat-button svg {
          width: 28px;
          height: 28px;
          stroke: white;
        }

        .ops-chat-label {
          position: absolute;
          bottom: -30px;
          right: 0;
          background: #333;
          color: white;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          font-size: 0.85rem;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s;
        }

        .ops-chat-button:hover .ops-chat-label {
          opacity: 1;
        }

        .ops-chat-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #e74c3c;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .ops-chat-window {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 380px;
          height: 500px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
          opacity: 0;
          pointer-events: none;
          transform: scale(0.95) translateY(10px);
          transition: all 0.3s;
        }

        .ops-chat-window.open {
          opacity: 1;
          pointer-events: auto;
          transform: scale(1) translateY(0);
        }

        .ops-chat-header {
          background: linear-gradient(135deg, #0055CC 0%, #003A70 100%);
          color: white;
          padding: 1rem;
          border-radius: 12px 12px 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(0,0,0,0.1);
        }

        .ops-chat-header h3 {
          font-size: 1rem;
          font-weight: 700;
        }

        .ops-chat-close {
          background: transparent;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ops-chat-close:hover {
          background: rgba(255,255,255,0.2);
          border-radius: 4px;
        }

        .ops-chat-content {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
        }

        .ops-quick-options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .ops-quick-btn {
          background: #f0f4f8;
          border: 1px solid #ddd;
          padding: 0.75rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 600;
          color: #003A70;
          transition: all 0.3s;
        }

        .ops-quick-btn:hover {
          background: #0055CC;
          color: white;
          border-color: #0055CC;
        }

        .ops-message {
          margin-bottom: 1rem;
          animation: slideIn 0.3s;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .ops-message.user {
          text-align: right;
        }

        .ops-message-content {
          display: inline-block;
          padding: 0.75rem 1rem;
          border-radius: 6px;
          font-size: 0.9rem;
          line-height: 1.4;
          max-width: 80%;
          word-wrap: break-word;
        }

        .ops-message.user .ops-message-content {
          background: #0055CC;
          color: white;
        }

        .ops-message.bot .ops-message-content {
          background: #f0f4f8;
          color: #333;
        }

        .ops-chat-footer {
          display: flex;
          gap: 0.5rem;
          padding: 1rem;
          border-top: 1px solid #eee;
          background: #f9f9f9;
          border-radius: 0 0 12px 12px;
        }

        .ops-chat-input {
          flex: 1;
          padding: 0.5rem 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: inherit;
          font-size: 0.9rem;
        }

        .ops-chat-input:focus {
          outline: none;
          border-color: #0055CC;
          box-shadow: inset 0 0 0 2px rgba(0,85,204,0.1);
        }

        .ops-chat-send {
          background: #0055CC;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.3s;
        }

        .ops-chat-send:hover {
          background: #0047A3;
        }

        .ops-faq-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .ops-faq-item {
          background: #f9f9f9;
          border-bottom: 1px solid #e0e0e0;
          padding: 0.75rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 0.85rem;
        }

        .ops-faq-item:hover {
          background: #f0f4f8;
          border-left-color: #003A70;
        }

        @media (max-width: 600px) {
          .ops-chat-window {
            width: calc(100vw - 40px);
            height: 70vh;
            bottom: 80px;
            right: 20px;
          }

          .ops-quick-options {
            grid-template-columns: 1fr;
          }
        }
      </style>
    `;

    document.body.appendChild(container);
    setupListeners();
  }

  // Setup event listeners
  function setupListeners() {
    const toggle = document.getElementById('ops-chat-toggle');
    const closeBtn = document.getElementById('ops-chat-close');
    const window = document.getElementById('ops-chat-window');
    const sendBtn = document.getElementById('ops-chat-send');
    const input = document.getElementById('ops-chat-input');

    // Toggle window
    toggle.addEventListener('click', () => {
      window.classList.toggle('open');
      localStorage.setItem(CHAT_OPEN_KEY, window.classList.contains('open'));
    });

    closeBtn.addEventListener('click', () => {
      window.classList.remove('open');
      localStorage.setItem(CHAT_OPEN_KEY, 'false');
    });

    // Send message
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });

    // Quick action buttons
    document.querySelectorAll('.ops-quick-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const action = e.target.getAttribute('data-action');
        await handleQuickAction(action);
      });
    });

    // Restore window state
    if (localStorage.getItem(CHAT_OPEN_KEY) === 'true') {
      window.classList.add('open');
    }

    // Load initial FAQs
    loadFAQs();
  }

  // Handle quick actions
  async function handleQuickAction(action) {
    const content = document.getElementById('ops-chat-content');

    switch (action) {
      case 'faq':
        await loadFAQs();
        break;
      case 'search':
        content.innerHTML = `
          <div style="padding: 0.5rem 0;">
            <input type="text" id="widget-search" placeholder="Search..." style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; font-size: 0.85rem;">
          </div>
        `;
        document.getElementById('widget-search').addEventListener('input', searchFAQs);
        break;
      case 'contact':
        showContactForm();
        break;
      case 'track':
        window.open('https://opslogistic.com/track', '_blank');
        break;
    }
  }

  // Load FAQs
  async function loadFAQs() {
    try {
      const response = await fetch(`${API_URL}/faqs`);
      const faqs = await response.json();

      const content = document.getElementById('ops-chat-content');
      content.innerHTML = `
        <div class="ops-faq-list">
          ${faqs.map(faq => `
            <div class="ops-faq-item" onclick="alert('${faq.answer.replace(/'/g, "\\'")}')">
              <strong>Q:</strong> ${faq.question}
            </div>
          `).join('')}
        </div>
      `;
    } catch (err) {
      console.error('Failed to load FAQs:', err);
    }
  }

  // Search FAQs
  async function searchFAQs() {
    const query = document.getElementById('widget-search')?.value || '';

    if (query.length < 2) {
      loadFAQs();
      return;
    }

    try {
      const response = await fetch(`${API_URL}/search?query=${encodeURIComponent(query)}`);
      const results = await response.json();

      const content = document.getElementById('ops-chat-content');
      if (results.length === 0) {
        content.innerHTML = '<p style="text-align: center; color: #999; padding: 1rem;">No results found</p>';
        return;
      }

      content.innerHTML = `
        <div class="ops-faq-list">
          ${results.map(r => `
            <div class="ops-faq-item">
              <strong>${r.title}</strong>
              <p style="font-size: 0.8rem; color: #666; margin-top: 0.25rem;">${r.description || 'Click to view'}</p>
            </div>
          `).join('')}
        </div>
      `;
    } catch (err) {
      console.error('Search failed:', err);
    }
  }

  // Show contact form
  function showContactForm() {
    const content = document.getElementById('ops-chat-content');
    content.innerHTML = `
      <form id="widget-contact-form" style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.85rem;">
        <input type="text" placeholder="Your name" id="widget-name" required style="padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
        <input type="email" placeholder="Your email" id="widget-email" required style="padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
        <select id="widget-category" style="padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
          <option value="shipping">Shipping</option>
          <option value="tracking">Tracking</option>
          <option value="pricing">Pricing</option>
          <option value="account">Account</option>
          <option value="other">Other</option>
        </select>
        <textarea placeholder="Your message..." id="widget-message" required style="padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; resize: none; min-height: 60px;"></textarea>
      </form>
    `;
  }

  // Send message
  async function sendMessage() {
    const input = document.getElementById('ops-chat-input');
    const message = input.value.trim();

    if (!message) return;

    // Display user message
    const content = document.getElementById('ops-chat-content');
    const userMsg = document.createElement('div');
    userMsg.className = 'ops-message user';
    userMsg.innerHTML = `<div class="ops-message-content">${message}</div>`;
    content.appendChild(userMsg);

    input.value = '';

    // Simulate bot response
    setTimeout(() => {
      const botMsg = document.createElement('div');
      botMsg.className = 'ops-message bot';
      botMsg.innerHTML = `<div class="ops-message-content">Thanks for reaching out! Our team will get back to you soon. Visit https://opslogistic.com/support-chat for more help.</div>`;
      content.appendChild(botMsg);
      content.scrollTop = content.scrollHeight;
    }, 500);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWidget);
  } else {
    initializeWidget();
  }
})();
