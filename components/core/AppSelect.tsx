import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

const AppSelect = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | number;
  onChange: (value: any) => void;
}) => {
  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <Select
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
    </FormControl>
  );
};

export default AppSelect;
