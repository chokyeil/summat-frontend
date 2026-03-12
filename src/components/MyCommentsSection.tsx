import { Link } from 'react-router-dom';
import type { MyReplyResDto } from '../types/user';

interface MyCommentsSectionProps {
  comments: MyReplyResDto[];
}

export default function MyCommentsSection({ comments }: MyCommentsSectionProps) {
  return (
    <section className="mypage-section">
      <div className="mypage-section-header">
        <h3 className="mypage-section-title">내가 쓴 댓글</h3>
      </div>
      {comments.length === 0 ? (
        <div className="empty-state">아직 작성한 댓글이 없어요.</div>
      ) : (
        <ul className="mypage-comment-list">
          {comments.map((comment) => (
            <li key={comment.replyId} className="mypage-comment-item">
              <Link to={`/places/${comment.placeId}`} className="mypage-comment-place">
                {comment.placeName}
                {comment.depth === 1 && ' (대댓글)'}
              </Link>
              <div className="mypage-comment-text">{comment.content}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
