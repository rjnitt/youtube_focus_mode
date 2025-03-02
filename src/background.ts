export {}
chrome.runtime.onInstalled.addListener(async () => {
  // Set up uninstall URL if you have one
  chrome.runtime.setUninstallURL('https://your-feedback-form.com');
}); 