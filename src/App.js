import {StandardCards, WildCards, ClassicCards, WildLegendaryCards} from './/data'
import {mode, state, status, set, type} from './constants'
import {useLocalStorage} from './hooks/useLocalStorage'
import {useEffect, useState} from 'react'
import { AutoSuggest } from 'react-autosuggestions'
import Guess from './components/guess'
import Modal from 'react-modal'
import {SettingsModal} from './components/settingsModal'
import { Switch, RadioGroup } from '@headlessui/react'

function App() {
  const gameLengthMap = {[set.standard]: 6, [set.wild]: 9, [set.classic]: 5, [set.wildlegend]: 6}
  const cardSetMap = { [set.standard]: StandardCards, [set.wild]: WildCards, [set.classic]: ClassicCards, [set.wildlegend]: WildLegendaryCards }

  const [gameMode, setGameMode] = useState(mode.infinite)
  const [cardSet, setCardSet] = useState(set.standard)
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
  const [settingsModalIsOpen, setSettingsModalIsOpen] = useState(false)
  const [settingsChanged, setSettingsChanged] = useState(false)

  const addGuess = (cardGuess) => {
    let newGuess = [
      {type: type.set, value: cardGuess.set, status: getAboveBelowStatus(cardGuess.set, cardAnswer.set)},
      {type: type.class, value: cardGuess.cardClass, status: (cardGuess.cardClass === cardAnswer.cardClass) ? status.correct : status.incorrect},
      {type: type.rarity, value: cardGuess.rarity, status: getAboveBelowStatus(cardGuess.rarity, cardAnswer.rarity)},
      {type: type.cost, value: cardGuess.cost, status: getAboveBelowStatus(cardGuess.cost, cardAnswer.cost)},
      {type: type.attack, value: cardGuess.attack, status: getAboveBelowStatus(cardGuess.attack, cardAnswer.attack)},
      {type: type.health, value: cardGuess.health, status: getAboveBelowStatus(cardGuess.health, cardAnswer.health)},
    ]
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
    } else {

    }
  }

  const changeGameMode = (gameMode) => {
    setGameMode(gameMode);
    setSettingsChanged(true);
  }

  const changeCardSet = (cardSet) => {
    setCardSet(cardSet);
    setSettingsChanged(true);
  }

  useEffect(() => {
    setCardAnswer(getCard());
    console.log()
  }, [cards]);

  const setupGame = () => {
    console.log(settingsChanged)
    console.log(gameMode);
    if (settingsChanged) { 
      console.log(cardSet);
      setCards(cardSetMap[cardSet]);
      setGameLength(gameLengthMap[cardSet]);
      setGameState(state.playing);
      setCurrentGuessText("");
      setGuesses([]);
      setSettingsChanged(false);
    }
  }

  const handleSettingsModalClose = () => {
    setupGame();
    setSettingsModalIsOpen(false)
  }

  const getSearchedCard = () => cards.filter(c => c.name === currentGuessText)

  const modalStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#1c1917',
      zIndex: 99,
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      fontFamily: 'Belwe',
      transform: 'translate(-50%, -50%)',
      height: 'calc(100% - 2rem)',
      width: 'calc(100% - 2rem)',
      backgroundColor: '#292524',
      border: '.25rem #44403c solid',
      borderRadius: '1rem',
      maxWidth: '475px',
      maxHeight: '650px',
      position: 'relative',
    },
  }

  Modal.setAppElement('#root')

  return (
    <div>
      <div className = "bg-stone-800 text-stone-50 font-display text-center flex flex-col min-h-screen items-center">
        <div className="flex flex-row align-center justify-between px-2 pt-3 w-full text-xl lg:text-2xl lg:w-4/6 xl:w-3/6">
          <div className="w-12"><img src="/icons/menu.png" className="icon" onClick={()=>(setSettingsModalIsOpen(true))}/></div>
          <div className="text-5xl">CARDLE</div>
          <div className="w-12"><img src="/icons/info.png" className="icon" /></div>
        </div>
        <div className= "pt-3 px-2 w-full text-xl lg:text-2xl md:w-4/6 lg:w-3/6 2xl:w-2/6">
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
            <div className = "flex flex-row items-start justify-center pt-5">
              <div>
                <AutoSuggest name="Card" options={cards.map(o => o.name)} value = {currentGuessText} handleChange = {setCurrentGuessText}
                  styles={{
                    searchLabel: {display:"none"},
                    suggestionsContainer: { color: "black", position: "static"}
                  }}
                />
              </div>
              <input className = "border-2 border-white rounded-md p-2 ml-4" type="submit" value="SUBMIT"></input>
            </div>
          </form>
        </div>
      </div>
      <SettingsModal
          isOpen={settingsModalIsOpen}
          handleClose={handleSettingsModalClose}
          styles={modalStyles}
          gameMode={gameMode}
          cardSet={cardSet}
          changeCardSet={changeCardSet}
          changeGameMode={changeGameMode}
        />
    </div>
  );
}

export default App;
