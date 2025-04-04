import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import config from './config.js';

let crystals = parseInt(localStorage.getItem('crystals')) || 0;
let crystalMultiplier = parseInt(localStorage.getItem('crystalMultiplier')) || 1;
let autoCrystals = parseInt(localStorage.getItem('autoCrystals')) || 0;
let ch_price = 50

function

const crystalCountElement = document.getElementById('crystal-count');
const crystalElement = document.getElementById('crystal');
const shopItemsElement = document.getElementById('shop-items');

const shopItems = 
    { name: 'Shiny Pickaxe', cost: 10, effect: () => crystalMultiplier++ },
    { name: 'Crystal Harvester', cost: 50, effect: () => autoCrystals++ },
    { name: 'Hammer', cost: 100, effect: () => crystalMultiplier += 5 },
    { name: 'Laser Drill', cost: 150, effect: () => crystalMultiplier += 10 },
    { name: 'Drill Rig', cost: 200, effect: () => crystalMultiplier += 20 },
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
    if (crystals >= item.cost) {
        crystals -= item.cost;
        item.effect();
        updateCrystalCount();
        updateShop();
        saveGameState();
    } else {
        alert('Not Enough Crystals 😡!');
    }
}

function createShopItemElement(item) {
    const li = document.createElement('li');
    li.textContent = `${item.name} - Cost: ${item.cost}`;

    const <button>file:///media/fuse/drivefs-1094f8a6f5c3555bedfef165a0b8b35c/root/New%20Piskel%20(7).png = document.createElement('button');
    button.textContent = 'Buy';
    button.addEventListener('click', () => buyItem(item));

    li.appendChild(button);
    return li;
}

function updateShop() {
    shopItemsElement.innerHTML = '';
    shopItems.forEach(item => {
        const li = createShopItemElement(item);
        shopItemsElement.appendChild(li);
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
}

updateCrystalCount();
updateShop();

console.log(config.message);
