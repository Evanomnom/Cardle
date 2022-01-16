import Modal from 'react-modal'
import {mode, state} from '../constants'
import {StatisticBox} from "./statisticBox"

export const GameOverModal = ({ isOpen, handleClose, styles, gameState, gameMode, cardSet, cardAnswer, guesses }) => {

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
                    <img src={(gameState === state.won) ? "victory.png" : "defeat.png"} className={"pt-4"} />
                </div>
                
                {gameState === state.lost && (
                <div>
                    <div className="text-xl">The card was</div>
                    <div className="text-3xl">{cardAnswer.name}</div>
                </div>
                )}
                <div>
                    <div className="text-2xl">{gameMode} {cardSet} Stats</div>
                    <div className="grid grid-cols-4 gap-2">
                        <StatisticBox stat={"Current Streak"} value={45}/>
                        <StatisticBox stat={"Current Streak"} value={45} />
                        <StatisticBox stat={"Current Streak"} value={45} />
                        <StatisticBox stat={"Current Streak"} value={45} />
                    </div>
                </div>
                <div className="flex flex-row justify-between items-end text-xl md:text-2xl w-full">
                    {gameMode === mode.infinite && 
                    <button className="bg-green-500 hover:bg-green-400 transition-colors rounded-md px-4 py-2 text-stone-50 focus:ring-2 ring-green-500">
                        New Game
                    </button>
                    }   
                    <button className="bg-green-500 hover:bg-green-400 transition-colors rounded-md px-3 py-2 text-stone-50 focus:ring-2 ring-green-500">
                        Share Result
                    </button>
                </div>
            </div>
        </Modal>
    )
}