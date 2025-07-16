import React, { createContext, useState } from 'react';

export const DirtyContext = createContext<{
  isDirty: boolean;
  setIsDirty: (dirty: boolean) => void;
}>({
  isDirty: false,
  setIsDirty: () => {},
});

export const DirtyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDirty, setIsDirty] = useState(false);
  return (
    <DirtyContext.Provider value={{ isDirty, setIsDirty }}>
      {children}
    </DirtyContext.Provider>
  );
}; 