// Mock data for airdrops
const airdrops = [
    {
        name: "Jupiter",
        symbol: "JUP",
        description: "Revolutionary DeFi platform with innovative tokenomics",
        value: "$500",
        platform: "Solana",
        status: "Active",
        icon: "🚀",
        isFeatured: true
    },
    {
        name: "Ethereum",
        symbol: "ETH",
        description: "Leading smart contract platform airdrop",
        value: "$1000",
        platform: "Ethereum",
        status: "Active",
        icon: "⚡",
        isFeatured: true
    },
    {
        name: "Solana",
        symbol: "SOL",
        description: "High-performance blockchain rewards",
        value: "$750",
        platform: "Solana",
        status: "Active",
        icon: "💫",
        isFeatured: true
    }
];

// Mock crypto prices for WebSocket simulation
const cryptoPrices = {
    BITCOIN: { price: 65000, change: 2.5 },
    ETHEREUM: { price: 3500, change: 1.8 },
    SOLANA: { price: 120, change: 4.2 }
};

// User data management
let userData = JSON.parse(localStorage.getItem('userData')) || {
    username: 'Demo User',
    claimedAirdrops: 0,
    totalValue: 0
};

// Create airdrop cards
function createAirdropCard(airdrop) {
    return `
        <div class="airdrop-card">
            <div class="card-header">
                <div class="token-icon">${airdrop.icon}</div>
                <div class="token-info">
                    <h3>${airdrop.name}</h3>
                    <p>${airdrop.symbol}</p>
                </div>
                ${airdrop.isFeatured ? '<span class="badge">Featured</span>' : ''}
            </div>
            <div class="card-content">
                <p>${airdrop.description}</p>
                <div class="stats-grid">
                    <div class="stat">
                        <span class="label">Value</span>
                        <span class="value">${airdrop.value}</span>
                    </div>
                    <div class="stat">
                        <span class="label">Platform</span>
                        <span class="value">${airdrop.platform}</span>
                    </div>
                </div>
                <div class="status">
                    <div class="status-dot"></div>
                    <span>${airdrop.status}</span>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn-secondary">Details</button>
                <button class="btn-primary" onclick="claimAirdrop('${airdrop.name}', '${airdrop.value}')">Join</button>
            </div>
        </div>
    `;
}

// Initialize airdrop carousel
function initializeAirdropCarousel() {
    const carousel = document.querySelector('.airdrop-carousel');
    if (carousel) {
        carousel.innerHTML = airdrops.map(airdrop => createAirdropCard(airdrop)).join('');
    }
}

// Claim airdrop functionality
function claimAirdrop(name, value) {
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
    userData.claimedAirdrops += 1;
    userData.totalValue += numericValue;
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Show toast notification
    showToast(`Claimed ${name} airdrop worth ${value}!`);
}

// Simple toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Simulate WebSocket connection for real-time price updates
function simulateWebSocket() {
    setInterval(() => {
        Object.keys(cryptoPrices).forEach(symbol => {
            const change = (Math.random() - 0.5) * 2;
            cryptoPrices[symbol].price *= (1 + change/100);
            cryptoPrices[symbol].change = change;
            updatePriceDisplay(symbol);
        });
    }, 5000);
}

// Update price display
function updatePriceDisplay(symbol) {
    const price = cryptoPrices[symbol];
    // Add price update logic here if needed
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeAirdropCarousel();
    simulateWebSocket();
});
