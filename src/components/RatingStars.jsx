import React from 'react';
import { Star, StarHalf } from 'lucide-react';

export const RatingStars = ({ rating = 0, reviewsCount, showCount = true }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.4;
  const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

  return (
    <div className="star-rating" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
      <div style={{ display: 'inline-flex', color: '#f59e0b' }}>
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={16} fill="#f59e0b" strokeWidth={0} />
        ))}
        {hasHalfStar && <StarHalf size={16} fill="#f59e0b" strokeWidth={0} />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={16} color="var(--border-hover)" strokeWidth={1.5} />
        ))}
      </div>
      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginLeft: '0.2rem' }}>
        {rating.toFixed(1)}
      </span>
      {showCount && reviewsCount !== undefined && (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          ({reviewsCount})
        </span>
      )}
    </div>
  );
};
