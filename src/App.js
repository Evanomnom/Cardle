import {mode, state, status, set, type, imageArray, initialDates, initialStats, cards, gameLength} from './constants'
import {useLocalStorage} from './hooks/useLocalStorage'
import useDidMountEffect from './hooks/useDidMountEffect'
import {useEffect, useState} from 'react'
import { AutoSuggest } from 'react-autosuggestions'
import Guess from './components/guess'
import Modal from 'react-modal'
import {SettingsModal} from './components/settingsModal'
import {GameOverModal} from "./components/gameOverModal"
import PreCacheImg from 'react-precache-img';

function App() {
  const [gameMode, setGameMode] = useLocalStorage('stateGameMode', mode.infinite)
  const [cardSet, setCardSet] = useLocalStorage('stateCardSet', set.standard)
  
  const [gameState, setGameState] = useLocalStorage('stateGameState', {[gameMode + cardSet]:state.playing})
  const [guesses, setGuesses] = useLocalStorage('stateGuesses', [])
  const [cardAnswer, setCardAnswer] = useLocalStorage('stateCardAnswer', {})
  const [cardGuess, setCardGuess] = useLocalStorage('stateCardGuess', {})
  const [dailyDates, setDailyDates] = useLocalStorage('stateDailyDates', initialDates)
  const [stats, setStats] = useLocalStorage('stateStats', {[gameMode+cardSet]:initialStats})

  const [currentGuessText, setCurrentGuessText] = useState("")
  const [settingsChanged, setSettingsChanged] = useState(false)
  const [settingsModalIsOpen, setSettingsModalIsOpen] = useState(false)
  const [gameOverModalIsOpen, setGameOverModalIsOpen] = useState(false)
  const [guessesRemaining, setGuessesRemaining] = useState(gameLength[cardSet])

  const getCard = (set) => {
    const rndI = Math.floor(Math.random() * cards[set].length)
    return cards[set][rndI]
  }

  const getDailyCard = (set) => {
    const today = new Date();
    const ind = ((today.getFullYear() * 10000) + (today.getMonth() * 100) + (today.getDate())) % (cards[set].length);
    return cards[set][ind]
  }

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
    if ([gameMode + cardSet] in guesses){
      setGuesses(prevState => ({...prevState, [gameMode + cardSet]: [...prevState[gameMode+cardSet], newGuess]}))
    } else {
      setGuesses(prevState => ({ ...prevState, [gameMode + cardSet]: [newGuess] }))
    }
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
    console.log(cardAnswer[gameMode + cardSet])
    if (searchedCardArr.length > 0){
      setCardGuess(prevState => ({...prevState, [gameMode + cardSet]: getSearchedCard()[0]}));
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
    if (!([gameMode + cardSet] in cardGuess)){
      if (gameMode === mode.infinite) {
        setCardAnswer(prevState => ({...prevState, [gameMode + cardSet]: getCard(cardSet)}));
      } else if (gameMode === mode.daily) {
        setCardAnswer(prevState => ({ ...prevState, [gameMode + cardSet]: getDailyCard(cardSet) }));
      }
    }

    if (!([gameMode + cardSet] in gameState)) {
      setGameState(prevState => ({ ...prevState, [gameMode + cardSet]: state.playing }));
    }

    if (!([gameMode + cardSet] in stats)) {
      setStats(prevState => ({ ...prevState, [gameMode + cardSet]: initialStats }))
    }

    let today = new Date();
    let dailyDate = new Date(dailyDates[cardSet]);
    if (dailyDate instanceof Date && gameMode === mode.daily) {
      if ((today.getFullYear() > dailyDate.getFullYear()) || (today.getMonth() > dailyDate.getMonth()) || (today.getDate() > dailyDate.getDate()) || (today.getHours() > dailyDate.getHours()) || (today.getMinutes() > (dailyDate.getMinutes()+1))) {
        setDaily(cardSet);
      }
    }

    console.log(cardAnswer[gameMode+cardSet]);
  }, [cardSet, gameMode]);

  useEffect(() => {
    if ([gameMode + cardSet] in guesses) {
      setGuessesRemaining(gameLength[cardSet] - guesses[gameMode + cardSet].length);
    } else {
      setGuessesRemaining(gameLength[cardSet]);
    }
  }, [guesses, cardSet, gameMode]);

  useDidMountEffect(() => {
    checkGameOver();
  }, [guesses]);

  useDidMountEffect(() => {
    if ([gameMode + cardSet] in cardGuess) {
      if (Object.keys(cardGuess[gameMode + cardSet]).length > 0) {
        addGuess()
      }
    }
  }, [cardGuess])

  useDidMountEffect(() => {
    if (gameState[gameMode + cardSet] === state.won || gameState[gameMode + cardSet] === state.lost){
      setTimeout(() => {
        setGameOverModalIsOpen(true);
      }, 600)
    }
  }, [gameState])

  const setupGame = () => {
    if (settingsChanged) { 
      setCurrentGuessText("");
      setSettingsChanged(false);
    }
  }

  const setDaily = () => {
    setCardAnswer(prevState => ({ ...prevState, [gameMode + cardSet]: getDailyCard(cardSet) }));
    setGameState(prevState => ({ ...prevState, [gameMode + cardSet]: state.playing }));
    setGuesses(prevState => ({ ...prevState, [gameMode + cardSet]: [] }));
    setCardGuess(prevState => ({ ...prevState, [gameMode + cardSet]: [] }));
    setCurrentGuessText("");
  }

  const resetGame = () => {
    if (gameMode !== mode.daily){
      setCardAnswer(prevState => ({ ...prevState, [gameMode + cardSet]: getCard(cardSet) }));
      setGameState(prevState => ({ ...prevState, [gameMode + cardSet]: state.playing }));
      setGuesses(prevState => ({ ...prevState, [gameMode + cardSet]: [] }));
      setCardGuess(prevState => ({ ...prevState, [gameMode + cardSet]: [] }));
      setCurrentGuessText("");
      setSettingsChanged(false);
    }
  }

  const checkGameOver = () => {
    if ([gameMode + cardSet] in guesses && [gameMode + cardSet] in cardGuess && [gameMode + cardSet] in cardAnswer){
      if (gameMode === mode.daily) {
        let today = new Date();
        setDailyDates(prevState => ({ ...prevState, [cardSet]: today}));
      }

      if (cardsEqual(cardGuess[gameMode + cardSet], cardAnswer[gameMode + cardSet])) {
        setStats(prevState => {
          var stat = {...prevState};
          stat[gameMode+cardSet]["played"] += 1;
          stat[gameMode + cardSet]["won"] += 1;
          stat[gameMode + cardSet]["currStreak"] += 1;
          stat[gameMode + cardSet]["maxStreak"] = Math.max(stat[gameMode + cardSet]["currStreak"], stat[gameMode + cardSet]["maxStreak"]);
          return stat;
        });
        setGameState(prevState => ({ ...prevState, [gameMode + cardSet]: state.won }));
      } else if ((gameLength[cardSet] - guesses[gameMode + cardSet].length) === 0) {
        setStats(prevState => {
          var stat = { ...prevState };
          stat[gameMode + cardSet]["played"] += 1;
          stat[gameMode + cardSet]["currStreak"] = 0;
          return stat;
        });
        setGameState(prevState => ({ ...prevState, [gameMode + cardSet]: state.lost }));
      }
    }
  }

  const handleSettingsModalClose = () => {
    setSettingsModalIsOpen(false);
    setupGame();
  }

  const handleGameOverModalNewGame = () => {
    setGameOverModalIsOpen(false);
    resetGame();
  }

  const getSearchedCard = () => cards[cardSet].filter(c => c.name === currentGuessText)

  const cardsEqual = (c1, c2) => {
    return ((c1.set === c2.set) && (c1.cardClass === c2.cardClass) && (c1.rarity === c2.rarity) && (c1.cost === c2.cost) && (c1.health === c2.health) && (c1.attack === c2.attack))
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
        <div className="flex flex-row align-center justify-between px-2 pt-3 w-full text-xl lg:text-2xl lg:w-4/6 2xl:w-2/6">
          <div className="w-9 ml-2"><img src="/icons/menu.png" className="icon" onClick={()=>(setSettingsModalIsOpen(true))}/></div>
          <div className="text-3xl xl:text-4xl">CARDLE</div>
          <div className="w-9 mr-2"><img src="/icons/info.png" className="icon" /></div>
        </div>
        <div className="grid grid-cols-3 pt-3 gap-6 md:gap-12 text-lg">
          <span>Set: {cardSet}</span>
          <span>Mode: {gameMode}</span>
          <span>Guesses: {guessesRemaining}</span>
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
          {(gameState[gameMode + cardSet] === state.playing) &&
            <form onSubmit={e => handleSubmit(e)} className={"p-0 m-0"}>
              <div className = "flex flex-row items-start justify-center pt-5">
                <div className = "min-w-4/6 flex flex-row justify-start">
                  <AutoSuggest name="Card" options={cards[cardSet].map(o => o.name)} value = {currentGuessText} handleChange = {setCurrentGuessText}
                    styles={{
                      announcement: {display: "none"},
                      searchLabel: {display:"none"},
                      searchField: {fontSize: "1.2rem", margin:"0 0"},
                      comboBox: {width:"100%", display:"inline"},
                      suggestionsContainer: { color: "black", position: "static"},
                      suggestionOption: {fontSize: "1.2rem"}
                    }}
                  />
                </div>
                <input className= "bg-blue-500 hover:bg-blue-400 transition-colors rounded-md px-4 py-2.5 text-stone-50 focus:ring-2 ring-blue-500 ml-3" type="submit" value="SUBMIT"></input>
              </div>
            </form>
            }
          {((gameState[gameMode + cardSet] !== state.playing) && (gameMode !== mode.daily)) &&
            <button className="bg-blue-500 hover:bg-blue-400 transition-colors rounded-md px-4 py-2.5 text-stone-50 focus:ring-2 ring-blue-500 mt-5" onClick={resetGame}>New Game</button>
          }
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
        handleClose={() => setGameOverModalIsOpen(false)}
        styles={modalStyles}
        gameMode={gameMode}
        cardSet={cardSet}
        gameLength={gameLength[cardSet]}
        gameState={gameState[gameMode + cardSet]}
        cardAnswer={cardAnswer[gameMode + cardSet]}
        guesses={guesses[gameMode + cardSet]}
        stats={stats[gameMode+cardSet]}
        newGame={handleGameOverModalNewGame}
      />
      <PreCacheImg
        images={imageArray}
      />
    </div>
  );
}

export default App;
