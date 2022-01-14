import {StandardCards, WildCards, ClassicCards} from './/data'
import {mode, state, status, set, type} from './constants'
import {useLocalStorage} from './hooks/useLocalStorage'
import {useEffect, useState} from 'react'
import Guess from './components/guess'

function App() {
  const gameLengthMap = {[set.standard]: 8, [set.wild]: 10, [set.classic]: 5}
  const cardSetMap = { [set.standard]: StandardCards, [set.wild]: WildCards, [set.classic]: ClassicCards }

  const [gameMode, setGameMode] = useState(mode.infinite)
  const [cardSet, setCardSet] = useState(set.classic)
  const [cards, setCards] = useState(cardSetMap[cardSet])
  const [gameLength, setGameLength] = useState(gameLengthMap[cardSet])

  const getCard = () => {
    const rndI = Math.floor(Math.random() * cards.length)
    return cards[rndI]
  }
  
  const [gameState, setGameState] = useState(state.playing)
  const [guesses, setGuesses] = useState([])
  const [currentGuessText, setCurrentGuessText] = useState("")
  const [cardAnswer, setCardAnswer] = useState(getCard())

  const addGuess = (cardGuess) => {
    let newGuess = [
      {type: type.set, value: cardGuess.set, status: getAboveBelowStatus(cardGuess.set, cardAnswer.set)},
      {type: type.class, value: cardGuess.cardClass, status: (cardGuess.cardClass === cardAnswer.cardClass) ? status.correct : status.incorrect},
      {type: type.rarity, value: cardGuess.rarity, status: getAboveBelowStatus(cardGuess.rarity, cardAnswer.rarity)},
      {type: type.cost, value: cardGuess.cost, status: getAboveBelowStatus(cardGuess.cost, cardAnswer.cost)},
      {type: type.attack, value: cardGuess.attack, status: getAboveBelowStatus(cardGuess.attack, cardAnswer.attack)},
      {type: type.health, value: cardGuess.health, status: getAboveBelowStatus(cardGuess.health, cardAnswer.health)},
    ]
    console.log(newGuess)
    setGuesses(arr => [...arr, newGuess])
    console.log(guesses)
  }

  const getAboveBelowStatus = (guessValue, answerValue) => {
    let guessStatus;
    if (guessValue < answerValue) { 
      guessStatus = status.below 
    } else if (guessValue > answerValue) { 
      guessStatus = status.above 
    } else {
      guessStatus = status.correct
    }
    return guessStatus;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(cardAnswer)
    let searchedCardArr = getSearchedCard();
    if (searchedCardArr.length > 0){
      addGuess(searchedCardArr[0])
    }
  }

  const getSearchedCard = () => cards.filter(c => c.name === currentGuessText)

  return (
    <div className = "bg-stone-800 text-stone-50 font-display text-center h-screen flex flex-col items-center">
      <p className = "text-5xl pt-3">CARDLE</p>
      <div className = "pt-3 w-100 text-xl md:w-4/6 lg:w-3/6 2xl:w-2/6">
        <div className='grid grid-cols-6 gap-2 md:gap-4'>
          <div>Set</div>
          <div>Class</div>
          <div>Rarity</div>
          <div>Mana</div>
          <div>Attack</div>
          <div>Health</div>
        </div>
        {guesses.length > 0 && guesses.map(guess=>(
          <Guess guess={guess} key={guesses.indexOf(guess) + "_guess"} index={guesses.indexOf(guess)}/>
        ))}
        <form onSubmit={e => handleSubmit(e)}>
          <input className = 'text-black mr-4 p-1' value = {currentGuessText} onChange = {e => setCurrentGuessText(e.target.value)}></input>
          <input className = "border-2 border-white px-1" type="submit" value="SUBMIT"></input>
        </form>
      </div>
    </div>
  );
}

export default App;
