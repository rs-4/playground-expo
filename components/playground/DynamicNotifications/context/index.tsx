import React, { createContext, useContext, useState, useCallback } from 'react';
import DynamicIslandNotification from '../index';

type DynamicIslandContextType = {
  showNotification: (message: string) => void;
};

const DynamicIslandContext = createContext<DynamicIslandContextType | undefined>(undefined);

export const useDynamicIsland = () => {
  const context = useContext(DynamicIslandContext);
  if (!context) {
    throw new Error('useDynamicIsland must be used within a DynamicIslandProvider');
  }
  return context;
};

export const DynamicIslandProvider = ({ children }: { children: React.ReactNode }) => {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  const showNotification = useCallback((text: string) => {
    setMessage(text);
    setVisible(true);
  }, []);

  return (
    <DynamicIslandContext.Provider value={{ showNotification }}>
      {children}
      {visible && <DynamicIslandNotification message={message} onHide={() => setVisible(false)} />}
    </DynamicIslandContext.Provider>
  );
};
