import { StandardCards, WildCards, ClassicCards, WildLegendaryCards } from './/data'

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

let setArr = [set.standard, set.wild, set.classic, set.wildlegend]
export const setArray = setArr

let initDates = {}
setArr.forEach(elem => initDates[elem] = new Date('August 19, 1975 23:15:30'));
export const initialDates = initDates;

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


export const gameLength = { [set.standard]: 7, [set.wild]: 9, [set.classic]: 5, [set.wildlegend]: 7 }
export const cards = { [set.standard]: StandardCards, [set.wild]: WildCards, [set.classic]: ClassicCards, [set.wildlegend]: WildLegendaryCards }
export const initialStats = { "played": 0, "won": 0, "currStreak": 0, "maxStreak": 0 }


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