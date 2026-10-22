require "test_helper"

class ReviewsTest < ActionDispatch::IntegrationTest
  include ActionView::RecordIdentifier

  test "review a product" do
    product = products(:tshirt)
    sign_in_as users(:one)
    assert_difference "Review.count" do
      post product_reviews_path(product), params: { review: { rating: 3, body: "Example" } }
      assert_redirected_to product
    end
  end

  test "filter product reviews" do
    get product_path(products(:tshirt), rating: 5)
    assert_response :success
    assert_dom "div", text: "Filtered by 5 stars. Clear filter"
    assert_dom "#" + dom_id(reviews(:five_star))
    assert_not_dom "#" + dom_id(reviews(:four_star))
  end
end
