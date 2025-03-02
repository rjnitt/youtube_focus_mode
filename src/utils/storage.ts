export const StorageManager = {
  // Clear all data
  clearData: async () => {
    await chrome.storage.sync.clear();
  },

  // Export user data
  exportData: async () => {
    const data = await chrome.storage.sync.get(null);
    return JSON.stringify(data, null, 2);
  },

  // Import user data safely
  importData: async (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      await chrome.storage.sync.clear();
      await chrome.storage.sync.set(data);
      return true;
    } catch (e) {
      console.error('Invalid import data:', e);
      return false;
    }
  }
}; 