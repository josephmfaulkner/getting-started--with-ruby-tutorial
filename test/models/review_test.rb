require "test_helper"

class ReviewTest < ActiveSupport::TestCase
  test "create review" do
    assert_nothing_raised do
      products(:tshirt).reviews.create!(
        user: users(:one),
        rating: 5,
        body: "I love this product."
      )
    end
  end

  test "invalid rating" do
    review = products(:tshirt).reviews.create(
      rating: 0,
      user: users(:one),
      body: "Example"
    )

    refute review.valid?
    assert review.errors.has_key?(:rating)
  end

  test "updates product rating" do
    product = products(:tshirt)
    assert_equal 4.5, product.rating

    product.reviews.create!(
      rating: 3,
      user: users(:one),
      body: "Love it"
    )

    assert_equal 4, product.rating
  end

  test "resets product rating when all reviews are removed" do
    product = products(:tshirt)
    product.reviews.destroy_all
    assert_equal 0, product.reload.rating
  end

  test "rated scope" do
    assert_equal Review.where(rating: 5), Review.rated(5)
    assert_equal Review.all, Review.rated(nil)
    assert_empty Review.rated("invalid")
  end
end
