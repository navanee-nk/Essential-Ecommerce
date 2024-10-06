import { Typography, Grid } from "@mui/material";
import { useFormContext } from "react-hook-form";
import AppTextInput from "../../components/AppTextInput";
import AppCheckbox from "../../components/AppCheckbox";

export default function AddressForm() {
  const { control } = useFormContext();
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Shipping address
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <AppTextInput control={control} label="Full Name" name="fullName" />
        </Grid>

        <Grid item xs={12}>
          <AppTextInput control={control} label="Address1" name="address1" />
        </Grid>
        <Grid item xs={12}>
          <AppTextInput control={control} label="Address2" name="address2" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput control={control} label="City" name="city" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput control={control} label="State" name="state" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput control={control} label="Zip" name="zip" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput control={control} label="Country" name="country" />
        </Grid>
        <Grid item xs={12}>
          <AppCheckbox
            control={control}
            label="Save this as default address"
            name="saveAddress"             
          />
        </Grid>
      </Grid>
    </>
  );
}
