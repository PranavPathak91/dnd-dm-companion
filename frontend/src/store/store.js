import { configureStore } from '@reduxjs/toolkit';
import charactersReducer from './slices/charactersSlice';
import monstersReducer from './slices/monstersSlice';
import sessionsReducer from './slices/sessionsSlice';
import diceReducer from './slices/diceSlice';
import campaignsReducer from './slices/campaignsSlice';

export const store = configureStore({
  reducer: {
    characters: charactersReducer,
    monsters: monstersReducer,
    sessions: sessionsReducer,
    dice: diceReducer,
    campaigns: campaignsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization checks
        ignoredActions: ['dice/rollDice/fulfilled'],
      },
    }),
});

export default store;
