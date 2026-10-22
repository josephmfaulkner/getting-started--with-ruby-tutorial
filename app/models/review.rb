class Review < ApplicationRecord
  belongs_to :product, counter_cache: true
  belongs_to :user
  has_many_attached :images

  scope :rated, ->(rating) { rating.present? ? where(rating: rating.to_i) : all }

  validates :body, presence: true
  validates :rating, presence: true, numericality: { in: 1..5, only_integer: true }

  after_commit :update_product_rating

  def self.filter_by(params)
    results = rated(params[:rating])
    results = results.where(product_id: params[:product_id]) if params[:product_id].present?
    results = results.where(user_id: params[:user_id]) if params[:user_id].present?
    results
  end

  def update_product_rating
    product.update_column(:rating, product.reviews.average(:rating)&.round(1) || 0)
  end
end
