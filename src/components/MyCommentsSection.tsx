import type { MyCommentDto } from '../types/user';

interface MyCommentsSectionProps {
  comments: MyCommentDto[];
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
            <li key={comment.id} className="mypage-comment-item">
              <div className="mypage-comment-place">{comment.placeName}</div>
              <div className="mypage-comment-text">{comment.content}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
