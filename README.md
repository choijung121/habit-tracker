# Habit Tracker

A React Native habit tracker inspired by the GitHub contributions calendar.

## Features

- Add a habit with the `+` button.
- Edit or delete a habit from the ellipsis action.
- Close add and edit modals with the `X` button.
- Mark a habit as complete for today.
- Track daily completions in a contribution-style activity grid.
- Darker calendar cells represent more completed habits on that date.

## Tech

- React Native
- Expo
- TypeScript

## Project Structure

- `App.tsx` - top-level app state and screen composition
- `src/components` - reusable UI pieces
- `src/constants.ts` - shared constants and starter data
- `src/styles.ts` - shared styles
- `src/utils/habits.ts` - date and habit helpers

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start the Expo dev server:

```bash
npm run start
```

3. Open the app in Expo Go, iOS Simulator, or Android Emulator.

## Current Behavior

- Each habit can be completed once per day.
- The activity grid shows the last 18 weeks.
- Empty calendar squares are white by default.

