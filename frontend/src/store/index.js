import { configureStore } from '@reduxjs/toolkit';
import campaignsReducer from './slices/campaignsSlice';
import charactersReducer from './slices/charactersSlice';
import monstersReducer from './slices/monstersSlice';
import sessionsReducer from './slices/sessionsSlice';
import diceReducer from './slices/diceSlice';

export const store = configureStore({
  reducer: {
    campaigns: campaignsReducer,
    characters: charactersReducer,
    monsters: monstersReducer,
    sessions: sessionsReducer,
    dice: diceReducer,
  },
});

export default store;
