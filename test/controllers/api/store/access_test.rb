require "test_helper"

class Api::Store::AccessTest < ActionDispatch::IntegrationTest
  ADMIN_PATHS = %w[ /api/store/products /api/store/reviews /api/store/users /api/store/wishlists /api/store/subscribers ]

  test "regular users cannot access the store admin" do
    sign_in_as users(:one)
    ADMIN_PATHS.each do |path|
      get path
      assert_response :forbidden, path
      assert_equal [ "You aren't allowed to do that." ], response.parsed_body["errors"]
    end
  end

  test "guests cannot access the store admin" do
    get api_store_products_path
    assert_response :unauthorized
  end

  test "admins can access the store admin" do
    sign_in_as users(:admin)
    ADMIN_PATHS.each do |path|
      get path
      assert_response :success, path
    end
  end
end
