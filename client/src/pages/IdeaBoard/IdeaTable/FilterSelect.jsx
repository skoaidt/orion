import React from 'react';
import { FormControl, Select, MenuItem, InputLabel } from "@mui/material";

const FilterSelect = ({ label, value, options, onChange }) => (
  <FormControl sx={{ minWidth: 120 }} size="small">
    <InputLabel>{label}</InputLabel>
    <Select value={value} label={label} onChange={onChange}>
      {options.map(option => (
        <MenuItem key={option} value={option}>{option}</MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default FilterSelect;
