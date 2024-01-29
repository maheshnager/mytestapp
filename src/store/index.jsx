import { configureStore } from "@reduxjs/toolkit";
import { eligibleLeadSlice } from "./leads/eligibleLeadSlice";

/*-----------------------------------------------------------*/
const MyStore = configureStore({
  reducer: {
    eligibleLeads: eligibleLeadSlice.reducer,
  },
});
export default MyStore;
