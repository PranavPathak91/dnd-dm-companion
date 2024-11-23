import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const initialState = {
  monsters: [],
  filteredMonsters: [],
  searchTerm: '',
  status: 'idle',
  error: null,
};

export const fetchMonsters = createAsyncThunk(
  'monsters/fetchMonsters',
  async () => {
    const response = await api.get('/monsters');
    return response.data;
  }
);

export const createMonster = createAsyncThunk(
  'monsters/createMonster',
  async (monsterData) => {
    const response = await api.post('/monsters', monsterData);
    return response.data;
  }
);

export const updateMonster = createAsyncThunk(
  'monsters/updateMonster',
  async ({ id, monsterData }) => {
    const response = await api.put(`/monsters/${id}`, monsterData);
    return response.data;
  }
);

export const deleteMonster = createAsyncThunk(
  'monsters/deleteMonster',
  async (id) => {
    await api.delete(`/monsters/${id}`);
    return id;
  }
);

const monstersSlice = createSlice({
  name: 'monsters',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.filteredMonsters = state.monsters.filter(monster =>
        monster.name.toLowerCase().includes(action.payload.toLowerCase()) ||
        monster.description.toLowerCase().includes(action.payload.toLowerCase())
      );
    },
    filterByCR: (state, action) => {
      const cr = action.payload;
      state.filteredMonsters = state.monsters.filter(monster =>
        monster.challenge_rating === cr
      );
    },
    clearFilters: (state) => {
      state.searchTerm = '';
      state.filteredMonsters = state.monsters;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonsters.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMonsters.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.monsters = action.payload;
        state.filteredMonsters = action.payload;
      })
      .addCase(fetchMonsters.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createMonster.fulfilled, (state, action) => {
        state.monsters.push(action.payload);
        if (!state.searchTerm) {
          state.filteredMonsters.push(action.payload);
        }
      })
      .addCase(updateMonster.fulfilled, (state, action) => {
        const index = state.monsters.findIndex(monster => monster.id === action.payload.id);
        if (index !== -1) {
          state.monsters[index] = action.payload;
          state.filteredMonsters[index] = action.payload;
        }
      })
      .addCase(deleteMonster.fulfilled, (state, action) => {
        state.monsters = state.monsters.filter(monster => monster.id !== action.payload);
        state.filteredMonsters = state.filteredMonsters.filter(monster => monster.id !== action.payload);
      });
  },
});

export const { setSearchTerm, filterByCR, clearFilters } = monstersSlice.actions;

export const selectAllMonsters = (state) => state.monsters.monsters;
export const selectFilteredMonsters = (state) => state.monsters.filteredMonsters;
export const selectMonstersByRange = (state, minCR, maxCR) =>
  state.monsters.monsters.filter(monster =>
    monster.challenge_rating >= minCR && monster.challenge_rating <= maxCR
  );
export const selectMonstersByChallenge = (state, cr) => 
  state.monsters.monsters.filter(monster => monster.challenge_rating === cr);
export const selectMonstersStatus = (state) => state.monsters.status;
export const selectMonstersError = (state) => state.monsters.error;

export default monstersSlice.reducer;
