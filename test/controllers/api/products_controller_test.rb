require "test_helper"

class Api::ProductsControllerTest < ActionDispatch::IntegrationTest
  test "index lists products with thumbnails and description excerpts" do
    products(:tshirt).featured_image.attach(io: file_fixture("product.png").open, filename: "product.png", content_type: "image/png")
    products(:tshirt).update!(description: "<div>A <strong>soft</strong> cotton tee. #{"Comfortable all day. " * 10}</div>")

    get api_products_path
    assert_response :success
    tshirt = response.parsed_body.find { it["id"] == products(:tshirt).id }
    shoes = response.parsed_body.find { it["id"] == products(:shoes).id }

    assert_equal "T-Shirt", tshirt["name"]
    assert_match %r{/rails/active_storage/representations/}, tshirt["thumbnail_url"]
    assert_match(/\AA soft cotton tee\. Comfortable.*\.\.\.\z/, tshirt["description_excerpt"])
    assert_nil shoes["thumbnail_url"]
  end

  test "show includes rating breakdown and reviews" do
    get api_product_path(products(:tshirt))
    assert_response :success
    product = response.parsed_body["product"]
    assert_equal 4.5, product["rating"]
    assert_equal [ 5, 4, 3, 2, 1 ], product["rating_breakdown"].map { it["stars"] }
    assert_equal 50, product["rating_breakdown"].first["percentage"]
    assert_equal 2, response.parsed_body["reviews"].size
  end

  test "filter product reviews" do
    get api_product_path(products(:tshirt), rating: 5)
    assert_equal [ reviews(:five_star).id ], response.parsed_body["reviews"].map { it["id"] }
  end

  test "show missing product" do
    get api_product_path(id: 0)
    assert_response :not_found
  end

  test "review a product" do
    product = products(:tshirt)
    sign_in_as users(:one)
    assert_difference "Review.count" do
      post api_product_reviews_path(product), params: { review: { rating: 3, body: "Example", images: [ fixture_file_upload("product.png", "image/png") ] } }
      assert_response :created
    end
    assert_equal 1, Review.last.images.count
  end

  test "invalid review" do
    sign_in_as users(:one)
    assert_no_difference "Review.count" do
      post api_product_reviews_path(products(:tshirt)), params: { review: { rating: 9, body: "Example" } }
    end
    assert_response :unprocessable_content
    assert_match "Rating", response.parsed_body["errors"].first
  end

  test "reviewing requires signing in" do
    post api_product_reviews_path(products(:tshirt)), params: { review: { rating: 3, body: "Example" } }
    assert_response :unauthorized
  end

  test "subscribe to an out of stock product" do
    assert_difference "Subscriber.count" do
      post api_product_subscribers_path(products(:shoes)), params: { subscriber: { email: "waiting@example.org" } }
    end
    assert_equal "You are now subscribed.", response.parsed_body["notice"]
  end

  test "unsubscribe" do
    subscriber = subscribers(:david)
    assert_difference "Subscriber.count", -1 do
      post api_unsubscribe_path, params: { token: subscriber.generate_token_for(:unsubscribe) }
    end
    assert_equal "Unsubscribed successfully.", response.parsed_body["notice"]
  end
end
