import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { addLead } from "../store/leads/eligibleLeadSlice";

const MultiStepForm = ({ handleCloseDrawer }) => {
  const [step, setStep] = useState(1);

  const validationSchemaStep1 = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .min(3, "Name must be at least 3 characters"),

    age: Yup.number()
      .typeError("Age must be a number")
      .required("Age is required")
      .positive("Age must be a positive number")
      .integer("Age must be an integer"),

    mobile: Yup.string()
      .required("Mobile Number is required")
      .matches(/^[6-9]\d{9}$/, "Invalid Indian Mobile Number"),

    gender: Yup.string().required("Gender is required"), // Change Yup.string() to Yup.mixed()

    govtId: Yup.string().when("govtIdType", {
      is: (v) => v === "AADHAR",
      then: () =>
        Yup.string()
          .required("Field is required")
          .matches(/^\d{12}$/, "Invalid AADHAR format"),
      otherwise: () =>
        Yup.string()
          .required("Field is required")
          .matches(/^([A-Z]){5}([0-9]){4}([A-Z]){1}$/, "Invalid PAN format"),
    }),

    govtIdType: Yup.string().required("Govt Id  is required"),
  });

  const validationSchemaStep2 = Yup.object().shape({
    // Address: Yup.string().required("Address is required"),
    // State: Yup.string().required("State is required"),
    // City: Yup.string().required("City is required"),
    Country: Yup.string().required("Country is required"),
    Pincode: Yup.number()
      .typeError("Pincode must be a number")
      .required("Pincode is required")
      .positive("Pincode must be a positive number")
      .integer("Pincode must be an integer"),
  });
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(
      step === 1 ? validationSchemaStep1 : validationSchemaStep2
    ),
  });

  const onSubmitStep1 = (data) => {
    // Handle step 1 submission, then proceed to step 2
    setStep(2);
  };

  const onSubmitStep2 = (data) => {
    // Handle final submission

    handleCloseDrawer();
    console.log(data);
    dispatch(addLead(data));
    // reset();
  };

  //Gender option
  const genderOptions = [
    { id: 1, label: "MALE", value: "MALE" },
    { id: 2, label: "FEMALE", value: "FEMALE" }, // Corrected the value to "female"
  ];

  // Govt id type

  const idTypeOptions = [
    { id: 1, label: "AADHAR", value: "AADHAR" },
    { id: 2, label: "PAN", value: "PAN" }, // Corrected the value to "female"
  ];

  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(null);
  // const countries = [
  //   { code: "US", name: "United States" },
  //   { code: "CA", name: "Canada" },
  //   { code: "GB", name: "United Kingdom" },
  //   // Add more countries as needed
  // ];

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        setCountries(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  return (
    <form
      onSubmit={
        step === 1 ? handleSubmit(onSubmitStep1) : handleSubmit(onSubmitStep2)
      }
      style={{
        display: "flex",
        flexDirection: "column",
        margin: "20px",
      }}
    >
      {step === 1 && (
        <Box width={"100%"}>
          <Box>
            <TextField
              type="text"
              name="name"
              label="Name"
              {...register("name")}
              style={{ width: "100%" }}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Box>

          <Box pt={3}>
            <TextField
              type="text"
              name="age"
              label="Age"
              {...register("age")}
              style={{ width: "100%" }}
              error={!!errors.age}
              helperText={errors.age?.message}
            />
            <Box pt={3}>
              <Controller
                name="gender"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    disablePortal
                    id="combo-box-demo"
                    options={genderOptions}
                    sx={{ width: "100%" }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Gender"
                        style={{ width: "100%" }}
                        error={!!errors.gender}
                        helperText={errors.gender?.message}
                      />
                    )}
                    onChange={
                      (e, value) => field.onChange(value ? value.value : null) // Updated to access the value directly
                    }
                  />
                )}
                rules={{ required: "Gender is required" }}
              />
            </Box>
            <Box pt={3}>
              <TextField
                type="text"
                name="mobile"
                label="Mobile"
                {...register("mobile")}
                style={{ width: "100%" }}
                error={!!errors.mobile}
                helperText={errors.mobile?.message}
              />
            </Box>

            <Box pt={3}>
              <Controller
                name="govtIdType"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    disablePortal
                    id="combo-box-demo"
                    options={idTypeOptions}
                    sx={{ width: "100%" }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Govt Id Type"
                        style={{ width: "100%" }}
                        error={!!errors.govtIdType}
                        helperText={errors.govtIdType?.message}
                      />
                    )}
                    onChange={(e, value) =>
                      field.onChange(value ? value.value : null)
                    }
                  />
                )}
              />
            </Box>
            <Box pt={3}>
              <TextField
                type="text"
                name="govtId"
                label="Govt Id"
                {...register("govtId")}
                style={{ width: "100%" }}
                error={!!errors.govtId}
                helperText={errors.govtId?.message}
              />
            </Box>
          </Box>

          <Box pt={3}>
            <Button variant="contained" type="submit">
              Next
            </Button>
          </Box>
        </Box>
      )}

      {step === 2 && (
        <div>
          <Box>
            <TextField
              type="text"
              name="Address"
              label="Address"
              {...register("Address")}
              style={{ width: "100%" }}
              error={!!errors.Address}
              helperText={errors.Address?.message}
              optional={true}
            />
          </Box>

          <Box pt={3}>
            <TextField
              type="City"
              name="City"
              label="City"
              {...register("City")}
              style={{ width: "100%" }}
              error={!!errors.City}
              helperText={errors.City?.message}
              optional={true}
            />
          </Box>
          <Box pt={3}>
            <TextField
              type="State"
              name="State"
              label="State"
              {...register("State")}
              style={{ width: "100%" }}
              error={!!errors.State}
              helperText={errors.State?.message}
              optional={true}
            />
          </Box>
          <Box pt={3}>
            <Autocomplete
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
              options={countries}
              getOptionLabel={(option) => option.name.common}
              renderInput={(params) => (
                <TextField
                  type="Country"
                  name="Country"
                  {...register("Country")}
                  {...params}
                  label="Select Country"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                  style={{ width: "100%" }}
                  error={!!errors.Country}
                  helperText={errors.Country?.message}
                />
              )}
            />
          </Box>
          <Box pt={3}>
            <TextField
              type="text"
              name="Pincode"
              label="Pin Code"
              {...register("Pincode")}
              style={{ width: "100%" }}
              error={!!errors.Pincode}
              helperText={errors.Pincode?.message}
            />
          </Box>

          <Box pt={3}>
            <Button variant="contained" type="submit">
              Submit
            </Button>
          </Box>
        </div>
      )}
    </form>
  );
};

export default MultiStepForm;
