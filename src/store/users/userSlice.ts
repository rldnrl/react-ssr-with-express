import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "..";
import { User } from "../../types";

export interface UserState {
  users: User[] | null;
  user: User | null;
  loading: {
    users: boolean;
    user: boolean;
  };
  error: {
    users: boolean;
    user: boolean;
  };
}

export const initialState = {
  users: null,
  user: null,
  loading: {
    users: false,
    user: false,
  },
  error: {
    users: false,
    user: false,
  },
} as UserState;

export const getUsers = createAsyncThunk("users", async () => {
  try {
    const { data } = await axios.get(
      "https://jsonplaceholder.typicode.com/users"
    );
    return data;
  } catch (error) {
    throw error;
  }
});

export const GET_USERS_PENDING = getUsers.pending.type;
export const GET_USERS_SUCCESS = getUsers.fulfilled.type;
export const GET_USERS_FAILURE = getUsers.rejected.type;

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: {
    [GET_USERS_PENDING]: (state) => {
      state.loading.users = true;
    },
    [GET_USERS_SUCCESS]: (state, action: PayloadAction<User[]>) => {
      state.loading.users = false;
      state.users = action.payload;
    },
    [GET_USERS_FAILURE]: (state, action: PayloadAction<any>) => {
      state.loading.users = false;
      state.error.users = action.payload;
    },
  },
});

export default userSlice.reducer;

export const selectUsers = (state: RootState) => state.users;
