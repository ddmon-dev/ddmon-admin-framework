'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import type { AppHeaderConfig } from './types';

type SetConfigFn = (config: AppHeaderConfig | null) => void;

// setConfig만 제공하는 Context (변경되지 않음)
const SetConfigContext = createContext<SetConfigFn | null>(null);

// config 값을 제공하는 Context (AppHeader에서만 사용)
const ConfigContext = createContext<AppHeaderConfig | null>(null);

export function AppHeaderProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfigState] = useState<AppHeaderConfig | null>(null);

  // useCallback으로 안정적인 참조 유지
  const setConfig = useCallback<SetConfigFn>((newConfig) => {
    setConfigState(newConfig);
  }, []);

  return (
    <SetConfigContext.Provider value={setConfig}>
      <ConfigContext.Provider value={config}>
        {children}
      </ConfigContext.Provider>
    </SetConfigContext.Provider>
  );
}

/**
 * 헤더 설정 함수만 가져옴 (config 변경에 반응하지 않음)
 */
export function useSetAppHeader() {
  const setConfig = useContext(SetConfigContext);
  if (!setConfig) {
    throw new Error('useSetAppHeader must be used within AppHeaderProvider');
  }
  return setConfig;
}

/**
 * 현재 헤더 config 가져옴 (AppHeader에서만 사용)
 */
export function useAppHeaderConfig() {
  return useContext(ConfigContext);
}

// 하위 호환성을 위해 유지 (deprecated)
export function useAppHeaderContext() {
  const config = useContext(ConfigContext);
  const setConfig = useContext(SetConfigContext);
  if (!setConfig) {
    throw new Error('useAppHeaderContext must be used within AppHeaderProvider');
  }
  return { config, setConfig };
}
