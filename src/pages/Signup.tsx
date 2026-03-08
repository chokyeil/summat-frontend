import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../api/auth';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await signup({ email, nickname, password });
      navigate('/login');
    } catch {
      setError('회원가입에 실패했습니다.');
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
          <div className="signup-field">
            <label htmlFor="email" className="signup-label">이메일</label>
            <input
              id="email"
              type="email"
              className="signup-input"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

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
          </div>

          {error && <p className="signup-error" role="alert">{error}</p>}

          <button type="submit" className="btn-signup" disabled={loading}>
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
