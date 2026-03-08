import api from './index';
import type { ApiResponse, LoginRequest, LoginResponseData, SignupRequest } from '../types/auth';

/**
 * POST /auth/login — 로그인
 * 성공 시 LoginResponseData.accessToken을 localStorage['accessToken']에 저장 (Login.tsx에서 처리)
 */
export async function login(data: LoginRequest): Promise<LoginResponseData> {
  const res = await api.post<ApiResponse<LoginResponseData>>('/auth/login', data);
  return res.data.data;
}

// TODO: 백엔드 회원가입 엔드포인트 및 요청/응답 구조 확인 후 구현
export async function signup(data: SignupRequest): Promise<void> {
  await api.post<ApiResponse>('/auth/signup', data);
}
