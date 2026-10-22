require "test_helper"

class Api::Store::AdminTest < ActionDispatch::IntegrationTest
  setup { sign_in_as users(:admin) }

  test "create a product with rich text and an image" do
    assert_difference "Product.count" do
      post api_store_products_path, params: { product: { name: "Hat", description: "<div><strong>Warm</strong></div>", inventory_count: 3, featured_image: fixture_file_upload("product.png", "image/png") } }
      assert_response :created
    end
    product = Product.last
    assert product.featured_image.attached?
    assert_match "<strong>Warm</strong>", response.parsed_body["description_html"]
    assert_match "<strong>Warm</strong>", response.parsed_body["description_trix_html"]
  end

  test "invalid product" do
    post api_store_products_path, params: { product: { name: "", inventory_count: 1 } }
    assert_response :unprocessable_content
    assert_equal [ "Name can't be blank" ], response.parsed_body["errors"]
  end

  test "product counts" do
    get api_store_product_path(products(:tshirt))
    assert_equal 2, response.parsed_body["reviews_count"]
    assert_equal 2, response.parsed_body["subscribers_count"]
  end

  test "update and delete a product" do
    patch api_store_product_path(products(:shoes)), params: { product: { name: "Boots" } }
    assert_equal "Boots", products(:shoes).reload.name

    assert_difference "Product.count", -1 do
      delete api_store_product_path(products(:shoes))
    end
  end

  test "filter reviews" do
    get api_store_reviews_path(rating: "5 stars")
    assert_equal [ reviews(:five_star).id ], response.parsed_body.map { it["id"] }

    get api_store_reviews_path(user_id: users(:two).id)
    assert_equal [ reviews(:four_star).id ], response.parsed_body.map { it["id"] }
  end

  test "edit a review keeping only some images" do
    review = reviews(:five_star)
    review.images.attach([ file_fixture("product.png").open, file_fixture("product.png").open ].map { { io: it, filename: "product.png" } })
    kept = review.images.first.signed_id
    patch api_store_review_path(review), params: { review: { rating: 2, body: "Edited", images: [ "", kept ] } }
    assert_response :success
    assert_equal 1, review.reload.images.count
    assert_equal 2, review.rating
  end

  test "update a user" do
    patch api_store_user_path(users(:one)), params: { user: { first_name: "Uno" } }
    assert_equal "User has been updated", response.parsed_body["notice"]
    assert_equal "Uno", users(:one).reload.first_name
  end

  test "filter wishlists and subscribers" do
    get api_store_wishlists_path(product_id: products(:shoes).id)
    assert_equal [ wishlists(:two).id ], response.parsed_body.map { it["id"] }

    get api_store_subscribers_path(product_id: products(:tshirt).id)
    assert_equal 2, response.parsed_body.size

    assert_difference "Subscriber.count", -1 do
      delete api_store_subscriber_path(subscribers(:david))
    end
  end
end
