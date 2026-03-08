import type { ReplyResDto } from '../types/place';

function CommentItem({ reply }: { reply: ReplyResDto }) {
  return (
    <div className="comment-item">
      <div className="profile-img" aria-hidden="true" />
      <div className="comment-content">
        <div className="nickname">{reply.nickName}</div>
        <div className="comment-text">{reply.content}</div>
        {(reply.replies ?? []).length > 0 && (
          <div className="sub-replies">
            {(reply.replies ?? []).map((sub) => (
              <CommentItem key={sub.id} reply={sub} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface CommentListProps {
  replies: ReplyResDto[];
}

export default function CommentList({ replies }: CommentListProps) {
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
          <CommentItem key={reply.id} reply={reply} />
        ))}
      </div>
    </section>
  );
}
