/**
 * 디버그 로그 유틸리티.
 * VITE_ENABLE_DEBUG=true 일 때만 출력됩니다.
 * production 빌드에서는 import.meta.env.VITE_ENABLE_DEBUG가 'false'로 정적 치환되어
 * 트리 셰이킹으로 console.log 호출이 제거됩니다.
 */
const DEBUG = import.meta.env.VITE_ENABLE_DEBUG === 'true';

export const logger = {
  log: (...args: unknown[]) => {
    if (DEBUG) console.log(...args);
  },
  warn: (...args: unknown[]) => {
    if (DEBUG) console.warn(...args);
  },
  error: (...args: unknown[]) => {
    if (DEBUG) console.error(...args);
  },
};
