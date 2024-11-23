import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const initialState = {
  sessions: [],
  status: 'idle',
  error: null,
};

export const fetchSessions = createAsyncThunk(
  'sessions/fetchSessions',
  async () => {
    const response = await api.get('/sessions');
    return response.data;
  }
);

export const createSession = createAsyncThunk(
  'sessions/createSession',
  async (sessionData) => {
    const response = await api.post('/sessions', sessionData);
    return response.data;
  }
);

export const updateSession = createAsyncThunk(
  'sessions/updateSession',
  async ({ id, sessionData }) => {
    const response = await api.put(`/sessions/${id}`, sessionData);
    return response.data;
  }
);

const sessionsSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.sessions = action.payload;
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createSession.fulfilled, (state, action) => {
        state.sessions.unshift(action.payload);
      })
      .addCase(updateSession.fulfilled, (state, action) => {
        const index = state.sessions.findIndex(session => session.id === action.payload.id);
        if (index !== -1) {
          state.sessions[index] = action.payload;
        }
      });
  },
});

export const selectAllSessions = (state) => state.sessions.sessions;
export const selectSessionsByCampaign = (state, campaignId) =>
  state.sessions.sessions.filter(session => session.campaign_id === campaignId);
export const selectRecentSessions = (state, limit = 5) =>
  [...state.sessions.sessions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
export const selectSessionsStatus = (state) => state.sessions.status;
export const selectSessionsError = (state) => state.sessions.error;

export default sessionsSlice.reducer;
