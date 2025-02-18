export interface PasswordStrength {
  score: number; // 0-4
  suggestions: string[];
  isStrong: boolean;
}

export const checkPasswordStrength = (password: string): PasswordStrength => {
  const strength: PasswordStrength = {
    score: 0,
    suggestions: [],
    isStrong: false,
  };

  if (password.length < 8) {
    strength.suggestions.push("Use at least 8 characters");
    return strength;
  }

  // Check for uppercase letters
  if (!/[A-Z]/.test(password)) {
    strength.suggestions.push("Add uppercase letters");
  } else {
    strength.score += 1;
  }

  // Check for lowercase letters
  if (!/[a-z]/.test(password)) {
    strength.suggestions.push("Add lowercase letters");
  } else {
    strength.score += 1;
  }

  // Check for numbers
  if (!/\d/.test(password)) {
    strength.suggestions.push("Add numbers");
  } else {
    strength.score += 1;
  }

  // Check for special characters
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    strength.suggestions.push("Add special characters");
  } else {
    strength.score += 1;
  }

  strength.isStrong = strength.score >= 3;
  return strength;
};
