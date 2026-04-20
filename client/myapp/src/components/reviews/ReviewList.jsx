import React, { useState } from "react";
import "./reviews.css";

const AVATAR_PALETTES = [
  { bg: "#EEEDFE", color: "#3C3489" },
  { bg: "#E1F5EE", color: "#085041" },
  { bg: "#FBEAF0", color: "#72243E" },
  { bg: "#E6F1FB", color: "#0C447C" },
  { bg: "#FAEEDA", color: "#633806" },
];

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getAvatarPalette(name = "") {
  let hash = 0;
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) % AVATAR_PALETTES.length;
  return AVATAR_PALETTES[Math.abs(hash)];
}

function AverageBreakdown({ reviews }) {
  if (!reviews.length) return null;

  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const filled = Math.round(avg);

  const barWidth = (star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    return reviews.length ? Math.round((count / reviews.length) * 100) : 0;
  };

  return (
    <div className="rv-avg-block">
      <div className="rv-avg-score">
        <span className="rv-avg-num">{avg.toFixed(1)}</span>
        <div className="rv-avg-stars">
          {"★".repeat(filled)}
          <span className="rv-avg-empty">{"★".repeat(5 - filled)}</span>
        </div>
        <span className="rv-avg-label">out of 5</span>
      </div>
      <div className="rv-bars">
        {[5, 4, 3, 2, 1].map((star) => (
          <div className="rv-bar-row" key={star}>
            <span className="rv-bar-label">{star}</span>
            <div className="rv-bar-bg">
              <div
                className="rv-bar-fill"
                style={{ width: `${barWidth(star)}%` }}
              />
            </div>
            <span className="rv-bar-pct">{barWidth(star)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const ReviewItem = ({ review, currentUser, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [editRating, setEditRating] = useState(review.rating);
  const [editComment, setEditComment] = useState(review.text || review.comment || "");

  const name = review.user?.name || review.user?.username || "Anonymous";
  const palette = getAvatarPalette(name);
  const date = new Date(review.createdAt || Date.now()).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  
  const isOwner = currentUser && (review.user?._id === currentUser.userId || review.user?.id === currentUser.userId || review.user === currentUser.userId);

  const handleSave = () => {
    onEdit(review.id || review._id, { rating: editRating, comment: editComment });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="review-card">
        <div className="review-card-top" style={{ marginBottom: '1rem' }}>
          <strong>Edit your review</strong>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Rating: </label>
          <select value={editRating} onChange={(e) => setEditRating(Number(e.target.value))}>
            {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v} Star{v > 1 && 's'}</option>)}
          </select>
        </div>
        <textarea
          style={{ width: "100%", minHeight: "80px", padding: "0.5rem", borderRadius: "8px", border: "1px solid #ccc", marginBottom: "1rem" }}
          value={editComment}
          onChange={(e) => setEditComment(e.target.value)}
        />
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button className="btn btn-primary" style={{ padding: '0.4rem 1rem' }} onClick={handleSave}>Save</button>
          <button className="btn btn-secondary" style={{ padding: '0.4rem 1rem' }} onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="review-card">
      <div className="review-card-top">
        <div className="review-avatar" style={{ background: palette.bg, color: palette.color }}>
          {getInitials(name)}
        </div>
        <div className="review-meta" style={{ flexGrow: 1 }}>
          <span className="review-author">{name}</span>
          <span className="review-date">{date}</span>
        </div>
        {isOwner && (
            <div className="review-actions" style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                {isConfirmingDelete ? (
                  <>
                    <span style={{ fontSize: '0.75rem', color: 'red', marginRight: '4px' }}>Sure?</span>
                    <button onClick={() => onDelete(review.id || review._id)} style={{ color: "red", background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: "4px" }} title="Yes, delete">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </button>
                    <button onClick={() => setIsConfirmingDelete(false)} style={{ color: "gray", background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: "4px" }} title="Cancel">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setIsEditing(true)} style={{ color: "var(--color-primary)", background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: "4px" }} title="Edit Review">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </button>
                    <button onClick={() => setIsConfirmingDelete(true)} style={{ color: "#ef4444", background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: "4px" }} title="Delete Review">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                  </>
                )}
            </div>
        )}
      </div>
      <div className="review-rating">
        {"★".repeat(review.rating)}
        <span className="review-rating-empty">{"★".repeat(5 - review.rating)}</span>
      </div>
      <p className="review-text">{review.text || review.comment}</p>
    </div>
  );
};

const ReviewList = ({ reviews, currentUser, onDelete, onEdit }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="no-reviews">
        No reviews yet — be the first to write one.
      </div>
    );
  }

  return (
    <div className="reviews-container">
      <div className="reviews-header">
        <h2 className="reviews-title">Customer reviews</h2>
        <span className="reviews-count">
          {reviews.length} review{reviews.length !== 1 ? "s" : ""}
        </span>
      </div>

      <AverageBreakdown reviews={reviews} />

      <div className="reviews-list">
        {reviews.map((review) => (
          <ReviewItem 
            key={review.id || review._id} 
            review={review} 
            currentUser={currentUser} 
            onDelete={onDelete} 
            onEdit={onEdit} 
          />
        ))}
      </div>
    </div>
  );
};

export default ReviewList;