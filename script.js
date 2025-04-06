// Modal Management and Initial Setup for Settings
const settingsModal = document.getElementById('settings-modal');
const creditsModal = document.getElementById('credits-modal');
const settingsBtn = document.getElementById('settings-btn');
const creditsBtn = document.getElementById('credits-btn');
const volumeSlider = document.getElementById('volume-slider');
const brightnessSlider = document.getElementById('brightness-slider');
const volumeValue = document.getElementById('volume-value');
const brightnessValue = document.getElementById('brightness-value');
const saveSettingsBtn = document.getElementById('save-settings');
let glitchActive = false;
let glitchEndTime = 0;

// Settings Management with default values that reset on page load
let settings = {
    volume: 30,
    brightness: 100
};

// Update UI to reflect settings
function updateSettingsDisplay() {
    volumeValue.textContent = `${volumeSlider.value}%`;
    brightnessValue.textContent = `${brightnessSlider.value}%`;
}

// Apply settings to the game
function applySettings() {
    const backgroundMusic = document.getElementById('background-music');
    if (backgroundMusic) {
        backgroundMusic.volume = settings.volume / 100;
    }
    document.body.style.filter = `brightness(${settings.brightness}%)`;
}

// Event Listeners
settingsBtn.addEventListener('click', () => {
    // Reset sliders to default values when opening settings
    volumeSlider.value = settings.volume;
    brightnessSlider.value = settings.brightness;
    updateSettingsDisplay();
    settingsModal.style.display = 'flex';
});

creditsBtn.addEventListener('click', () => {
    creditsModal.style.display = 'flex';
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === settingsModal) settingsModal.style.display = 'none';
    if (e.target === creditsModal) creditsModal.style.display = 'none';
});

volumeSlider.addEventListener('input', updateSettingsDisplay);
brightnessSlider.addEventListener('input', updateSettingsDisplay);

saveSettingsBtn.addEventListener('click', () => {
    settings.volume = parseInt(volumeSlider.value);
    settings.brightness = parseInt(brightnessSlider.value);
    applySettings();
    settingsModal.style.display = 'none';
});

// Initialize default settings on page load
window.addEventListener('DOMContentLoaded', () => {
    volumeSlider.value = settings.volume;
    brightnessSlider.value = settings.brightness;
    updateSettingsDisplay();
    applySettings();
});

// Shop items data
const shopItems = [
    { id: 'pickaxe', name: 'Pickaxe', baseCost: 15, count: 0, multiplier: 2 },
    { id: 'crystalMiner', name: 'Crystal Miner', baseCost: 100, count: 0, cps: 1 },
    { id: 'crystalFactory', name: 'Crystal Factory', baseCost: 1100, count: 0, cps: 8 },
    { id: 'crystalLab', name: 'Crystal Lab', baseCost: 12000, count: 0, cps: 47 },
    { id: 'crystalPortal', name: 'Crystal Portal', baseCost: 130000, count: 0, cps: 260 },
    { id: 'crystalDimension', name: 'Crystal Dimension', baseCost: 1400000, count: 0, cps: 1400 }
];

// Game state
let crystals = 0;
let totalCPS = 0;
let rebirths = 0;

// Rebirth configuration
const rebirthCost = 100000; 
const rebirthMultiplier = 2; 

// Save game state to local storage
function saveGame() {
    localStorage.setItem('crystalClickerCrystals', JSON.stringify(crystals));
    localStorage.setItem('crystalClickerShopItems', JSON.stringify(shopItems));
    localStorage.setItem('crystalClickerRebirths', JSON.stringify(rebirths));
}

// Load game state from local storage
function loadGame() {
    const savedCrystals = localStorage.getItem('crystalClickerCrystals');
    const savedShopItems = localStorage.getItem('crystalClickerShopItems');
    const savedRebirths = localStorage.getItem('crystalClickerRebirths');

    if (savedCrystals) {
        crystals = JSON.parse(savedCrystals);
    }

    if (savedShopItems) {
        const loadedShopItems = JSON.parse(savedShopItems);
        loadedShopItems.forEach((loadedItem, index) => {
            shopItems[index].count = loadedItem.count;
        });
    }

    if (savedRebirths) {
        rebirths = JSON.parse(savedRebirths);
    }
}

function startGlitch() {
    glitchActive = true;
    glitchEndTime = Date.now() + 30000;
    document.body.classList.add('glitch-effect');
    document.getElementById('secret-button').style.opacity = '1';
    
    // 8x boost
    const shopBoost = shopItems.map(item => {
        if (item.cps) item.cps *= 8;
        if (item.multiplier) item.multiplier *= 8;
        return item;
    });
    
    setTimeout(() => {
        glitchActive = false;
        document.body.classList.remove('glitch-effect');
        // Reset boost
        shopItems.forEach(item => {
            if (item.cps) item.cps /= 8;
            if (item.multiplier) item.multiplier /= 8;
        });
    }, 30000);
}

// Initialize game
function initGame() {
    const secretButton = document.createElement('button');
    secretButton.id = 'secret-button';
    secretButton.style.position = 'fixed';
    secretButton.style.bottom = '10px';
    secretButton.style.left = '10px';
    secretButton.style.width = '50px';
    secretButton.style.height = '50px';
    secretButton.style.opacity = '0';
    secretButton.style.zIndex = '9999';
    secretButton.onclick = startGlitch;
    document.body.appendChild(secretButton);

    // loadGame(); // Load game after loading screen is complete

    // Hide the loading screen and show the menu
    document.getElementById('loading-screen').style.display = 'none';
    document.getElementById('menu').style.display = 'flex';

    // Add event listeners to menu buttons
    document.getElementById('start-button').addEventListener('click', startGame);
    showRandomHint();
}

function startGame() {
    // Hide the menu and show the game
    document.getElementById('menu').style.display = 'none';
    document.getElementById('app').style.display = 'flex';
    loadGame();
    setInterval(updateGame, 1000);
    updateDisplay();
}

// Update game state
function updateGame() {
    totalCPS = shopItems.reduce((sum, item) => {
        if(item.cps) {
            return sum + (item.count * item.cps);
        }
        return sum;
    }, 0);
    crystals += totalCPS;
    updateDisplay();
    saveGame();
}

// Update display
function updateDisplay() {
    const shopItemsList = document.getElementById('shop-items');
    shopItemsList.innerHTML = '';
    
    shopItems.forEach(item => {
        const currentCost = Math.floor(item.baseCost * Math.pow(1.15, item.count));
        const li = document.createElement('li');
        if(item.id === 'pickaxe') {
            li.innerHTML = `
                <span>${item.name} (${item.count})</span>
                <button onclick="buyItem('${item.id}')" ${crystals < currentCost ? 'disabled' : ''}>
                    ${currentCost} Crystals
                </button>
            `;
        } else {
            li.innerHTML = `
                <span>${item.name} (${item.count})</span>
                <button onclick="buyItem('${item.id}')" ${crystals < currentCost ? 'disabled' : ''}>
                    ${currentCost} Crystals
                </button>
            `;
        }
        shopItemsList.appendChild(li);
    });
    document.getElementById('crystal-count').textContent = `Crystals: ${Math.floor(crystals)}`;
    const rebirthContainer = document.getElementById('rebirth-container');
    rebirthContainer.innerHTML = '';

    const rebirthButton = document.createElement('button');
    rebirthButton.textContent = `Rebirth (${rebirths}) - ${rebirthCost} Crystals`;
    rebirthButton.onclick = rebirth;
    rebirthButton.disabled = crystals < rebirthCost;
    rebirthContainer.appendChild(rebirthButton);
}

function buyItem(itemId) {
    const item = shopItems.find(i => i.id === itemId);
    const cost = Math.floor(item.baseCost * Math.pow(1.15, item.count));
    
    if (crystals >= cost) {
        crystals -= cost;
        item.count++;
        updateDisplay();
        saveGame(); 
    }
}

function showRandomHint() {
    const hints = document.querySelectorAll('#hints div');
    const visibleHint = Math.floor(Math.random() * hints.length);
    
    hints.forEach(hint => hint.style.display = 'none');
    hints[visibleHint].style.display = 'block';
    
    setTimeout(() => {
        hints[visibleHint].style.display = 'none';
    }, 5000);
    
    // More frequent hints if they haven't found the secret
    const hintInterval = document.getElementById('secret-button').style.opacity === '1' 
        ? 60000 
        : 30000;
    setTimeout(showRandomHint, hintInterval);
}

// Crystal click handler
document.getElementById('crystal').addEventListener('click', () => {
    const crystalImage = document.getElementById('crystal');
    crystalImage.classList.add('clicked');

    let clickValue = 1;
    shopItems.forEach(item => {
        if(item.id === 'pickaxe') {
            clickValue += (item.count * item.multiplier)
        }
    })
    
    clickValue *= Math.pow(rebirthMultiplier, rebirths); 
    crystals += clickValue;
    updateDisplay();
    saveGame(); 
});

// Rebirth function
function rebirth() {
    if (crystals >= rebirthCost) {
        crystals = 0; 
        rebirths++; 

        shopItems.forEach(item => {
            item.count = 0;
        });

        updateDisplay();
        saveGame(); 
    } else {
        alert("Not enough crystals to rebirth!");
    }
}

// Initialize the game when the page loads
window.onload = function() {
    // Simulate loading time
    setTimeout(initGame, 2000);
    
    window.buyItem = buyItem;
};
