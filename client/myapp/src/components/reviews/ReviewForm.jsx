import React, { useState } from "react";
import "./ReviewForm.css";

const ReviewForm = ({ onSubmit, isSubmitting }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rating, comment });
    setComment("");
    setRating(5);
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3>Write a review</h3>

      <div className="form-group">
        <label>Your rating</label>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              className={`star ${star <= (hoverRating || rating) ? "filled" : ""}`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              aria-label={`Rate ${star} out of 5`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Your comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          placeholder="Share your experience…"
          rows={4}
        />
      </div>

      <div className="form-footer">
        <button
          type="submit"
          className="btn-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting…" : "Submit review"}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;