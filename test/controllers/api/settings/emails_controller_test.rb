require "test_helper"

class Api::Settings::EmailsControllerTest < ActionDispatch::IntegrationTest
  test "validates current password" do
    user = users(:one)
    sign_in_as user
    patch api_settings_email_path, params: { user: { password_challenge: "invalid", unconfirmed_email: "new@example.org" } }
    assert_response :unprocessable_content
    assert_nil user.reload.unconfirmed_email
    assert_no_emails
  end

  test "rejects an email address that is already taken" do
    user = users(:one)
    sign_in_as user
    patch api_settings_email_path, params: { user: { password_challenge: "password", unconfirmed_email: users(:two).email_address.upcase } }
    assert_response :unprocessable_content
    assert_includes response.parsed_body["errors"], "New email address has already been taken"
    assert_nil user.reload.unconfirmed_email
    assert_no_enqueued_emails
  end

  test "sends email confirmation on successful update" do
    user = users(:one)
    sign_in_as user
    patch api_settings_email_path, params: { user: { password_challenge: "password", unconfirmed_email: "new@example.org" } }
    assert_response :success
    assert_equal "We've sent a verification email to new@example.org.", response.parsed_body["notice"]
    assert_equal "new@example.org", user.reload.unconfirmed_email
    assert_enqueued_email_with UserMailer, :email_confirmation, params: { user: user }
  end

  test "updates email immediately when confirmation is not required" do
    Rails.configuration.x.require_email_confirmation = false
    user = users(:one)
    sign_in_as user
    patch api_settings_email_path, params: { user: { password_challenge: "password", unconfirmed_email: "new@example.org" } }
    assert_response :success
    user.reload
    assert_equal "new@example.org", user.email_address
    assert_nil user.unconfirmed_email
    assert_no_enqueued_emails
  ensure
    Rails.configuration.x.require_email_confirmation = true
  end
end
