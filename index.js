const storageKey = "gameData"

buildingPriceMultiplier = 1.18;     // Math.round((building.basePrice * (buildingPriceMultiplier ** building.count)))
upgradePriceExponent = 10           // upgradePrice = building.basePrice * (upgradePriceExponent ** (Math.floor(building.count / 10)))

/*
If we want to add more new buildings, there are several steps:
1. Add buildingLevel and button-row HTML DIV elements
2. Add the building data to the gameData map (right below)
3. Copy and paste the gameData map to initializeNewGameData()
4. Set CPS using the setBaseCPS() function
5. Add building to getBuildingIndexByName(building_name)
*/

let gameData = {
    cookieCount: 0,
    cps: 0,
    buildings: [
        { id: "clicker", basePrice: 10, count: 0, baseCPS: 1, upgrades: 0},
        { id: "grandma", basePrice: 30, count: 0, baseCPS: 3, upgrades: 0},
        { id: "farm", basePrice: 100, count: 0, baseCPS: 10, upgrades: 0},
        { id: "factory", basePrice: 2000, count: 0, baseCPS: 100, upgrades: 0},
        { id: "portal", basePrice: 9000, count: 0, baseCPS: 1000, upgrades: 0}
    ],
    
    upgradeButtonList: [
        // Upgrade buttons have the form: {id: "", price: 0}

    ]
}

const cookieDiv = document.getElementById("cookie")
const cookieCountElement = document.getElementById("cookieCountNum")

function initializeNewGameData() {
    // only call when significant changes to base game data are made or when the player has no saved data
    console.log('Initializing game state')

    let gameData = {
        cookieCount: 0,
        cps: 0,
        buildings: [
            { id: "clicker", basePrice: 10, count: 0, baseCPS: 1, upgrades: 0},
            { id: "grandma", basePrice: 30, count: 0, baseCPS: 3, upgrades: 0},
            { id: "farm", basePrice: 100, count: 0, baseCPS: 10, upgrades: 0},
            { id: "factory", basePrice: 2000, count: 0, baseCPS: 100, upgrades: 0},
            { id: "portal", basePrice: 9000, count: 0, baseCPS: 1000, upgrades: 0}
        ],
        
        upgradeButtonList: [
            // Upgrade buttons have the form: {id: "", price: 0}
    
        ]
    }

    saveGame()
}

function gameLoop() {
    gameData.cookieCount += (gameData.cps / 10);
    //console.log(`CPS: ${gameData.cps}`)
    //console.log(`Incremental CPS: ${Math.round(gameData.cps / 10)}`)
    updateUI();
}

setInterval(gameLoop, 100)
setInterval(saveGame, 5000)

function updateUI() {
    // TODO: update cookie count
    // TODO: change color of price text to indicate if the player can afford a purchase
    renderCookieCount();
}

function cookieClick() {
    cookieAnimation();
    incrementCookies();    
}

function incrementCookies() {
    gameData.cookieCount += 10000000
    renderCookieCount()
}

function setCookieCount() {
    cookieCountElement.innerHTML = commaFormatting(gameData.cookieCount);
}

function cookieAnimation() {
    // const currWidth = parseInt(window.getComputedStyle(cookieDiv).width)
    // const currHeight = parseInt(window.getComputedStyle(cookieDiv).height)
    const currWidth = 300
    const currHeight= 300

    const growthConstant = 5

    cookieDiv.style.width = `${currWidth + growthConstant}px`;
    cookieDiv.style.height = `${currHeight + growthConstant}px`;

    setTimeout(() => {
        cookieDiv.style.width = `${currWidth}px`;
        cookieDiv.style.height = `${currHeight}px`;
    }, 100);    // Delay constant in ms
}

function setBaseCPS() {
    gameData.buildings[0].baseCPS = 1
    gameData.buildings[1].baseCPS = 3
    gameData.buildings[2].baseCPS = 10
    gameData.buildings[3].baseCPS = 100
    gameData.buildings[4].baseCPS = 1000
}

function renderBuildings() {
    gameData.buildings.forEach(building => {
        count = building.count;
        renderPrice(building)
        if (!count)  {
            document.getElementById(`${building.id}Count`).innerHTML = 0;
        }
        else {
            document.getElementById(`${building.id}Count`).innerHTML = commaFormatting(count);
        } 
    })
}

function renderLevels() {
    gameData.buildings.forEach(building => {
        document.getElementById(`${building.id}LevelElement`).innerHTML = `${commaFormatting(building.upgrades)}`
    })
      
}

function purchaseAttempt(building) {
    // return True or False after checking cookie amount and price
    return (gameData.cookieCount >= calculatePrice(building))
}

function calculatePrice(building) {
    return Math.round((building.basePrice * (buildingPriceMultiplier ** building.count)))
}
function renderPrice(building) {
    // intended to be called when game loaded and any purchase is made
    // used within a loop
    document.getElementById(`${building.id}Price`).innerHTML = `\$${commaFormatting(calculatePrice(building))}`
    
}

function renderCookieCount() {
    document.getElementById("cookieCountNum").innerHTML = commaFormatting(Math.floor(gameData.cookieCount));
}

function purchaseBuilding(id) {
    // primary purchasing function
    // loops over each building to search for id; we can use this loop to render each price we want to load the game or update any price
    const building = gameData.buildings.find(building => building.id === id);
    if (building) {
        if (purchaseAttempt(building)) {    // player has enough cookies to make purchase
            gameData.cookieCount -= calculatePrice(building)        // take payment
            building.count++;                                       // increase buildings
            
            setCPS();
            renderCPS();
            renderBuildings();
            renderCookieCount();
            renderUpgrade(building)
            renderUpgradeReadyText();
            saveGame();
            //renderUpgrade(building)        
        }

        else {
            // TODO UI change to show that purchase was unsuccessful
            // TODO possibly change price text to red when hovering over purchase button?
        }
        
    } else {
        console.error(`Building with id ${id} not found`);
    }
    
}

function getBuildingIndexByName(building_name) {
    switch(building_name) {
        case 'clicker':
            return 0;
            break;

        case 'grandma':
            return 1;
            break;

        case 'farm':
            return 2;
            break;

        case 'factory':
            return 3;
            break;
        
        case 'portal':
            return 4;
            break;

        default:
            return 0;
    }
}

function removeUpgradeListItem(upgradeID, upgradePrice) {
    let newUpgradeList = [];
    newUpgradeList = gameData.upgradeButtonList.filter(item => !(item.id === upgradeID && item.price === upgradePrice));
    gameData.upgradeButtonList = newUpgradeList;
}

function purchaseUpgrade(upgradeID, upgradePrice) {  
    const idx = getBuildingIndexByName(upgradeID);

    if (gameData.cookieCount >= upgradePrice) {
        gameData.buildings[idx].upgrades += 1;
        gameData.cookieCount -= upgradePrice;
        
        removeUpgradeListItem(upgradeID, upgradePrice);
        removeUpgrade(upgradeID, upgradePrice);
        renderCookieCount();
        renderLevels();
        renderUpgradeReadyText();
        setCPS();
        renderCPS();
        saveGame();
    }
    
}

function removeUpgrade(id, price) {
    // remove upgrade with matching id and price, then pop from upgrade list
    
    const upgradeElement = document.getElementById(`upgrade-${id}-${price}`);

    if (upgradeElement) {
        upgradeElement.remove();
    }
}

function printUpgradeButtonList() {
    upgradeList = gameData.upgradeButtonList

    if (!upgradeList || upgradeList.length == 0) { console.log("No upgrades in list")}

    upgradeList.forEach(upgrade => {
        console.log(`${upgrade.id} upgrade price: ${upgrade.price}`)
    })
    console.log('\n\n')
}

function renderUpgrade(building){ 
    // Only called when a building is purchased
    // Check if player has upgrade available, push to upgrade list, call renderUpgradeHelper

    if (building.count < 1 || building.count % 10 != 0) return
    if (document.getElementById(`upgrade-${building.id}-${building.upgrades}`))  { console.log('upgrade element already rendered'); return}

    // const price = building.basePrice * (10 ** (Math.floor(building.count / 10)));
    // renderUpgradeHelper(building, price)

    const upgradePrice = building.basePrice * (upgradePriceExponent ** (Math.floor(building.count / 10)))
    const upgradeID = building.id

    newUpgrade = {id: upgradeID, price: upgradePrice}
    //console.log(`${newUpgrade}, ID: ${newUpgrade.id}, PRICE: ${newUpgrade.price}`)

    if (!gameData.upgradeButtonList) {gameData.upgradeButtonList = []}  // initialize list if it does not exist
    gameData.upgradeButtonList.push(newUpgrade)
    //console.log(`Pushing upgrade for ${upgradeID} with price ${upgradePrice}`)

    renderUpgradeHelper(newUpgrade); 
}

function renderUpgradeReadyText() {    
    // Call once when the game loads and every time we purchase a building
    if (gameData.upgradeButtonList.length > 0) { document.getElementById('upgradeReadyText').innerHTML = 'Upgrade Available!' }
    else { document.getElementById('upgradeReadyText').innerHTML = '' }
    
}

function renderUpgradeOnGameLoad() {
    if (!gameData.upgradeButtonList) { return } 

    gameData.upgradeButtonList.forEach(upgrade => {
        //console.log(`${gameData.upgradeButtonList.length} upgrade available`)    
        renderUpgradeHelper(upgrade);
    })
}

function renderUpgradeHelper(upgrade) {
    const upgradeContainer = document.getElementById("upgradeContainer");
    const name = upgrade.id
    const price = upgrade.price

    // create upgrade element
    const upgradeElement = document.createElement('div');
    upgradeElement.classList.add('upgrade');
    upgradeElement.setAttribute('id', `upgrade-${upgrade.id}-${upgrade.price}`);
    //upgradeElement.setAttribute('onclick', `purchaseUpgrade(${name}, ${price})`);

    // add content
    upgradeElement.innerHTML = `
        <span class="upgrade-name">Level up: ${name}</span>
        <span class="upgrade-price">Price: ${commaFormatting(price)} cookies</span>
        <button class="upgrade-button" onclick="purchaseUpgrade('${upgrade.id}', ${upgrade.price})">Purchase</button>
    `;

    // add to container
    upgradeContainer.appendChild(upgradeElement);
    renderLevels();
}


function saveGame() {
    //console.log('Saving...')
    const stringGameData = JSON.stringify(gameData);
    localStorage.setItem(storageKey, stringGameData)   // this will override any existing stored buildings to make sure we are always keeping the latest version
}

function setCPS() {
    let cps = 0
    let buildingCPS = 0

    const building = gameData.buildings.forEach(building => {
        
        if (building.upgrades > 0) { buildingCPS = (building.count * building.baseCPS) * (2 ** building.upgrades)}
        else { buildingCPS = (building.count * building.baseCPS) }        

        cps += buildingCPS
    })
    gameData.cps = cps

}

function renderCPS() {
    document.getElementById("cpsText").innerHTML = commaFormatting(gameData.cps);
}

function commaFormatting(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

}




function loadGame() {
    const savedData = localStorage.getItem(storageKey)
    if (savedData) {
        gameData = JSON.parse(savedData)
        renderBuildings()
        renderCookieCount()
        renderLevels()
        renderUpgradeOnGameLoad()
        renderUpgradeReadyText()
        setBaseCPS()
        setCPS()
        renderCPS()        
    }
    
    else {
        console.log('Creating new save data')
        initializeNewGameData()
        loadGame()
    }
}

function clearUpgrades() {

    if (!gameData.upgradeButtonList) { return }

    gameData.upgradeButtonList.forEach(upgrade => {
        upgradeElement = document.getElementById(`upgrade-${upgrade.id}-${upgrade.price}`)
        if (upgradeElement) {
            //console.log('removing element')
            upgradeElement.remove();
        }
    })    
}

function resetGameData() {
    gameData.buildings.forEach(building => {
        building.count = 0;
        building.upgrades = 0;
    })

    clearUpgrades();

    gameData.cookieCount = 0;
    gameData.cps = 0;
    gameData.upgradeButtonList = [];
    
    saveGame();
    renderBuildings();
    renderCookieCount();
    renderLevels();
    renderCPS();
    renderUpgradeReadyText();    
}

function hardReset() {
    resetGameData()
    localStorage.clear()
    loadGame()
}

document.addEventListener("DOMContentLoaded", loadGame) 
