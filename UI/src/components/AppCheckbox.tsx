import { Checkbox, FormControlLabel } from "@mui/material";
import { useController, UseControllerProps } from "react-hook-form";

interface Props extends UseControllerProps {
  label: string;
}
const AppCheckbox = (props: Props) => {
  const { field } = useController({
    ...props,
    defaultValue: false,
  });
  return (
    <FormControlLabel
      label={props.label}
      control={<Checkbox {...field} checked={field.value} color="secondary" />}
    ></FormControlLabel>
  );
};

export default AppCheckbox;
