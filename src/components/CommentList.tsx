import { useState } from 'react';
import type { ReplyResDto } from '../types/place';
import { redirectToLogin } from '../utils/auth';

interface CommentItemProps {
  reply: ReplyResDto;
  currentUserId?: number | null;
  onDelete?: (replyId: number) => void;
  onEdit?: (replyId: number, content: string) => void;
  onReply?: (parentId: number, nickName: string) => void;
  isLoggedIn?: boolean;
}

function CommentItem({ reply, currentUserId, onDelete, onEdit, onReply, isLoggedIn }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(reply.content);

  // 본인 댓글 여부 — currentUserId가 null이면 항상 false
  const isMine = currentUserId != null && reply.userId === currentUserId;

  function handleEditSubmit() {
    const trimmed = editValue.trim();
    if (!trimmed) return;
    onEdit?.(reply.id, trimmed);
    setIsEditing(false);
  }

  function handleEditCancel() {
    setEditValue(reply.content);
    setIsEditing(false);
  }

  return (
    <div className="comment-item">
      <div className="profile-img" aria-hidden="true" />
      <div className="comment-content">
        <div className="nickname">{reply.nickName}</div>

        {isEditing ? (
          <div className="comment-edit-area">
            <input
              type="text"
              className="input-box"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleEditSubmit();
                if (e.key === 'Escape') handleEditCancel();
              }}
              autoFocus
            />
            <button
              type="button"
              className="btn-submit"
              onClick={handleEditSubmit}
              disabled={!editValue.trim()}
            >
              저장
            </button>
            <button type="button" className="comment-cancel-btn" onClick={handleEditCancel}>
              취소
            </button>
          </div>
        ) : (
          <div className="comment-text">{reply.content}</div>
        )}

        {!isEditing && (
          <div className="comment-actions">
            {/* 답글: 로그인 && depth=0 && !deleted && 타인 댓글만 */}
            {isLoggedIn && !reply.deleted && reply.depth === 0 && reply.userId !== currentUserId && onReply && (
              <button
                type="button"
                className="comment-reply-btn"
                onClick={() => onReply(reply.id, reply.nickName)}
              >
                답글
              </button>
            )}
            {/* 수정: 본인 && !deleted */}
            {isMine && !reply.deleted && onEdit && (
              <button
                type="button"
                className="comment-edit-btn"
                onClick={() => {
                  if (!redirectToLogin()) return;
                  setIsEditing(true);
                }}
              >
                수정
              </button>
            )}
            {/* 삭제: 본인 && !deleted */}
            {isMine && !reply.deleted && onDelete && (
              <button
                type="button"
                className="comment-delete-btn"
                onClick={() => onDelete(reply.id)}
              >
                삭제
              </button>
            )}
          </div>
        )}

        {(reply.replies ?? []).length > 0 && (
          <div className="sub-replies">
            {/* 대댓글(depth=1): onReply 미전달 + depth 체크로 답글 버튼 이중 차단 */}
            {(reply.replies ?? []).map((sub) => (
              <CommentItem
                key={sub.id}
                reply={sub}
                currentUserId={currentUserId}
                onDelete={onDelete}
                onEdit={onEdit}
                isLoggedIn={isLoggedIn}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface CommentListProps {
  replies: ReplyResDto[];
  currentUserId?: number | null;
  onDelete?: (replyId: number) => void;
  onEdit?: (replyId: number, content: string) => void;
  onReply?: (parentId: number, nickName: string) => void;
  isLoggedIn?: boolean;
}

export default function CommentList({ replies, currentUserId, onDelete, onEdit, onReply, isLoggedIn }: CommentListProps) {
  if (replies.length === 0) {
    return (
      <section className="comment-section">
        <h3 className="comment-title">댓글</h3>
        <p className="status-message">첫 번째 댓글을 남겨보세요.</p>
      </section>
    );
  }

  return (
    <section className="comment-section">
      <h3 className="comment-title">댓글</h3>
      <div className="comment-list">
        {replies.map((reply) => (
          <CommentItem
            key={reply.id}
            reply={reply}
            currentUserId={currentUserId}
            onDelete={onDelete}
            onEdit={onEdit}
            onReply={onReply}
            isLoggedIn={isLoggedIn}
          />
        ))}
      </div>
    </section>
  );
}
