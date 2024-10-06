import * as yup from "yup";

export const schemaValidation = [
  yup.object({
    fullName: yup.string().required("Full Name is required"),
    address1: yup.string().required("Address1 is required"),
    address2: yup.string().required("Address2 is required"),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    zip: yup.string().required("Zip is required"),
    country: yup.string().required("Country is required"),
  }),
  yup.object(),
  yup.object({
    nameOnCard: yup.string().required("Name on card is required"),
  }),
];
