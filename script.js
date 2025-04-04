import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import config from './config.js';

let crystals = parseInt(localStorage.getItem('crystals')) || 0;
let crystalMultiplier = parseInt(localStorage.getItem('crystalMultiplier')) || 1;
let autoCrystals = parseInt(localStorage.getItem('autoCrystals')) || 0;

const crystalCountElement = document.getElementById('crystal-count');
const crystalElement = document.getElementById('crystal');
const shopItemsElement = document.getElementById('shop-items');

const shopItems = [
    { name: 'Shiny Pickaxe', cost: 10, effect: () => crystalMultiplier++, increaseCost: () => crystalMultiplier *= 2 },
    { name: 'Crystal Harvester', cost: 50, effect: () => autoCrystals++, increaseCost: () => autoCrystals *= 2 },
    { name: 'Hammer', cost: 100, effect: () => crystalMultiplier += 5, increaseCost: () => crystalMultiplier += 10 },
    { name: 'Laser Drill', cost: 150, effect: () => crystalMultiplier += 10, increaseCost: () => crystalMultiplier += 20 },
    { name: 'Drill Rig', cost: 200, effect: () => crystalMultiplier += 20, increaseCost: () => crystalMultiplier += 40 },
];

function updateCrystalCount() {
    crystalCountElement.textContent = `Crystals: ${crystals}`;
}

function buyItem(item) {
    if (crystals >= item.cost) {
        crystals -= item.cost;
        item.effect();
        item.cost = Math.floor(item.cost * 1.5); // Increase the cost by 50% each time it is bought
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

    const button = document.createElement('button');
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

function saveGameState() {
    localStorage.setItem('crystals', crystals);
    localStorage.setItem('crystalMultiplier', crystalMultiplier);
    localStorage.setItem('autoCrystals', autoCrystals);
    localStorage.setItem('shopItems', JSON.stringify(shopItems)); // Save the updated shop items
}

function autoIncrementCrystals() {
    crystals += autoCrystals;
    updateCrystalCount();
    saveGameState();
}

crystalElement.addEventListener('click', () => {
    crystals += crystalMultiplier;
    updateCrystalCount();
    saveGameState();
});

setInterval(autoIncrementCrystals, 1000);

updateCrystalCount();
updateShop();

console.log(config.message);
