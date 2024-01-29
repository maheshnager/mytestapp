// import { AgGridReact } from "ag-grid-react"; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { AgGridReact } from "ag-grid-react";
import "./App.css";
import { useEffect, useState } from "react";
import { Box, Button, Drawer, TextField, Typography } from "@mui/material";
import MultiStepForm from "./Form";
import { useSelector } from "react-redux";

function App() {
  const { allLeads } = useSelector((state) => state.eligibleLeads);

  console.log("test", allLeads);

  // Column Definitions: Defines & controls grid columns.
  const [colDefs, setColDefs] = useState([
    { field: "name" },
    { field: "age" },
    { field: "gender" },
    { field: "mobile" },
    { field: "govtIdType" },
    { field: "govtId" },
    { field: "Address" },
    { field: "State" },
    { field: "City" },
    { field: "Country" },
    { field: "Pincode" },
  ]);

  // Drower
  const [openDrawer, setOpenDrawer] = useState(false);
  const handleOpenDrawer = () => {
    setOpenDrawer(true);
  };

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
  };

  // filtter

  const [filterText, setFilterText] = useState(""); // State variable for filter text
  const [filteredRows, setFilteredRows] = useState(allLeads || []);

  useEffect(() => {
    const filterRows = (text) => {
      const filteredData = allLeads.filter((row) =>
        Object.values(row).some(
          (value) =>
            value && value.toString().toLowerCase().includes(text.toLowerCase())
        )
      );
      setFilteredRows(filteredData);
    };

    filterRows(filterText); // Apply filtering
  }, [allLeads, filterText]);

  // Filter rows based on filter text
  const filterRows = (text) => {
    if (!allLeads) return;
    const filteredData = allLeads.filter((row) =>
      Object.values(row).some(
        (value) =>
          value && value.toString().toLowerCase().includes(text.toLowerCase())
      )
    );
    setFilteredRows(filteredData);
  };

  // Update filtered rows when filter text changes
  const handleFilterTextChange = (e) => {
    const searchText = e.target.value;
    setFilterText(searchText);
    if (searchText.length === 0) {
      setFilteredRows(allLeads || []);
    } else {
      filterRows(searchText);
    }
  };

  return (
    <Box>
      <div
        className="ag-theme-alpine"
        style={{
          width: "100%",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          background: "#fff",
          border: "1px solid #2196f31a",
          borderRadius: "6px",
          padding: "5px 0px 30px",
          height: "100%",
        }}
      >
        <Box>
          <Box
            alignItems={"center"}
            justifyContent={"space-between"}
            sx={{ padding: "10px 20px" }}
          >
            <h1>MY TEST</h1>
            <div className="ag-theme-quartz" style={{ height: 500 }}>
              {/* The AG Grid component */}

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems={"center"}
              >
                <Box>
                  <Typography component="h6" variant="h6" fontWeight={600}>
                    TABLE
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  justifyContent="flex-end"
                  alignItems={"center"}
                >
                  <Box
                    sx={{
                      padding: "10px 0px",
                      mr: "25px",
                    }}
                  >
                    <TextField
                      type="text"
                      value={filterText}
                      onChange={handleFilterTextChange}
                      placeholder="Search..."
                      variant="outlined"
                      InputLabelProps={{ shrink: false }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          fontSize: "12px",
                          padding: "10px",
                          height: "2.2rem",
                          borderRadius: "20px",
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: "12px",
                        },
                      }}
                    />
                  </Box>
                  <Box>
                    <Button variant="contained" onClick={handleOpenDrawer}>
                      ADD
                    </Button>
                  </Box>
                </Box>
              </Box>

              <AgGridReact rowData={filteredRows || []} columnDefs={colDefs} />
            </div>
            <Drawer
              anchor="right"
              open={openDrawer}
              onClose={handleCloseDrawer}
              sx={{
                "& .MuiDrawer-paperAnchorRight": {
                  margin: 2,
                  height: "98vh",
                  borderRadius: "8px",
                  border: "1px solid #DFE3E7",
                  background: "#FFF",
                  boxShadow: "0px 4px 24px 0px rgba(0, 0, 0, 0.12)",
                },
              }}
            >
              <Box sx={{ minWidth: "500px" }}></Box>

              <MultiStepForm handleCloseDrawer={handleCloseDrawer} />
            </Drawer>
          </Box>
        </Box>
      </div>
    </Box>
  );
}

export default App;
