import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const PopupContainer = styled.div`
  width: 300px;
  padding: 16px;
  background-color: #ffffff;
  color: #333333;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
`;

const Title = styled.h1`
  font-size: 18px;
  margin: 0;
  color: #ff0000;
`;

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ToggleLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const ToggleSwitch = styled.div<{ checked: boolean }>`
  width: 40px;
  height: 20px;
  background-color: ${props => props.checked ? '#ff0000' : '#ccc'};
  border-radius: 20px;
  position: relative;
  transition: background-color 0.2s;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.checked ? '22px' : '2px'};
    width: 16px;
    height: 16px;
    background-color: white;
    border-radius: 50%;
    transition: left 0.2s;
  }
`;

const ToggleText = styled.span`
  font-size: 14px;
`;

interface Settings {
  hideHomeFeed: boolean;
  hideSidebar: boolean;
  hideComments: boolean;
  hideShorts: boolean;
}

const Popup: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    hideHomeFeed: true,
    hideSidebar: true,
    hideComments: true,
    hideShorts: true,
  });

  useEffect(() => {
    // Load saved settings
    chrome.storage.sync.get(['settings'], (result) => {
      if (result.settings) {
        setSettings(result.settings);
      }
    });
  }, []);

  const handleToggle = async (key: keyof Settings) => {
    const newSettings = {
      ...settings,
      [key]: !settings[key],
    };
    
    // Save settings
    await chrome.storage.sync.set({ settings: newSettings });
    setSettings(newSettings);
    
    // Send message to content script
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(tabs[0].id, { 
        type: 'SETTINGS_UPDATED',
        settings: newSettings 
      });
    }
  };

  return (
    <PopupContainer>
      <Header>
        <Title>YouTube Focus Mode</Title>
      </Header>
      <SettingsContainer>
        <ToggleLabel>
          <ToggleText>Hide Homepage Feed</ToggleText>
          <ToggleSwitch 
            checked={settings.hideHomeFeed}
            onClick={() => handleToggle('hideHomeFeed')}
          />
        </ToggleLabel>
        <ToggleLabel>
          <ToggleText>Hide Video Sidebar</ToggleText>
          <ToggleSwitch 
            checked={settings.hideSidebar}
            onClick={() => handleToggle('hideSidebar')}
          />
        </ToggleLabel>
        <ToggleLabel>
          <ToggleText>Hide Comments</ToggleText>
          <ToggleSwitch 
            checked={settings.hideComments}
            onClick={() => handleToggle('hideComments')}
          />
        </ToggleLabel>
        <ToggleLabel>
          <ToggleText>Hide Shorts</ToggleText>
          <ToggleSwitch 
            checked={settings.hideShorts}
            onClick={() => handleToggle('hideShorts')}
          />
        </ToggleLabel>
      </SettingsContainer>
    </PopupContainer>
  );
};

export default Popup; 