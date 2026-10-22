require "test_helper"

class Api::PasswordsControllerTest < ActionDispatch::IntegrationTest
  setup { @user = User.take }

  test "create" do
    post api_passwords_path, params: { email_address: @user.email_address }
    assert_enqueued_email_with PasswordsMailer, :reset, args: [ @user ]
    assert_response :success
    assert_match "reset instructions sent", response.parsed_body["notice"]
  end

  test "create for an unknown user sends no mail" do
    post api_passwords_path, params: { email_address: "missing-user@example.com" }
    assert_enqueued_emails 0
    assert_match "reset instructions sent", response.parsed_body["notice"]
  end

  test "show with a valid token" do
    get api_password_path(@user.password_reset_token)
    assert_response :no_content
  end

  test "show with invalid password reset token" do
    get api_password_path("invalid token")
    assert_response :not_found
    assert_match "reset link is invalid", response.parsed_body["errors"].first
  end

  test "update" do
    assert_changes -> { @user.reload.password_digest } do
      patch api_password_path(@user.password_reset_token), params: { password: "new", password_confirmation: "new" }
      assert_response :success
    end
    assert_match "Password has been reset", response.parsed_body["notice"]
  end

  test "update with non matching passwords" do
    assert_no_changes -> { @user.reload.password_digest } do
      patch api_password_path(@user.password_reset_token), params: { password: "no", password_confirmation: "match" }
      assert_response :unprocessable_content
    end
    assert_equal [ "Passwords did not match." ], response.parsed_body["errors"]
  end
end
