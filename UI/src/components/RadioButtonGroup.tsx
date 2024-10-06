import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

interface Props {
  options: any[];
  onChange: (event: any) => void;
  selectedValue: string;
}

const RadioButtonGroup = ({ options, selectedValue, onChange }: Props) => {
  return (
    <FormControl>
      <FormLabel id="demo-radio-buttons-group-label">Sort</FormLabel>
      <RadioGroup value={selectedValue} onChange={onChange}>
        {options.map(({ value, label }) => (
          <FormControlLabel
            key={value}
            value={value}
            control={<Radio />}
            label={label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default RadioButtonGroup;
