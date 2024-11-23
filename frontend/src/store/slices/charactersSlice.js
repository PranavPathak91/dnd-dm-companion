import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const initialState = {
  characters: [],
  status: 'idle',
  error: null,
};

export const fetchCharacters = createAsyncThunk(
  'characters/fetchCharacters',
  async () => {
    const response = await api.get('/characters');
    return response.data;
  }
);

export const createCharacter = createAsyncThunk(
  'characters/createCharacter',
  async (characterData) => {
    const response = await api.post('/characters', characterData);
    return response.data;
  }
);

export const updateCharacter = createAsyncThunk(
  'characters/updateCharacter',
  async ({ id, characterData }) => {
    const response = await api.put(`/characters/${id}`, characterData);
    return response.data;
  }
);

const charactersSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCharacters.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCharacters.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.characters = action.payload;
      })
      .addCase(fetchCharacters.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createCharacter.fulfilled, (state, action) => {
        state.characters.push(action.payload);
      })
      .addCase(updateCharacter.fulfilled, (state, action) => {
        const index = state.characters.findIndex(char => char.id === action.payload.id);
        if (index !== -1) {
          state.characters[index] = action.payload;
        }
      });
  },
});

export const selectAllCharacters = (state) => state.characters.characters;
export const selectCharactersByCampaign = (state, campaignId) =>
  state.characters.characters.filter(char => char.campaign_id === campaignId);
export const selectCharactersStatus = (state) => state.characters.status;
export const selectCharactersError = (state) => state.characters.error;

export default charactersSlice.reducer;
