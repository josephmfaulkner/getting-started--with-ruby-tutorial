require "test_helper"

class Api::SessionsControllerTest < ActionDispatch::IntegrationTest
  setup { @user = User.take }

  test "show when signed out" do
    get api_session_path
    assert_response :success
    assert_nil response.parsed_body["user"]
    assert response.parsed_body["csrf_token"].present?
  end

  test "show when signed in" do
    sign_in_as users(:admin)
    get api_session_path
    assert_equal "admin@example.com", response.parsed_body.dig("user", "email_address")
    assert response.parsed_body.dig("user", "admin")
  end

  test "create with valid credentials" do
    post api_session_path, params: { email_address: @user.email_address, password: "password" }

    assert_response :created
    assert_equal @user.email_address, response.parsed_body.dig("user", "email_address")
    assert cookies[:session_id]
  end

  test "create with invalid credentials" do
    post api_session_path, params: { email_address: @user.email_address, password: "wrong" }

    assert_response :unauthorized
    assert_equal [ "Try another email address or password." ], response.parsed_body["errors"]
    assert_nil cookies[:session_id]
  end

  test "destroy" do
    sign_in_as(User.take)

    delete api_session_path

    assert_response :success
    assert_nil response.parsed_body["user"]
    assert_empty cookies[:session_id]
  end

  test "signed-in-only endpoints return 401 when signed out" do
    get api_wishlists_path
    assert_response :unauthorized
    assert_equal [ "Please sign in to continue." ], response.parsed_body["errors"]
  end
end
