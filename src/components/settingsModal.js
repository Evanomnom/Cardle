import { useState } from 'react'
import { CardSetOptions } from './cardSetOptions'
import { GameModeOptions } from './gameModeOptions'
import Modal from 'react-modal'

export const SettingsModal = ({ isOpen, handleClose, cardSet, gameMode, changeCardSet, changeGameMode, styles }) => {

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            style={styles}
            contentLabel="Settings Modal"
        >
                <div className="h-full flex flex-col items-center max-w-[390px] mx-auto text-stone-50">
                    <span className="text-4xl">Settings</span>
                    <CardSetOptions
                        cardSet={cardSet}
                        changeCardSet={changeCardSet}
                    />
                    <GameModeOptions
                        gameMode={gameMode}
                        changeGameMode={changeGameMode}
                    />
                </div>
        </Modal>
    )
}