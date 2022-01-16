import { Switch, RadioGroup } from '@headlessui/react'
import { modeArray } from '../constants'
import { useEffect, useState } from 'react'

export const GameModeOptions = ({ gameMode, changeGameMode }) => {
    const [selectedGameMode, setSelectedGameMode] = useState(gameMode)

    const changeSelectedGameMode = (gameMode) => {
        setSelectedGameMode(gameMode)
        changeGameMode(gameMode)
    }

    return (
        <div className="w-full px-4 py-4">
            <RadioGroup value={selectedGameMode} onChange={changeSelectedGameMode}>
                <RadioGroup.Label className="text-2xl">Game Modes</RadioGroup.Label>

                <div className="space-y-2">
                    {modeArray.map((mode) => (
                        <RadioGroup.Option
                            key={mode}
                            value={mode}
                            className={({ active, checked }) =>
                                `${active
                                    ? 'ring-1 ring-offset-1 ring-offset-sky-300 ring-white ring-opacity-60'
                                    : ''
                                }
                  ${checked ? 'bg-sky-900 bg-opacity-75 text-white' : 'bg-white'
                                }
                    relative rounded-lg shadow-md px-5 py-3 cursor-pointer flex focus:outline-none`
                            }
                        >
                            {({ active, checked }) => (
                                <>
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center">
                                            <RadioGroup.Label
                                                as="p"
                                                className={`text-xl  ${checked ? 'text-white' : 'text-gray-900'
                                                    }`}
                                            >
                                                {mode}
                                            </RadioGroup.Label>
                                        </div>
                                        {checked && (
                                            <div className="flex-shrink-0 text-white">
                                                <CheckIcon className="w-6 h-6" />
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </RadioGroup.Option>
                    ))}
                </div>

            </RadioGroup>
        </div>
    )
}

function CheckIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" {...props}>
            <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
            <path
                d="M7 13l3 3 7-7"
                stroke="#fff"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}