import React from "react";
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

const ReviewList = ({ reviews }) => {
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
        {reviews.map((review) => {
          const name = review.user?.name || "Anonymous";
          const palette = getAvatarPalette(name);
          const date = new Date(
            review.createdAt || Date.now()
          ).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

          return (
            <div key={review.id || review._id} className="review-card">
              <div className="review-card-top">
                <div
                  className="review-avatar"
                  style={{ background: palette.bg, color: palette.color }}
                >
                  {getInitials(name)}
                </div>
                <div className="review-meta">
                  <span className="review-author">{name}</span>
                  <span className="review-date">{date}</span>
                </div>
              </div>

              <div className="review-rating">
                {"★".repeat(review.rating)}
                <span className="review-rating-empty">
                  {"★".repeat(5 - review.rating)}
                </span>
              </div>

              <p className="review-text">{review.text || review.comment}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewList;