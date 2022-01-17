import Modal from 'react-modal'

export const InfoModal = ({ isOpen, handleClose, styles }) => {

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            style={styles}
            contentLabel="Info Modal"
        >
            <div className="h-full flex flex-col items-center justify-between max-w-[390px] mx-auto text-stone-50">
                <div className="w-full">
                    <button className="float-right text-2xl border border-stone-50 px-2 rounded-full" onClick={handleClose}>X</button>
                    <div className="text-xl text-center pt-12">Cardle is a Wordle-like game all about finding the correct Hearthstone minion!</div>
                </div>
                <div>
                    <div className="text-md text-center">After guessing a minion name, you'll see your guess's attributes compared to the answer:</div>
                    <div className="grid grid-cols-4 gap-4 text-md text-center">
                        <div className="flex flex-col items-center justify-start text-center"><span>🟩</span><span>Correct</span></div>
                        <div className="flex flex-col items-center justify-start text-center"><span>🟥</span><span>Incorrect</span></div>
                        <div className="flex flex-col items-center justify-start text-center"><span>▲</span><span>Too Low</span></div>
                        <div className="flex flex-col items-center justify-start text-center"><span>▼</span><span>Too High</span></div>
                    </div>
                </div>
                <div>
                    <div className="text-md text-center">There are two game modes playable on each minion set:</div>
                    <div className="grid grid-cols-2 gap-12 text-md text-center">
                        <div className="flex flex-col items-center justify-start text-center"><span className="text-xl">Daily</span><span>One Cardle per day! Resets at midnight</span></div>
                        <div className="flex flex-col items-center justify-start text-center"><span className="text-xl">Infinite</span><span>Play as long as you want!</span></div>
                    </div>
                </div>
                <div className="text-md text-center">Game mode and minion set can be changed in the top left menu. Happy searching!</div>
                <div className="text-md">Made with ❤️ by <a className="underline" target="_blank" href="https://twitter.com/boomemdee">BoomMD</a></div>
            </div>
        </Modal>
    )
}