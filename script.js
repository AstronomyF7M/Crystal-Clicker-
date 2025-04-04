// Existing imports and variables
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import config from './config.js';

let crystals = parseInt(localStorage.getItem('crystals')) || 0;
let crystalMultiplier = parseInt(localStorage.getItem('crystalMultiplier')) || 1;
let autoCrystals = parseInt(localStorage.getItem('autoCrystals')) || 0;
let pickaxeLevel = parseInt(localStorage.getItem('pickaxeLevel')) || 1;
let crystalHarvesterUnlocked = localStorage.getItem('crystalHarvesterUnlocked') === 'true' || false;

const crystalCountElement = document.getElementById('crystal-count');
const crystalElement = document.getElementById('crystal');
const shopItemsElement = document.getElementById('shop-items');

// Updated shop items
const shopItems = [
    {
        name: `Pickaxe Upgrade (Level ${pickaxeLevel})`,
        cost: 10 * pickaxeLevel,
        effect: () => {
            pickaxeLevel++;
            crystalMultiplier += 1 * pickaxeLevel;
            shopItems[0].name = `Pickaxe Upgrade (Level ${pickaxeLevel})`;
            shopItems[0].cost = 10 * pickaxeLevel;
        }
    },
    {
        name: 'Unlock Crystal Harvester',
        cost: 50,
        effect: () => {
            crystalHarvesterUnlocked = true;
            autoCrystals++;
            shopItems.splice(1, 1);
        },
        condition: () => !crystalHarvesterUnlocked
    },
    {
        name: 'Mining Helmet',
        cost: 100,
        effect: () => {
            crystalMultiplier += 2;
        }
    },
    {
        name: 'Mining Boots',
        cost: 200,
        effect: () => {
            crystalMultiplier += 3;
        }
    },
    {
        name: 'Mining Gloves',
        cost: 300,
        effect: () => {
            crystalMultiplier += 4;
        }
    },
    {
        name: 'Advanced Crystal Harvester',
        cost: 500,
        effect: () => {
            autoCrystals += 5;
        }
    },
    {
        name: 'Mining Drill',
        cost: 1000,
        effect: () => {
            crystalMultiplier += 10;
        }
    },
    {
        name: 'Mining Robot',
        cost: 2000,
        effect: () => {
            autoCrystals += 20;
        }
    },
    {
        name: 'Mining Backpack',
        cost: 150,
        effect: () => {
            crystalMultiplier += 1;
        }
    },
    {
        name: 'Mining Lamp',
        cost: 120,
        effect: () => {
            crystalMultiplier += 1;
        }
    },
    {
        name: 'Mining Cart',
        cost: 800,
        effect: () => {
            autoCrystals += 10;
        }
    },
    {
        name: 'Mining Suit',
        cost: 400,
        effect: () => {
            crystalMultiplier += 5;
        }
    },
    {
        name: 'Enhanced Mining Drill',
        cost: 3000,
        effect: () => {
            crystalMultiplier += 15;
        }
    }
];

crystalElement.addEventListener('click', () => {
    crystals += crystalMultiplier;
    updateCrystalCount();
    saveGameState();
});

function updateCrystalCount() {
    crystalCountElement.textContent = `Crystals: ${crystals}`;
}

function buyItem(item) {
    if (crystals >= item.cost && (!item.condition || item.condition())) {
        crystals -= item.cost;
        item.effect();
        updateCrystalCount();
        updateShop();
        saveGameState();
    } else {
        alert('Not enough crystals!');
    }
}

function createShopItemElement(item) {
    const li = document.createElement('li');
    li.textContent = `${item.name} - Cost: ${item.cost}`;

    const button = document.createElement('button');
    button.textContent = 'Buy';
    button.addEventListener('click', () => buyItem(item));

    li.appendChild(button);
    return li;
}

function updateShop() {
    shopItemsElement.innerHTML = '';
    shopItems.forEach(item => {
        if (!item.condition || item.condition()) {
            const li = createShopItemElement(item);
            shopItemsElement.appendChild(li);
        }
    });
}

setInterval(() => {
    crystals += autoCrystals;
    updateCrystalCount();
    saveGameState();
}, 1000);

function saveGameState() {
    localStorage.setItem('crystals', crystals);
    localStorage.setItem('crystalMultiplier', crystalMultiplier);
    localStorage.setItem('autoCrystals', autoCrystals);
    localStorage.setItem('pickaxeLevel', pickaxeLevel);
    localStorage.setItem('crystalHarvesterUnlocked', crystalHarvesterUnlocked);
}

updateCrystalCount();
updateShop();

console.log(config.message);

const crystalRollCost = 1000; // Cost to roll for crystals
const crystalRollContainer = document.createElement('div');
crystalRollContainer.id = 'crystal-roll-container';

const crystalRollButton = document.createElement('button');
crystalRollButton.id = 'crystal-roll-button';
crystalRollButton.textContent = `Roll for Crystals (${crystalRollCost} Crystals)`;

const crystalRollResult = document.createElement('div');
crystalRollResult.id = 'crystal-roll-result';

crystalRollContainer.appendChild(crystalRollButton);
crystalRollContainer.appendChild(crystalRollResult);

document.getElementById('game').appendChild(crystalRollContainer);

crystalRollButton.addEventListener('click', rollForCrystals);

function rollForCrystals() {
    if (crystals >= crystalRollCost) {
        crystals -= crystalRollCost;
        const roll = Math.random();

        if (roll < 0.7) {
            // 70% chance: Small amount of crystals
            const reward = Math.floor(Math.random() * 100) + 50; // 50-150
            crystals += reward;
            crystalRollResult.textContent = `You rolled and got ${reward} crystals!`;
        } else if (roll < 0.95) {
            // 25% chance: Medium amount of crystals
            const reward = Math.floor(Math.random() * 1000) + 500; // 500-1500
            crystals += reward;
            crystalRollResult.textContent = `You rolled and got ${reward} crystals!`;
        } else if (roll < 0.999999999) {
            // 4.9999999% chance: Large amount of crystals
            const reward = Math.floor(Math.random() * 100000) + 50000; // 50000-150000
            crystals += reward;
            crystalRollResult.textContent = `JACKPOT! You rolled and got ${reward} crystals!`;
        } else {
            // 0.0000001% chance: Insane amount of crystals
            crystals += 1000000000;
            crystalRollResult.textContent = `GODLY ROLL! You rolled and got 1,000,000,000 crystals!`;
        }

        updateCrystalCount();
        saveGameState();
    } else {
        alert('Not enough crystals to roll!');
    }
}

// Make the shop scrollable
document.getElementById('shop-items').style.maxHeight = '400px';
document.getElementById('shop-items').style.overflowY = 'scroll';
