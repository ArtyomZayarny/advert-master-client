import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdvertState {
  selectedCategory: string | null;
  filters: {
    city?: string;
    priceMin?: number;
    priceMax?: number;
    sortBy?: "price_asc" | "price_desc" | "date";
  };
}

const initialState: AdvertState = {
  selectedCategory: null,
  filters: {},
};

const advertSlice = createSlice({
  name: "advert",
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    setFilters: (state, action: PayloadAction<AdvertState["filters"]>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
  },
});

export const { setCategory, setFilters, clearFilters } = advertSlice.actions;
export default advertSlice.reducer;
