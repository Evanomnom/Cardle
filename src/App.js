import {StandardCards, WildCards, ClassicCards, WildLegendaryCards} from './/data'
import {mode, state, status, set, type, imageArray} from './constants'
import {useLocalStorage} from './hooks/useLocalStorage'
import {useEffect, useState} from 'react'
import { AutoSuggest } from 'react-autosuggestions'
import Guess from './components/guess'
import Modal from 'react-modal'
import {SettingsModal} from './components/settingsModal'
import {GameOverModal} from "./components/gameOverModal"
import PreCacheImg from 'react-precache-img';
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
  
  const [gameState, setGameState] = useState({[gameMode + cardSet]:state.playing})
  const [guesses, setGuesses] = useState({ [gameMode + cardSet]:[]})
  const [cardAnswer, setCardAnswer] = useState({ [gameMode + cardSet]:getCard()})
  const [cardGuess, setCardGuess] = useState({ [gameMode + cardSet]:{}})
  
  const [currentGuessText, setCurrentGuessText] = useState("")
  const [settingsChanged, setSettingsChanged] = useState(false)
  const [settingsModalIsOpen, setSettingsModalIsOpen] = useState(false)
  const [gameOverModalIsOpen, setGameOverModalIsOpen] = useState(false)
  const [guessesRemaining, setGuessesRemaining] = useState(gameLength)

  const addGuess = () => {
    let currCardGuess = cardGuess[gameMode + cardSet]
    let currCardAnswer = cardAnswer[gameMode + cardSet]
    let newGuess = [
      {type: type.set, value: currCardGuess.set, status: getAboveBelowStatus(currCardGuess.set, currCardAnswer.set)},
      {type: type.class, value: currCardGuess.cardClass, status: (currCardGuess.cardClass === currCardAnswer.cardClass) ? status.correct : status.incorrect},
      {type: type.rarity, value: currCardGuess.rarity, status: getAboveBelowStatus(currCardGuess.rarity, currCardAnswer.rarity)},
      {type: type.cost, value: currCardGuess.cost, status: getAboveBelowStatus(currCardGuess.cost, currCardAnswer.cost)},
      {type: type.attack, value: currCardGuess.attack, status: getAboveBelowStatus(currCardGuess.attack, currCardAnswer.attack)},
      {type: type.health, value: currCardGuess.health, status: getAboveBelowStatus(currCardGuess.health, currCardAnswer.health)},
    ]
    setGuesses(prevState => ({...prevState, [gameMode + cardSet]: [...prevState[gameMode+cardSet], newGuess]}))
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
    let searchedCardArr = getSearchedCard();
    if (searchedCardArr.length > 0){
      setCardGuess(prevState => ({...prevState, [gameMode + cardSet]: getSearchedCard()[0]}))
      if (cardsEqual(cardGuess, getSearchedCard()[0])) {
        addGuess()
      }
    } else {

    }
    setCurrentGuessText("")
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
    setCardAnswer(prevState => ({...prevState, [gameMode + cardSet]: getCard()}));
  }, [cards]);

  useEffect(() => {
    checkGameOver();
    console.log(guesses);
    if ([gameMode + cardSet] in guesses) {
      setGuessesRemaining(gameLength - guesses[gameMode + cardSet].length);
    } else {
      setGuessesRemaining(gameLength);
    }
  }, [guesses]);

  useEffect(() => {
    if ([gameMode + cardSet] in cardGuess) {
      if (Object.keys(cardGuess[gameMode + cardSet]).length > 0) {
        console.log(cardGuess[gameMode + cardSet])
        addGuess()
      }
    }
  }, [cardGuess])

  useEffect(() => {
    if (gameState[gameMode + cardSet] === state.won || gameState[gameMode + cardSet] === state.lost){
      setTimeout(() => {
        setGameOverModalIsOpen(true);
      }, 750)
    }
  }, [gameState])

  const setupGame = () => {
    console.log(settingsChanged)
    console.log(gameMode);
    if (settingsChanged) { 
      console.log(cardSet);
      setCards(cardSetMap[cardSet]);
      setGameLength(gameLengthMap[cardSet]);
      setGameState(prevState => ({ ...prevState, [gameMode + cardSet]: state.playing}));
      setGuesses(prevState => ({ ...prevState, [gameMode + cardSet]: [] }))
      setCardGuess(prevState => ({ ...prevState, [gameMode + cardSet]: [] }));
      setCurrentGuessText("");
      setSettingsChanged(false);
    }
  }

  const resetGame = () => {
    setCardAnswer(prevState => ({ ...prevState, [gameMode + cardSet]: getCard() }));
    setGameState(prevState => ({ ...prevState, [gameMode + cardSet]: state.playing }));
    setGuesses(prevState => ({ ...prevState, [gameMode + cardSet]: [] }))
    setCardGuess(prevState => ({ ...prevState, [gameMode + cardSet]: [] }));
    setCurrentGuessText("");
    setSettingsChanged(false);
  }

  const checkGameOver = () => {
    if ([gameMode + cardSet] in guesses && [gameMode + cardSet] in cardGuess && [gameMode + cardSet] in cardAnswer){
      if (cardsEqual(cardGuess[gameMode + cardSet], cardAnswer[gameMode + cardSet])) {
        console.log("win");
        setGameState(prevState => ({ ...prevState, [gameMode + cardSet]: state.won }));
      } else if ((gameLength - guesses[gameMode + cardSet].length) === 0) {
        console.log("loss");
        setGameState(prevState => ({ ...prevState, [gameMode + cardSet]: state.lost }));
      }
    }
  }

  const handleSettingsModalClose = () => {
    setupGame();
    setSettingsModalIsOpen(false);
  }

  const handleGameOverModalClose = () => {
    setGameOverModalIsOpen(false);
    resetGame();
  }

  const getSearchedCard = () => cards.filter(c => c.name === currentGuessText)

  const cardsEqual = (c1, c2) => {
    return ((c1.set === c2.set) && (c1.class === c2.class) && (c1.rarity === c2.rarity) && (c1.cost === c2.cost) && (c1.health === c2.health) && (c1.attack === c2.attack))
  }

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
        <div className= "pt-3 w-full px-2 text-xl lg:text-2xl md:w-4/6 lg:w-3/6 2xl:w-2/6">
          <div className='grid grid-cols-6 gap-2 md:gap-4'>
            <div>Set</div>
            <div>Class</div>
            <div>Rarity</div>
            <div>Mana</div>
            <div>Attack</div>
            <div>Health</div>
          </div>
          {([gameMode + cardSet] in guesses && guesses[gameMode + cardSet].length) > 0 && guesses[gameMode + cardSet].map(guess=>(
            <Guess guess={guess} key={guesses[gameMode + cardSet].indexOf(guess) + "_guess"} index={guesses[gameMode + cardSet].indexOf(guess)}/>
          ))}
          <form onSubmit={e => handleSubmit(e)} className={"p-0 m-0"}>
            <div className = "flex flex-row items-start justify-center pt-5">
              <div>
                <AutoSuggest name="Card" options={cards.map(o => o.name)} value = {currentGuessText} handleChange = {setCurrentGuessText}
                  styles={{
                    announcement: {display: "none"},
                    searchLabel: {display:"none"},
                    searchField: {width:"100%"},
                    suggestionsContainer: { color: "black", position: "static"}
                  }}
                />
              </div>
              <input className= "bg-blue-500 hover:bg-blue-400 transition-colors rounded-md px-4 py-2.5 text-stone-50 focus:ring-2 ring-blue-500 ml-3" type="submit" value="SUBMIT"></input>
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
      <GameOverModal
        isOpen={gameOverModalIsOpen}
        handleClose={handleGameOverModalClose}
        styles={modalStyles}
        gameMode={gameMode}
        cardSet={cardSet}
        gameState={gameState[gameMode + cardSet]}
        cardAnswer={cardAnswer[gameMode + cardSet]}
        guesses={guesses[gameMode + cardSet]}
        newGame={handleGameOverModalClose}
      />
      <PreCacheImg
        images={imageArray}
      />
    </div>
  );
}

export default App;
