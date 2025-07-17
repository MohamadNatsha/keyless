import { IconAlertTriangle } from '@tabler/icons-react';
import React, { createContext, useState, useEffect, useCallback } from 'react';

export const DirtyContext = createContext<{
  isDirty: boolean;
  setIsDirty: (dirty: boolean) => void;
  showWarning: boolean;
  setShowWarning: (show: boolean, onConfirm?: () => void) => void;
}>({
  isDirty: false,
  setIsDirty: () => {},
  showWarning: false,
  setShowWarning: () => {},
});

export const DirtyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDirty, setIsDirty] = useState(false);
  const [showWarning, setShowWarningState] = useState(false);
  const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void) | null>(null);

  // Block browser navigation if dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // setShowWarning now takes a callback
  const setShowWarning = (show: boolean, onConfirm?: () => void) => {
    setShowWarningState(show);
    if (show && onConfirm) {
      setOnConfirmCallback(() => onConfirm);
    } else if (!show) {
      setOnConfirmCallback(null);
    }
  };

  // Modal for in-app navigation (showWarning)
  const handleModalConfirm = useCallback(() => {
    setShowWarningState(false);
    setIsDirty(false);
    if (onConfirmCallback) {
      onConfirmCallback();
      setOnConfirmCallback(null);
    }
  }, [onConfirmCallback]);
  
  const handleModalCancel = useCallback(() => {
    setShowWarningState(false);
    setOnConfirmCallback(null);
  }, []);

  return (
    <DirtyContext.Provider value={{ isDirty, setIsDirty, showWarning, setShowWarning }}>
      {children}
      {showWarning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 transition-all "></div>
            <div className="relative bg-base-100 p-8 rounded-xl shadow-2xl border border-base-content/10 w-full max-w-xs sm:max-w-sm animate-pop-in">
              <div className="flex flex-col items-center">
                <IconAlertTriangle className="mb-3 text-warning w-12 h-12"/>
                <div className="mb-4 text-lg font-semibold text-center text-base-content">You have unsaved changes. Are you sure you want to leave?</div>
                <div className="flex gap-3 w-full justify-end mt-2">
                  <button className="px-4 py-2 rounded-md font-medium" onClick={handleModalCancel}>Stay</button>
                  <button className="bg-warning text-warning-content px-4 py-2 rounded-md font-medium shadow-sm hover:brightness-110" onClick={handleModalConfirm}>Leave</button>
                </div>
              </div>
            </div>
          </div>
        )}

    </DirtyContext.Provider>
  );
}; 