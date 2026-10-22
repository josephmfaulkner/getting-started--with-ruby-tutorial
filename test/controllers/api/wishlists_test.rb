require "test_helper"

class Api::WishlistsTest < ActionDispatch::IntegrationTest
  test "list your wishlists" do
    sign_in_as users(:one)
    get api_wishlists_path
    assert_equal [ wishlists(:one).id ], response.parsed_body.map { it["id"] }
  end

  test "create a wishlist" do
    user = users(:one)
    sign_in_as user
    assert_difference "user.wishlists.count" do
      post api_wishlists_path, params: { wishlist: { name: "Example" } }
      assert_response :created
    end
    assert_match(/\A\d+-example\z/, response.parsed_body.dig("wishlist", "param"))
  end

  test "rename a wishlist" do
    sign_in_as users(:one)
    patch api_wishlist_path(wishlists(:one)), params: { wishlist: { name: "Birthday" } }
    assert_equal "Birthday", wishlists(:one).reload.name
  end

  test "delete a wishlist" do
    user = users(:one)
    sign_in_as user
    assert_difference "user.wishlists.count", -1 do
      delete api_wishlist_path(user.wishlists.first)
      assert_response :no_content
    end
  end

  test "view a wishlist" do
    user = users(:one)
    wishlist = user.wishlists.first
    sign_in_as user
    get api_wishlist_path(wishlist)
    assert_response :success
    assert_equal wishlist.name, response.parsed_body["name"]
    assert response.parsed_body["owned"]
  end

  test "view a wishlist as another user" do
    wishlist = wishlists(:two)
    sign_in_as users(:one)
    get api_wishlist_path(wishlist)
    assert_response :success
    assert_equal wishlist.name, response.parsed_body["name"]
    refute response.parsed_body["owned"]
    assert_empty response.parsed_body["other_wishlists"]
  end

  test "view a wishlist as a guest using its friendly URL" do
    wishlist = wishlists(:one)
    get api_wishlist_path(wishlist.to_param)
    assert_response :success
    assert_equal wishlist.name, response.parsed_body["name"]
    assert_equal [ "T-Shirt" ], response.parsed_body["items"].map { it.dig("product", "name") }
  end

  test "cannot edit another user's wishlist" do
    sign_in_as users(:one)
    patch api_wishlist_path(wishlists(:two)), params: { wishlist: { name: "Mine now" } }
    assert_response :not_found
  end

  test "add product to a specific wishlist" do
    sign_in_as users(:one)
    wishlist = wishlists(:one)
    assert_difference "WishlistProduct.count" do
      post api_product_wishlist_path(products(:shoes)), params: { wishlist_id: wishlist.id }
      assert_response :created
    end
    assert_equal wishlist.to_param, response.parsed_body.dig("wishlist", "param")
  end

  test "add product when no wishlists" do
    user = users(:one)
    sign_in_as user
    user.wishlists.destroy_all
    assert_difference "Wishlist.count" do
      assert_difference "WishlistProduct.count" do
        post api_product_wishlist_path(products(:shoes))
      end
    end
  end

  test "cannot add product to another user's wishlist" do
    sign_in_as users(:one)
    assert_no_difference "WishlistProduct.count" do
      post api_product_wishlist_path(products(:shoes)), params: { wishlist_id: wishlists(:two).id }
      assert_response :not_found
    end
  end

  test "move product to another wishlist" do
    user = users(:one)
    sign_in_as user
    wishlist = user.wishlists.first
    wishlist_product = wishlist.wishlist_products.first
    second_wishlist = user.wishlists.create!(name: "Second Wishlist")
    patch api_wishlist_wishlist_product_path(wishlist, wishlist_product), params: { new_wishlist_id: second_wishlist.id }
    assert_equal second_wishlist, wishlist_product.reload.wishlist
    assert_equal "T-Shirt has been moved to Second Wishlist", response.parsed_body["notice"]
  end

  test "cannot move product to a wishlist that already contains product" do
    user = users(:one)
    sign_in_as user
    wishlist = user.wishlists.first
    wishlist_product = wishlist.wishlist_products.first
    second_wishlist = user.wishlists.create!(name: "Second")
    second_wishlist.wishlist_products.create(product_id: wishlist_product.product_id)
    patch api_wishlist_wishlist_product_path(wishlist, wishlist_product), params: { new_wishlist_id: second_wishlist.id }
    assert_equal [ "T-Shirt is already on Second." ], response.parsed_body["errors"]
    assert_equal wishlist, wishlist_product.reload.wishlist
  end

  test "cannot move product to another user's wishlist" do
    user = users(:one)
    sign_in_as user
    wishlist = user.wishlists.first
    wishlist_product = wishlist.wishlist_products.first
    patch api_wishlist_wishlist_product_path(wishlist, wishlist_product), params: { new_wishlist_id: wishlists(:two).id }
    assert_response :not_found
    assert_equal wishlist, wishlist_product.reload.wishlist
  end

  test "remove product from a wishlist" do
    sign_in_as users(:one)
    assert_difference "WishlistProduct.count", -1 do
      delete api_wishlist_wishlist_product_path(wishlists(:one), wishlist_products(:one))
    end
    assert_equal "T-Shirt removed from wishlist.", response.parsed_body["notice"]
  end

  test "cannot remove product from another user's wishlist" do
    sign_in_as users(:one)
    assert_no_difference "WishlistProduct.count" do
      delete api_wishlist_wishlist_product_path(wishlists(:two), wishlist_products(:two))
      assert_response :not_found
    end
  end

  test "cannot move product on another user's wishlist" do
    sign_in_as users(:one)
    patch api_wishlist_wishlist_product_path(wishlists(:two), wishlist_products(:two)), params: { new_wishlist_id: wishlists(:one).id }
    assert_response :not_found
    assert_equal wishlists(:two), wishlist_products(:two).reload.wishlist
  end
end
