export class ErrorLogger {
  private static readonly MAX_LOGS = 100;
  
  static async logError(error: Error, context?: string) {
    const timestamp = new Date().toISOString();
    const errorLog = {
      timestamp,
      message: error.message,
      stack: error.stack,
      context
    };

    try {
      const { errorLogs = [] } = await chrome.storage.local.get('errorLogs');
      errorLogs.push(errorLog);
      
      // Keep only last MAX_LOGS entries
      while (errorLogs.length > this.MAX_LOGS) {
        errorLogs.shift();
      }
      
      await chrome.storage.local.set({ errorLogs });
    } catch (e) {
      console.error('Failed to log error:', e);
    }
  }
} 