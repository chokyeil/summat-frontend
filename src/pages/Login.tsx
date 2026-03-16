import axios from 'axios';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import type { ApiResponse } from '../types/auth';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const next = params.get('next') ?? '/places';
  const expired = params.get('expired') === '1';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(
    expired ? '로그인 시간이 만료되어 자동으로 로그아웃되었습니다. 다시 로그인해주세요.' : null
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await login({ email, password });
      localStorage.setItem('accessToken', data.accessToken);
      navigate(next, { replace: true });
    } catch (err) {
      const apiMessage = axios.isAxiosError(err)
        ? (err.response?.data as ApiResponse | undefined)?.message
        : undefined;
      setError(apiMessage ?? '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-card">
        <div className="login-logo">숨맛</div>
        <h1 className="login-title">로그인</h1>
        <p className="login-subtitle">숨겨진 맛을 찾아서</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label htmlFor="email" className="login-label">이메일</label>
            <input
              id="email"
              type="email"
              className="login-input"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="login-field">
            <label htmlFor="password" className="login-label">비밀번호</label>
            <input
              id="password"
              type="password"
              className="login-input"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          {error && <p className="login-error" role="alert">{error}</p>}
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="login-footer">
          <span>계정이 없으신가요?</span>
          <Link to="/signup" className="login-link">회원가입</Link>
        </div>
      </div>
    </main>
  );
}
