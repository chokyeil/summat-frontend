import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// 모든 요청에 accessToken 자동 첨부
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 인증 만료 전역 처리
// - 401: 토큰이 있는 상태에서 응답 시 accessToken 만료로 판단
// - 403: 권한 없음 — 토큰 제거 후 로그인 페이지로 이동
// - 중복 처리 방지: isHandlingAuthExpiry 플래그로 동시 다발 요청 시 한 번만 처리
// - window.location.replace 사용: 페이지 전체 새로 로드 → Header 등 모든 컴포넌트가 토큰 없는 상태로 리마운트
let isHandlingAuthExpiry = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && !isHandlingAuthExpiry) {
      const status = error.response?.status;
      const hasToken = localStorage.getItem('accessToken') !== null;

      if (status === 401 && hasToken) {
        // 토큰 만료: 제거 후 로그인 페이지로 이동
        isHandlingAuthExpiry = true;
        localStorage.removeItem('accessToken');
        const next = encodeURIComponent(window.location.pathname);
        window.location.replace(`/login?expired=1&next=${next}`);
        // 페이지가 새로 로드되므로 플래그는 자동 초기화됨
      } else if (status === 403 && hasToken) {
        // 권한 없음: 토큰 제거 후 로그인 페이지로 이동
        isHandlingAuthExpiry = true;
        localStorage.removeItem('accessToken');
        const next = encodeURIComponent(window.location.pathname);
        window.location.replace(`/login?expired=1&next=${next}`);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
