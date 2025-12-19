import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const AppSelect = ({
  label,
  value,
  onChange,
  options,
  className,
  required,
  isLoading,
}: {
  label: string;
  value: string | number;
  onChange: (value: any) => void;
  options: { label: string; value: string | number }[];
  className?: string;
  required?: boolean;
  isLoading?: boolean;
}) => {
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={className + `${isLoading ? " animate-pulse" : ""}`}
        required={required}
        disabled={isLoading}
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
