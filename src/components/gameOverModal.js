import { status } from '../constants'
import Modal from 'react-modal'
import {isMobile} from 'react-device-detect'
import {mode, state} from '../constants'
import {StatisticBox} from "./statisticBox"
import { useEffect, useState } from 'react'

export const GameOverModal = ({ isOpen, handleClose, styles, gameState, gameMode, cardSet, cardAnswer, guesses, newGame, gameLength, stats }) => {

    const emojiMap = { [status.below]: "⬆️", [status.above]: "⬇️", [status.correct]: "🟩", [status.incorrect]:"🟥"}

    const [showAlert, setShowAlert] = useState(false)

    useEffect(() => {
        if (showAlert) {
            setTimeout(() => setShowAlert(false), 3000)
        }
    }, [showAlert])
    
    const getEmojis = () => {
        let titleGuessedNum = (gameState === state.won) ? guesses.length : "X"
        titleGuessedNum += "/" + gameLength

        let title = "Cardle " + cardSet;
        if (gameMode === mode.daily) {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            title += " " + mm + '-' + dd
        } else {
            title += " Infinite"
        }

        title += " " + titleGuessedNum;
        title += "\n\n"
        let shareText = ""
        guesses.forEach(guess => {
            guess.forEach(elem => {
                shareText += emojiMap[elem.status]
            });
            shareText += "\n"
        });
        if (navigator.canShare && isMobile) {
            navigator.share({
                text: title + shareText
            })
        } else {
            navigator.clipboard.writeText(title + shareText)
            setShowAlert(true)
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            style={styles}
            contentLabel="Game Over Modal"
        >
            <div className="h-full flex flex-col text-center items-center justify-between max-w-[390px] mx-auto text-stone-50">
                <div className="w-full">
                    <button className="float-right text-2xl border border-stone-50 px-2 rounded-full" onClick={handleClose}>X</button>
                    <img src={(gameState === state.won) ? "/end/victory.png" : "/end/defeat.png"} className={"pt-4"} />
                </div>
                
                {gameState === state.lost && (
                <div>
                    <div className="text-xl">The card was</div>
                    <div className="text-3xl">{cardAnswer.name}</div>
                </div>
                )}
                <div>
                    <div className="text-2xl">{gameMode} {cardSet} Stats</div>
                    {stats && "played" in stats &&
                        <div className="grid grid-cols-4 gap-2">
                            <StatisticBox stat={"Played"} value={stats.played}/>
                            <StatisticBox stat={"Win %"} value={Math.round((stats.won/stats.played)*100)} />
                            <StatisticBox stat={"Current Streak"} value={stats.currStreak} />
                            <StatisticBox stat={"Max Streak"} value={stats.maxStreak} />
                        </div>
                    }
                </div>
                <div className="flex flex-row justify-center items-end text-xl md:text-2xl w-full">
                    {gameMode === mode.infinite && 
                    <button onClick={() => newGame()} className="bg-green-500 hover:bg-green-400 transition-colors rounded-md px-4 py-2 mr-10 text-stone-50 focus:ring-2 ring-green-500">
                        New Game
                    </button>
                    }   
                    <div className="flex flex-col">
                        {showAlert && <div className="text-lg mb-2">Copied to Clipboard!</div>}
                        <button onClick={() => getEmojis()} className="bg-green-500 hover:bg-green-400 transition-colors rounded-md px-3 py-2 text-stone-50 focus:ring-2 ring-green-500">
                            Share Result
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}