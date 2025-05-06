export const saveToLocalStorage = (key: string, value: any) => {
  try {
    // Convert Dates to ISO strings before saving
    const processedValue = JSON.stringify(value, (_, v) => 
      v instanceof Date ? v.toISOString() : v
    );
    localStorage.setItem(key, processedValue);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const loadFromLocalStorage = (key: string, defaultValue: any) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;

    // Parse JSON and convert ISO date strings back to Date objects
    const parsed = JSON.parse(item, (_, v) => {
      if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(v)) {
        return new Date(v);
      }
      return v;
    });
    return parsed;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};
// new