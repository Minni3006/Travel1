import StarRating from './StarRating'

const ReviewsList = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No reviews yet. Be the first to review this destination!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {reviews.map((review, index) => (
        <div key={review._id || index} className="border-b border-white/10 pb-6 last:border-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-semibold text-lg">
                {review.user?.name || 'Anonymous'}
              </h4>
              <p className="text-sm text-gray-400">
                {new Date(review.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <StarRating rating={review.rating} readonly size="sm" />
          </div>
          {review.comment && (
            <p className="text-gray-300 mt-2">{review.comment}</p>
          )}
        </div>
      ))}
    </div>
  )
}

export default ReviewsList
