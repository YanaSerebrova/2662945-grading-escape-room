import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../constants/api';
import { Quest } from '../types/quest';
import { QuestPreviewDto, adaptQuestToClient } from '../adapters/quest-adapter';

type QuestsState = {
  quests: Quest[];
  isLoading: boolean;
  error: string | null;
};

const initialState: QuestsState = {
  quests: [],
  isLoading: false,
  error: null,
};

export const fetchQuestsAction = createAsyncThunk<Quest[], void>(
  'quests/fetchQuests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/quest`);
      if (!response.ok) {
        throw new Error('Не удалось загрузить квесты');
      }

      const data = (await response.json()) as QuestPreviewDto[];

      return data.map(adaptQuestToClient);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Ошибка сети');
    }
  }
);

const questsSlice = createSlice({
  name: 'quests',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestsAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchQuestsAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.quests = action.payload;
      })
      .addCase(fetchQuestsAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default questsSlice.reducer;
