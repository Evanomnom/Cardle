# Cardle

Wordle-like game where you have to find the right Hearthstone minion. Features card sets based on the game (Standard, Wild, Classic, and Wild Legendaries) with a Daily and Infinite mode for each.

## Technical Overview

- Project built in React with Create React App.
- Hosted on AWS Amplify.
- CSS Styling with Tailwind
- Card data is in JSON files in src/data; collected from the HearthstoneJSON database.
- User data (current game states, stats, daily completion dates) is saved in local browser storage.
