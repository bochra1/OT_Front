import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('reduxUser')) || null,
  token: localStorage.getItem('reduxToken') || null,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('reduxUser', JSON.stringify(action.payload.user));
      localStorage.setItem('reduxToken', action.payload.token);
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    clearAuth(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('reduxUser');
      localStorage.removeItem('reduxToken');
    },
  },
});

export const { setAuth, setLoading, clearAuth } = authSlice.actions;
export default authSlice.reducer;
