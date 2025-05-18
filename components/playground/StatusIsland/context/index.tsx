import React, { createContext, useContext, useState, useCallback } from 'react';
import StatusIsland from '../index';

type StatusIslandContextType = {
  success: (message?: string) => void;
  error: (message?: string) => void;
};

const StatusIslandContext = createContext<StatusIslandContextType | undefined>(undefined);

export const useStatusIsland = () => {
  const context = useContext(StatusIslandContext);
  if (!context) {
    throw new Error('useStatusIsland must be used within a StatusIslandProvider');
  }
  return context;
};

export const StatusIslandProvider = ({ children }: { children: React.ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [statusType, setStatusType] = useState<'success' | 'error'>('success');
  const [message, setMessage] = useState<string | undefined>(undefined);

  const success = useCallback((text?: string) => {
    setStatusType('success');
    setMessage(text);
    setVisible(true);
  }, []);

  const error = useCallback((text?: string) => {
    setStatusType('error');
    setMessage(text);
    setVisible(true);
  }, []);

  const handleHide = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <StatusIslandContext.Provider value={{ success, error }}>
      {children}
      {visible && <StatusIsland statusType={statusType} message={message} onHide={handleHide} />}
    </StatusIslandContext.Provider>
  );
};
