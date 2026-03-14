import axios from 'axios';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { checkEmailDuplicate, sendSignupEmailCode, verifySignupEmailCode, signup } from '../api/auth';

export default function Signup() {
  // 이메일 + 중복 확인 상태
  const [email, setEmail] = useState('');
  const [emailDupChecked, setEmailDupChecked] = useState(false);
  const [emailDupMsg, setEmailDupMsg] = useState<string | null>(null);
  const [dupLoading, setDupLoading] = useState(false);

  // OTP 인증 상태
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpMsg, setOtpMsg] = useState<string | null>(null);
  const [otpMsgType, setOtpMsgType] = useState<'success' | 'error'>('error');
  const [signupToken, setSignupToken] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [sendLoading, setSendLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  // 사용자 정보 + 최종 제출 상태
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 60초 쿨다운 타이머 — cooldown > 0 동안 1초마다 감소
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  /** 이메일 형식 검증 — API 호출 전 프론트 1차 검증 */
  function isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  /** 에러 응답에서 message 추출 (보수적 파싱) */
  function extractMessage(err: unknown, fallback: string): string {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as Record<string, unknown> | undefined;
      if (typeof data?.message === 'string') return data.message;
    }
    if (err instanceof Error && err.message) return err.message;
    return fallback;
  }

  /** 이메일 변경 — setEmail만 담당 */
  function handleEmailChange(value: string) {
    setEmail(value);
  }

  /** 이메일 중복 확인
   * A안 정책:
   * - 같은 이메일: 중복확인 성공 시 OTP 상태 복원
   * - 다른 이메일: 이전 OTP 세션 폐기 + 안내 메시지 표시 후 새 플로우 진행
   */
  async function handleDupCheck() {
    if (!isValidEmail(email)) {
      setEmailDupMsg('올바른 이메일 형식이 아닙니다.');
      setEmailDupChecked(false);
      return;
    }

    const savedOtpEmail = sessionStorage.getItem('otpEmail');
    const savedSentAt = sessionStorage.getItem('otpSentAt');

    // 다른 이메일로 새 플로우 시작 확정 → 이전 OTP 세션 폐기 + 안내 메시지
    if (savedOtpEmail && email !== savedOtpEmail) {
      sessionStorage.removeItem('otpEmail');
      sessionStorage.removeItem('otpSentAt');
      setOtpSent(false);
      setOtp('');
      setSignupToken(null);
      setOtpMsg(null);
      setOtpMsgType('error');
      setCooldown(0);
      setError(null);
      setEmailDupMsg('다른 이메일로 인증을 시작하면 이전 인증 진행 상태는 초기화됩니다.');
    }

    setDupLoading(true);
    // emailDupMsg를 null로 초기화하지 않음 → 안내 메시지가 로딩 중에도 표시됨
    setEmailDupChecked(false);
    try {
      const msg = await checkEmailDuplicate(email);
      setEmailDupMsg(msg);
      setEmailDupChecked(true);
      setError(null);

      // 같은 이메일 & 유효한 OTP 세션 → 중복확인 성공 시 OTP 상태 복원
      if (savedOtpEmail === email && savedSentAt) {
        const elapsed = Math.floor((Date.now() - parseInt(savedSentAt, 10)) / 1000);
        const remaining = 60 - elapsed;
        setOtpSent(true);
        setCooldown(remaining > 0 ? remaining : 0);
      } else {
        setOtpMsg(null);
        setOtpMsgType('error');
      }
    } catch (err) {
      setEmailDupMsg(extractMessage(err, '중복 확인에 실패했습니다.'));
    } finally {
      setDupLoading(false);
    }
  }

  /** 인증번호 발송 (초기 발송 + 재발송 공통) */
  async function handleSendCode() {
    if (!isValidEmail(email)) {
      setOtpMsg('올바른 이메일 형식이 아닙니다.');
      return;
    }
    setSendLoading(true);
    setOtpMsg(null);
    try {
      const msg = await sendSignupEmailCode(email);
      setOtpSent(true);
      setCooldown(60);
      setOtpMsg(msg);
      setOtpMsgType('success');
      sessionStorage.setItem('otpEmail', email);
      sessionStorage.setItem('otpSentAt', Date.now().toString());
    } catch (err) {
      setOtpMsg(extractMessage(err, '인증번호 발송에 실패했습니다.'));
      setOtpMsgType('error');
    } finally {
      setSendLoading(false);
    }
  }

  /** 인증번호 검증 → signupToken 저장 */
  async function handleVerify() {
    setVerifyLoading(true);
    setOtpMsg(null);
    try {
      const token = await verifySignupEmailCode(email, otp);
      setSignupToken(token);
      setOtpMsg('이메일 인증이 완료되었습니다.');
      setOtpMsgType('success');
      sessionStorage.removeItem('otpEmail');
      sessionStorage.removeItem('otpSentAt');
    } catch (err) {
      setOtpMsg(extractMessage(err, '인증 확인에 실패했습니다.'));
      setOtpMsgType('error');
    } finally {
      setVerifyLoading(false);
    }
  }

  /** 최종 회원가입 제출 */
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!signupToken) {
      setError('이메일 인증을 먼저 완료해주세요.');
      return;
    }
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await signup({ email, userPw: password, userNickName: nickname, signupToken });
      sessionStorage.removeItem('otpEmail');
      sessionStorage.removeItem('otpSentAt');
      navigate('/login');
    } catch (err) {
      setError(extractMessage(err, '회원가입에 실패했습니다.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="signup-page">
      <div className="signup-card">
        <div className="signup-header">
          <Link to="/places" className="signup-logo">숨맛</Link>
          <h1 className="signup-title">숨맛 시작하기</h1>
          <p className="signup-subtitle">숨맛에 가입하고 나만의 카페와 맛집을 저장해보세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">

          {/* 이메일 + 중복 확인 */}
          <div className="signup-field">
            <label htmlFor="email" className="signup-label">이메일</label>
            <div className="signup-input-row">
              <input
                id="email"
                type="email"
                className="signup-input"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                required
                autoComplete="email"
              />
              <button
                type="button"
                className="btn-signup-outline"
                onClick={handleDupCheck}
                disabled={dupLoading || !email.trim()}
              >
                {dupLoading ? '확인 중' : '중복확인'}
              </button>
            </div>
            {emailDupMsg && (
              <p className={emailDupChecked ? 'signup-success' : 'signup-error'} role="alert">
                {emailDupMsg}
              </p>
            )}
          </div>

          {/* 이메일 인증 — 중복 확인 통과 후 표시 */}
          {emailDupChecked && (
            <div className="signup-field">
              <label className="signup-label">이메일 인증</label>
              {/* 재발송 버튼 — signupToken 존재 시(인증 완료 후) 숨김 */}
              {!signupToken && (
                <button
                  type="button"
                  className="btn-signup-outline"
                  onClick={handleSendCode}
                  disabled={sendLoading || cooldown > 0}
                >
                  {sendLoading
                    ? '발송 중...'
                    : cooldown > 0
                    ? `재발송 (${cooldown}초)`
                    : otpSent
                    ? '재발송'
                    : '인증번호 발송'}
                </button>
              )}

              {/* 인증번호 입력 — 발송 후, signupToken 없는 동안 표시 */}
              {otpSent && !signupToken && (
                <div className="signup-input-row">
                  <input
                    type="text"
                    className="signup-input"
                    placeholder="인증번호 6자리"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                  />
                  <button
                    type="button"
                    className="btn-signup-outline"
                    onClick={handleVerify}
                    disabled={verifyLoading || !otp.trim()}
                  >
                    {verifyLoading ? '확인 중' : '인증 확인'}
                  </button>
                </div>
              )}

              {otpMsg && (
                <p className={otpMsgType === 'success' ? 'signup-success' : 'signup-error'} role="alert">
                  {otpMsg}
                </p>
              )}
            </div>
          )}

          {/* 닉네임 */}
          <div className="signup-field">
            <label htmlFor="nickname" className="signup-label">닉네임</label>
            <input
              id="nickname"
              type="text"
              className="signup-input"
              placeholder="숨맛에서 사용할 이름"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              autoComplete="nickname"
            />
            <p className="signup-helper">멋진 닉네임으로 활동해보세요!</p>
          </div>

          {/* 비밀번호 */}
          <div className="signup-field">
            <label htmlFor="password" className="signup-label">비밀번호</label>
            <input
              id="password"
              type="password"
              className="signup-input"
              placeholder="비밀번호 (8자 이상)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          {/* 비밀번호 확인 */}
          <div className="signup-field">
            <label htmlFor="passwordConfirm" className="signup-label">비밀번호 확인</label>
            <input
              id="passwordConfirm"
              type="password"
              className="signup-input"
              placeholder="비밀번호를 한 번 더 입력해주세요"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
              autoComplete="new-password"
            />
            {passwordConfirm && (
              password === passwordConfirm
                ? <p className="signup-success">비밀번호가 일치합니다.</p>
                : <p className="signup-error">비밀번호가 일치하지 않습니다.</p>
            )}
          </div>

          {error && <p className="signup-error" role="alert">{error}</p>}

          {/* 회원가입 완료 버튼 — signupToken 존재 + 필드 전체 입력 + 비밀번호 일치 시 활성 */}
          <button
            type="submit"
            className="btn-signup"
            disabled={!signupToken || !nickname.trim() || !password || !passwordConfirm || password !== passwordConfirm || loading}
          >
            {loading ? '가입 중...' : '회원가입 완료'}
          </button>
        </form>

        <div className="signup-footer">
          <span>이미 계정이 있으신가요?</span>
          <Link to="/login" className="signup-link">로그인</Link>
        </div>
      </div>
    </main>
  );
}
