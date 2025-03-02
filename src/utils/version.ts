export const VersionManager = {
  async checkAndMigrateData() {
    const { version } = await chrome.storage.sync.get('version');
    const currentVersion = chrome.runtime.getManifest().version;

    if (!version) {
      // First install
      await chrome.storage.sync.set({ version: currentVersion });
      return;
    }

    if (version !== currentVersion) {
      // Perform version-specific migrations here
      await this.migrateData(version, currentVersion);
      await chrome.storage.sync.set({ version: currentVersion });
    }
  },

  async migrateData(oldVersion: string, newVersion: string) {
    // Add version-specific migrations here
    console.log(`Migrating from ${oldVersion} to ${newVersion}`);
  }
}; 