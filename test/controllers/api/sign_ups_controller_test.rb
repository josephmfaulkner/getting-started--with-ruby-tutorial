require "test_helper"

class Api::SignUpsControllerTest < ActionDispatch::IntegrationTest
  test "sign up when authenticated" do
    sign_in_as users(:one)
    post api_sign_up_path, params: { user: { first_name: "Example", last_name: "User", email_address: "example@user.org", password: "password", password_confirmation: "password" } }
    assert_response :forbidden
  end

  test "successful sign up" do
    assert_difference "User.count" do
      post api_sign_up_path, params: { user: { first_name: "Example", last_name: "User", email_address: "example@user.org", password: "password", password_confirmation: "password" } }
      assert_response :created
    end
    assert_equal "example@user.org", response.parsed_body.dig("user", "email_address")
    assert cookies[:session_id]
  end

  test "invalid sign up" do
    assert_no_difference "User.count" do
      post api_sign_up_path, params: { user: { email_address: "example@user.org", password: "password", password_confirmation: "password" } }
      assert_response :unprocessable_content
    end
    assert_includes response.parsed_body["errors"], "First name can't be blank"
  end

  test "sign up with an email address that is already taken" do
    assert_no_difference "User.count" do
      post api_sign_up_path, params: { user: { first_name: "Example", last_name: "User", email_address: users(:one).email_address, password: "password", password_confirmation: "password" } }
      assert_response :unprocessable_content
    end
    assert_includes response.parsed_body["errors"], "Email address has already been taken"
  end

  test "sign up ignores admin attribute" do
    assert_difference "User.count" do
      post api_sign_up_path, params: { user: { first_name: "Example", last_name: "User", email_address: "example@user.org", password: "password", password_confirmation: "password", admin: true } }
      assert_response :created
    end
    refute User.find_by(email_address: "example@user.org").admin?
  end
end
