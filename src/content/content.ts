import { ErrorLogger } from '../utils/errorHandling';
import { debounce } from '../utils/performance';

export {};

interface Settings {
  hideHomeFeed: boolean;
  hideSidebar: boolean;
  hideComments: boolean;
  hideShorts: boolean;
}

export class YouTubeFocusMode {
  private settings: Settings = {
    hideHomeFeed: true,
    hideSidebar: true,
    hideComments: true,
    hideShorts: true,
  };

  private styleElement: HTMLStyleElement | null = null;
  private readonly applySettingsDebounced: () => Promise<void>;

  constructor() {
    this.applySettingsDebounced = debounce(this.applySettings.bind(this), 150);
    this.init().catch(e => ErrorLogger.logError(e, 'YouTubeFocusMode init'));
  }

  private async init() {
    try {
      await this.loadSettings();
      this.setupMessageListener();
      this.applySettings();
      this.setupMutationObserver();
    } catch (e) {
      ErrorLogger.logError(e as Error, 'init');
    }
  }

  private async loadSettings() {
    const result = await chrome.storage.sync.get(['settings']);
    if (result.settings) {
      this.settings = result.settings;
    }
  }

  private setupMessageListener() {
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === 'SETTINGS_UPDATED') {
        this.settings = message.settings;
        this.applySettings();
      }
    });
  }

  private applySettings() {
    if (this.styleElement) {
      this.styleElement.remove();
    }

    this.styleElement = document.createElement('style');
    let css = '';

    if (this.settings.hideHomeFeed) {
      css += `
        ytd-rich-grid-renderer { display: none !important; }
        ytd-browse[page-subtype="home"] { display: none !important; }
      `;
    }

    if (this.settings.hideSidebar) {
      css += `
        #secondary { display: none !important; }
        #related { display: none !important; }
      `;
    }

    if (this.settings.hideComments) {
      css += `
        #comments { display: none !important; }
        ytd-comments { display: none !important; }
      `;
    }

    if (this.settings.hideShorts) {
      css += `
        ytd-reel-shelf-renderer { display: none !important; }
        ytd-mini-guide-entry-renderer[aria-label="Shorts"] { display: none !important; }
        ytd-guide-entry-renderer[title="Shorts"] { display: none !important; }
        ytd-rich-shelf-renderer:has([title*="Shorts"]) { display: none !important; }
      `;
    }

    this.styleElement.textContent = css;
    document.head.appendChild(this.styleElement);
  }

  private setupMutationObserver() {
    const observer = new MutationObserver(() => {
      this.applySettingsDebounced();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}

new YouTubeFocusMode(); 