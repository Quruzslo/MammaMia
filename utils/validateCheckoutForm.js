export const validateCheckoutForm = (formData) => {
  const errors = {};

  if (!formData.fullName.trim()) errors.fullName = "Kötelező mező!";
  if (!formData.email.includes("@")) errors.email = "Érvénytelen email!";
  if (!formData.phone.trim()) errors.phone = "Kötelező mező!";
  if (!formData.city.trim()) errors.city = "Kötelező mező!";
  if (!formData.street.trim()) errors.street = "Kötelező mező!";
  if (!formData.houseNumber) errors.houseNumber = "Kötelező mező!";
  if (formData.extraNote.length > 100) errors.extraNote = "Túl sok karatker!";

  return errors;
};
