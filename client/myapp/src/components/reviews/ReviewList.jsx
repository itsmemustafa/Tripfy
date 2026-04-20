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
            <div className="review-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                    onClick={() => setIsEditing(true)}
                    style={{ fontSize: "0.8rem", color: "var(--color-primary)", background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline" }}
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(review.id || review._id)}
                    style={{ fontSize: "0.8rem", color: "red", background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline" }}
                >
                    Delete
                </button>
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