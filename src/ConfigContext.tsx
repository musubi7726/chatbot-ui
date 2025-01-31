import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';

export interface ConfigType {
  REACT_APP_BASE_URL?: string;
}

const ConfigContext = createContext<ConfigType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<ConfigType | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      let configUrl = './public/config.json';
      if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        configUrl = './public/config-local.json';
      }
      try {
        const response = await fetch(configUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: ConfigType = await response.json();
        setConfig(data);
      } catch (error) {
        console.error('Error loading config:', error);
      }
    };

    fetchConfig();
  }, []);

  return <ConfigContext.Provider value={config || {}}>{children}</ConfigContext.Provider>;
};

export const useConfig = (): ConfigType => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

export { ConfigContext };
