import { useState } from 'react';

interface CommentInputProps {
  isLoggedIn: boolean;
  /** 실제 API 호출은 page 레벨(PlaceDetail)에서 처리 */
  onSubmit: (content: string) => void;
}

export default function CommentInput({ isLoggedIn, onSubmit }: CommentInputProps) {
  const [value, setValue] = useState('');

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue('');
  }

  return (
    <div className="comment-input-area">
      <input
        type="text"
        className="input-box"
        placeholder={isLoggedIn ? '댓글을 남겨보세요.' : '로그인 후 댓글을 남겨보세요.'}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
        disabled={!isLoggedIn}
      />
      <button
        type="button"
        className="btn-submit"
        onClick={handleSubmit}
        disabled={!isLoggedIn || !value.trim()}
      >
        게시
      </button>
    </div>
  );
}
