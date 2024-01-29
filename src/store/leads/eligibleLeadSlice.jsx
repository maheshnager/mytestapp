// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   allLeads: [],
// };
// export const eligibleLeadSlice = createSlice({
//   name: "eligibleLeads",
//   initialState,
//   reducers: {
//     getLeads: (state, action) => {
//       state.allLeads = action.payload;
//     },
//   },
// });

// export const eligibleLeadActions = eligibleLeadSlice.actions;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allLeads: [],
};

export const eligibleLeadSlice = createSlice({
  name: "eligibleLeads",
  initialState,
  reducers: {
    addLead: (state, action) => {
      state.allLeads.push(action.payload); // Append new lead to existing array
    },
  },
});

export const { addLead } = eligibleLeadSlice.actions; // Destructuring action creators

export default eligibleLeadSlice.reducer;
