import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  FormHelperText,
  Stack,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const FileUploadButton = ({ label, value, onChange, required = false }) => {
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      onChange(event.target.files[0]);
    }
  };

  return (
    <Box
      sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}
    >
      <Button
        component="label"
        variant="outlined"
        startIcon={<CloudUploadIcon />}
        size="small"
      >
        {label}
        <VisuallyHiddenInput type="file" onChange={handleFileChange} />
      </Button>
      <Typography variant="body2" color="text.secondary">
        {value ? value.name : "No file chosen"}
      </Typography>
      {required && (
        <Typography variant="caption" color="error">
          *
        </Typography>
      )}
    </Box>
  );
};

FileUploadButton.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
};

const RegistrationForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    fatherName: "",
    dateOfBirth: "",
    address: "",
    district: "",
    state: "",
    pinCode: "",
    aadharNumber: "",
    panNumber: "",
    drivingLicenseNo: "",
    rcNumber: "",
    accountHolderName: "",
    accountIFSC: "",
    accountNo: "",
    amazonLoginId: "",
  });

  const [files, setFiles] = useState({
    aadharPhoto: null,
    panPhoto: null,
    drivingLicensePhoto: null,
    rcPhoto: null,
    passbookPhoto: null,
  });

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const getMaxDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "aadharNumber") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length <= 12) {
        setFormData((prev) => ({ ...prev, [name]: numericValue }));
      }
    } else if (name === "pinCode") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length <= 6) {
        setFormData((prev) => ({ ...prev, [name]: numericValue }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (field) => (file) => {
    setFiles((prev) => ({ ...prev, [field]: file }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const requiredFields = [
      "fatherName",
      "dateOfBirth",
      "address",
      "district",
      "state",
      "pinCode",
      "aadharNumber",
      "panNumber",
      "drivingLicenseNo",
      "rcNumber",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]?.trim()) {
        newErrors[field] = "This field is required";
      }
    });

    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        if (age - 1 < 18) {
          newErrors.dateOfBirth = "You must be at least 18 years old";
        }
      } else if (age < 18) {
        newErrors.dateOfBirth = "You must be at least 18 years old";
      }

      if (birthDate > today) {
        newErrors.dateOfBirth = "Date of birth cannot be in the future";
      }
    }

    if (formData.aadharNumber && formData.aadharNumber.length !== 12) {
      newErrors.aadharNumber = "Aadhar number must be exactly 12 digits";
    }

    if (
      formData.panNumber &&
      !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(formData.panNumber)
    ) {
      newErrors.panNumber = "Invalid PAN card format (e.g., ABCDE1234F)";
    }

    if (formData.pinCode && formData.pinCode.length !== 6) {
      newErrors.pinCode = "Pin code must be exactly 6 digits";
    }

    if (
      formData.accountIFSC &&
      !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.accountIFSC)
    ) {
      newErrors.accountIFSC = "Invalid IFSC code";
    }

    const requiredFiles = [
      "aadharPhoto",
      "panPhoto",
      "drivingLicensePhoto",
      "rcPhoto",
    ];
    requiredFiles.forEach((field) => {
      if (!files[field]) {
        newErrors[field] = "This file is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form Data:", formData);
      console.log("Files:", files);
      setSnackbar({
        open: true,
        message: "Registration submitted successfully!",
        severity: "success",
      });
      setTimeout(() => {
        if (onClose) onClose();
      }, 1000);
    } else {
      setSnackbar({
        open: true,
        message: "Please fill all required fields correctly",
        severity: "error",
      });
    }
  };

  const handleReset = () => {
    setFormData({
      fatherName: "",
      dateOfBirth: "",
      address: "",
      district: "",
      state: "",
      pinCode: "",
      aadharNumber: "",
      panNumber: "",
      drivingLicenseNo: "",
      rcNumber: "",
      accountHolderName: "",
      accountIFSC: "",
      accountNo: "",
      amazonLoginId: "",
    });
    setFiles({
      aadharPhoto: null,
      panPhoto: null,
      drivingLicensePhoto: null,
      rcPhoto: null,
      passbookPhoto: null,
    });
    setErrors({});
  };

  const handleGoBack = () => {
    if (onClose) {
      onClose();
    } else {
      window.history.back();
    }
  };

  const isInModal = !!onClose;

  const FormContent = () => (
    <Stack spacing={3}>
      <TextField
        fullWidth
        label="Father's Name"
        name="fatherName"
        value={formData.fatherName}
        onChange={handleInputChange}
        error={!!errors.fatherName}
        helperText={errors.fatherName}
        required
      />

      <TextField
        fullWidth
        label="Date of Birth"
        name="dateOfBirth"
        type="date"
        value={formData.dateOfBirth}
        onChange={handleInputChange}
        error={!!errors.dateOfBirth}
        helperText={errors.dateOfBirth || "You must be at least 18 years old"}
        InputLabelProps={{ shrink: true }}
        inputProps={{
          max: getMaxDate(),
          min: "1900-01-01",
        }}
        required
      />

      <TextField
        fullWidth
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleInputChange}
        error={!!errors.address}
        helperText={errors.address}
        multiline
        rows={2}
        required
      />

      <TextField
        fullWidth
        label="District"
        name="district"
        value={formData.district}
        onChange={handleInputChange}
        error={!!errors.district}
        helperText={errors.district}
        required
      />

      <TextField
        fullWidth
        label="State"
        name="state"
        value={formData.state}
        onChange={handleInputChange}
        error={!!errors.state}
        helperText={errors.state}
        required
      />

      <TextField
        fullWidth
        label="Pin Code"
        name="pinCode"
        value={formData.pinCode}
        onChange={handleInputChange}
        error={!!errors.pinCode}
        helperText={errors.pinCode || "Must be exactly 6 digits"}
        inputProps={{
          maxLength: 6,
          inputMode: "numeric",
        }}
        required
      />

      <Divider sx={{ my: 1 }} />
      <Typography variant="h6" gutterBottom>
        Identity Documents
      </Typography>

      <TextField
        fullWidth
        label="Aadhar Card Number"
        name="aadharNumber"
        value={formData.aadharNumber}
        onChange={handleInputChange}
        error={!!errors.aadharNumber}
        helperText={errors.aadharNumber || "Must be exactly 12 digits"}
        inputProps={{
          maxLength: 12,
          inputMode: "numeric",
        }}
        required
      />

      <Box>
        <FileUploadButton
          label="Upload Aadhar Photo"
          value={files.aadharPhoto}
          onChange={handleFileChange("aadharPhoto")}
          required
        />
        {errors.aadharPhoto && (
          <FormHelperText error>{errors.aadharPhoto}</FormHelperText>
        )}
      </Box>

      <TextField
        fullWidth
        label="PAN Card Number"
        name="panNumber"
        value={formData.panNumber}
        onChange={handleInputChange}
        error={!!errors.panNumber}
        helperText={errors.panNumber || "e.g., ABCDE1234F"}
        inputProps={{
          maxLength: 10,
          style: { textTransform: "uppercase" },
        }}
        required
      />

      <Box>
        <FileUploadButton
          label="Upload PAN Photo"
          value={files.panPhoto}
          onChange={handleFileChange("panPhoto")}
          required
        />
        {errors.panPhoto && (
          <FormHelperText error>{errors.panPhoto}</FormHelperText>
        )}
      </Box>

      <TextField
        fullWidth
        label="Driving License No"
        name="drivingLicenseNo"
        value={formData.drivingLicenseNo}
        onChange={handleInputChange}
        error={!!errors.drivingLicenseNo}
        helperText={errors.drivingLicenseNo}
        required
      />

      <Box>
        <FileUploadButton
          label="Upload License Photo"
          value={files.drivingLicensePhoto}
          onChange={handleFileChange("drivingLicensePhoto")}
          required
        />
        {errors.drivingLicensePhoto && (
          <FormHelperText error>{errors.drivingLicensePhoto}</FormHelperText>
        )}
      </Box>

      <TextField
        fullWidth
        label="RC Number"
        name="rcNumber"
        value={formData.rcNumber}
        onChange={handleInputChange}
        error={!!errors.rcNumber}
        helperText={errors.rcNumber}
        required
      />

      <Box>
        <FileUploadButton
          label="Upload RC Photo"
          value={files.rcPhoto}
          onChange={handleFileChange("rcPhoto")}
          required
        />
        {errors.rcPhoto && (
          <FormHelperText error>{errors.rcPhoto}</FormHelperText>
        )}
      </Box>

      <Divider sx={{ my: 1 }} />
      <Typography variant="h6" gutterBottom>
        Bank Details
      </Typography>

      <TextField
        fullWidth
        label="Account Holder Name"
        name="accountHolderName"
        value={formData.accountHolderName}
        onChange={handleInputChange}
      />

      <TextField
        fullWidth
        label="Account IFSC"
        name="accountIFSC"
        value={formData.accountIFSC}
        onChange={handleInputChange}
        error={!!errors.accountIFSC}
        helperText={errors.accountIFSC || "e.g., SBIN0001234"}
        inputProps={{
          style: { textTransform: "uppercase" },
        }}
      />

      <TextField
        fullWidth
        label="Account No"
        name="accountNo"
        value={formData.accountNo}
        onChange={handleInputChange}
      />

      <FileUploadButton
        label="Upload Passbook Photo"
        value={files.passbookPhoto}
        onChange={handleFileChange("passbookPhoto")}
      />

      <Divider sx={{ my: 1 }} />
      <Typography variant="h6" gutterBottom>
        Other Details
      </Typography>

      <TextField
        fullWidth
        label="Amazon LoginId"
        name="amazonLoginId"
        value={formData.amazonLoginId}
        onChange={handleInputChange}
      />

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          sx={{ minWidth: 120 }}
        >
          Register
        </Button>
        <Button
          type="button"
          variant="outlined"
          color="secondary"
          size="large"
          onClick={handleReset}
          sx={{ minWidth: 120 }}
        >
          Reset
        </Button>
      </Stack>
    </Stack>
  );

  if (isInModal) {
    return (
      <>
        <form onSubmit={handleSubmit}>
          <FormContent />
        </form>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </>
    );
  }

  return (
    <Box sx={{ bgcolor: "skyblue", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="md">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={{ mb: 2, bgcolor: "white", "&:hover": { bgcolor: "#f0f0f0" } }}
        >
          Go Back!!
        </Button>

        <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
          <Typography
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
            fontWeight="bold"
            color="primary"
          >
            REGISTRATION FORM
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <form onSubmit={handleSubmit}>
            <FormContent />
          </form>
        </Paper>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

RegistrationForm.propTypes = {
  onClose: PropTypes.func,
};

export default RegistrationForm;
