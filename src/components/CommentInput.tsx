import { useState } from 'react';

interface CommentInputProps {
  isLoggedIn: boolean;
  /** 실제 API 호출은 page 레벨(PlaceDetail)에서 처리 */
  onSubmit: (content: string) => void;
  /** 답글 대상 정보. null이면 일반 댓글 모드 */
  replyingTo?: { nickName: string } | null;
  /** 답글 모드 취소 */
  onCancelReply?: () => void;
  /** API 요청 중일 때 true — 입력/버튼 비활성화 */
  isSubmitting?: boolean;
}

export default function CommentInput({ isLoggedIn, onSubmit, replyingTo, onCancelReply, isSubmitting }: CommentInputProps) {
  const [value, setValue] = useState('');

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue('');
  }

  const placeholder = isLoggedIn
    ? replyingTo
      ? `@${replyingTo.nickName}에게 답글 달기...`
      : '댓글을 남겨보세요.'
    : '로그인 후 댓글을 남겨보세요.';

  return (
    <div className="comment-input-area">
      {replyingTo && (
        <div className="reply-target">
          <span>@{replyingTo.nickName}에게 답글</span>
          <button
            type="button"
            className="reply-cancel-btn"
            onClick={onCancelReply}
            aria-label="답글 취소"
          >
            ✕
          </button>
        </div>
      )}
      <input
        type="text"
        className="input-box"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
        disabled={!isLoggedIn || isSubmitting}
      />
      <button
        type="button"
        className="btn-submit"
        onClick={handleSubmit}
        disabled={!isLoggedIn || !value.trim() || isSubmitting}
      >
        게시
      </button>
    </div>
  );
}
