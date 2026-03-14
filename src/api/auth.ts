import api from './index';
import type {
  ApiResponse,
  LoginRequest,
  LoginResponseData,
  SignupRequest,
  EmailVerifyResData,
} from '../types/auth';

/**
 * POST /auth/login — 로그인
 * 성공 시 LoginResponseData.accessToken을 localStorage['accessToken']에 저장 (Login.tsx에서 처리)
 */
export async function login(data: LoginRequest): Promise<LoginResponseData> {
  const res = await api.post<ApiResponse<LoginResponseData>>('/auth/login', data);
  return res.data.data;
}

/**
 * GET /summatUsers/id-check?email=... — 이메일 중복 확인
 * 성공(사용 가능): 200 + message. 실패(중복): 4xx + message.
 * 성공 시 res.data.message를 반환 — 호출부에서 UI 안내 메시지로 활용.
 * 실패 시 axios 에러로 throw → 호출부 catch에서 err.response.data.message 파싱.
 */
export async function checkEmailDuplicate(email: string): Promise<string> {
  const res = await api.get<ApiResponse<unknown>>('/summatUsers/id-check', { params: { email } });
  return res.data.message;
}

/**
 * POST /auth/email/send — 이메일 인증번호 발송
 * purpose: 'SIGNUP'. OTP TTL 10분. 재발송 쿨다운 60초.
 * 성공 시 res.data.message를 반환 — 호출부에서 UI 안내 메시지로 활용.
 */
export async function sendSignupEmailCode(email: string): Promise<string> {
  const res = await api.post<ApiResponse<unknown>>('/auth/email/send', {
    email,
    purpose: 'SIGNUP',
  });
  return res.data.message;
}

/**
 * POST /auth/email/verify — 이메일 인증번호 검증
 * purpose: 'SIGNUP'. 성공 시 signupToken(1회성) 반환.
 * - 백엔드 응답 data가 { signupToken: "..." } 객체이거나 문자열 자체인 경우 모두 처리.
 * signupToken은 최종 회원가입 요청(POST /summatUsers/signup)에 반드시 포함.
 */
export async function verifySignupEmailCode(email: string, code: string): Promise<string> {
  const res = await api.post<ApiResponse<EmailVerifyResData | string>>('/auth/email/verify', {
    email,
    code,
    purpose: 'SIGNUP',
  });
  const d = res.data.data;
  // data가 문자열이면 token 자체, 객체면 signupToken 프로퍼티
  const token = typeof d === 'string' ? d : (d as EmailVerifyResData)?.signupToken;
  if (!token) throw new Error('인증 토큰을 받지 못했습니다. 다시 시도해주세요.');
  return token;
}

/**
 * POST /summatUsers/signup — 최종 회원가입
 * signupToken 없으면 호출 불가 (Signup.tsx에서 상태 제어로 차단).
 * 성공 시 /login 이동.
 */
export async function signup(data: SignupRequest): Promise<void> {
  await api.post<ApiResponse>('/summatUsers/signup', data);
}
