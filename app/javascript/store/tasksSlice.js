import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  tasks: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

// Fetching tasks
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const response = await axios.get('http://localhost:3000/api/v1/tasks');
  return response.data;
});

// Updating a task
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async (updatedTask, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/v1/tasks/${updatedTask.id}`, updatedTask);
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  }
);

// Deleting a task
export const deleteTask = createAsyncThunk('tasks/deleteTask', async (taskId) => {
  await axios.delete(`http://localhost:3000/api/v1/tasks/${taskId}`);
  return taskId;  
});

// Creating a task
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (newTask, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/tasks', newTask);
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  }
);

// Slice
const TasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchTasks.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.error.message;
      });
  }
});

export default TasksSlice.reducer;