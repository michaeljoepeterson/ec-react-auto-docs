import { FormControl, InputLabel, Select, MenuItem, Menu } from "@mui/material";

const AppSelect = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string | number;
  onChange: (value: any) => void;
  options: { label: string; value: string | number }[];
}) => {
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
        <MenuItem value="">None</MenuItem>
      </Select>
    </FormControl>
  );
};

export default AppSelect;
