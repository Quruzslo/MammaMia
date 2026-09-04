export interface FoodValidationError {
  isValid: boolean;
  error?: string;
}

interface FoodValidationParams {
  name: string;
  price: string | number;
  file?: File | null;
}

export function validateFoodInput({
  name,
  price,
  file,
}: FoodValidationParams): FoodValidationError {
  // 1. Név validáció
  const trimmedName = name.trim();
  if (!trimmedName) {
    return { isValid: false, error: "Az étel nevének megadása kötelező!" };
  }
  if (trimmedName.length > 100) {
    return {
      isValid: false,
      error: "Az étel neve nem lehet hosszabb 100 karakternél!",
    };
  }

  // 2. Ár validáció
  const numericPrice = Number(price);
  if (price === "" || isNaN(numericPrice) || numericPrice < 0) {
    return { isValid: false, error: "Kérlek, adj meg egy érvényes árat!" };
  }
  if (numericPrice > 10000) {
    return {
      isValid: false,
      error: "Az ár nem lehet magasabb 10 000 Ft-nál!",
    };
  }

  // 3. Kép méret validáció (0.5 MB = 524 288 bájt)
  const MAX_FILE_SIZE = 0.5 * 1024 * 1024;
  if (file && file.size > MAX_FILE_SIZE) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    return {
      isValid: false,
      error: `A kép mérete túl nagy (${sizeInMB} MB)! Maximum 0.5 MB megengedett.`,
    };
  }

  return { isValid: true };
}
