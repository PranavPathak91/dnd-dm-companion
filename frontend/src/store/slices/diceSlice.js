import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const initialState = {
  rolls: [],
  lastRoll: null,
  status: 'idle',
  error: null,
};

export const rollDice = createAsyncThunk(
  'dice/rollDice',
  async ({ dice, num = 1 }, { rejectWithValue }) => {
    try {
      // Format dice notation (e.g., convert "d20" and 2 to "2d20")
      const sides = parseInt(dice.substring(1), 10);
      const diceNotation = `${num}d${sides}`;
      
      const response = await api.post('/roll', { dice: diceNotation });
      
      return {
        id: Date.now(),
        dice,
        num,
        results: response.data.rolls,
        total: response.data.total,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      console.error('Dice roll error:', err);
      return rejectWithValue(err.response?.data?.error || 'Failed to roll dice');
    }
  }
);

const diceSlice = createSlice({
  name: 'dice',
  initialState,
  reducers: {
    clearRolls: (state) => {
      state.rolls = [];
      state.lastRoll = null;
      state.error = null;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(rollDice.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(rollDice.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.lastRoll = action.payload;
        state.rolls.unshift(action.payload);
        // Keep only the last 20 rolls
        if (state.rolls.length > 20) {
          state.rolls = state.rolls.slice(0, 20);
        }
      })
      .addCase(rollDice.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'An error occurred while rolling dice';
      });
  },
});

export const { clearRolls } = diceSlice.actions;

export const selectAllRolls = (state) => state.dice.rolls;
export const selectLastRoll = (state) => state.dice.lastRoll;
export const selectDiceStatus = (state) => state.dice.status;
export const selectDiceError = (state) => state.dice.error;

export default diceSlice.reducer;
