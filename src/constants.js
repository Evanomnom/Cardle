export const mode = {
    daily: "Daily",
    infinite: "Infinite"
}

export const modeArray = [mode.daily, mode.infinite]

export const set = {
    standard: "Standard",
    wildlegend: "Wild Legendaries",
    wild: "Wild",
    classic: "Classic"
}

export const setArray = [set.standard, set.wild, set.classic, set.wildlegend]

export const state = {
    playing: "playing",
    won: "won",
    lost: "lost"
}

export const status = {
    correct: 'correct',
    above: 'above',
    below: 'below',
    incorrect: 'incorrect'
}

export const type = {
    set: "Set",
    class: "Class",
    rarity: "Rarity",
    cost: "Cost",
    attack: "Attack",
    health: "Health"
}

const imgArr = []
const classes = ["Neutral", "DemonHunter", "Druid", "Hunter", "Mage", "Neutral", "Paladin", "Priest", "Rogue", "Shaman"]

for (let i = 0; i < 5; i++){
    imgArr.push("/rarity/" + i + ".png");
}

classes.map((cla) => {
    imgArr.push("/classes/" + cla + ".png");
})

for (let i = -1; i < 25; i++) {
    imgArr.push("/sets/" + i + ".png");
}

imgArr.push("/victory.png")
imgArr.push("/defeat.png")

console.log(imgArr);

export const imageArray = imgArr