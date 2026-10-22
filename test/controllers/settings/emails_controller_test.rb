require "test_helper"

class Settings::EmailsControllerTest < ActionDispatch::IntegrationTest
  test "validates current password" do
    user = users(:one)
    sign_in_as user
    patch settings_email_path, params: { user: { password_challenge: "invalid", unconfirmed_email: "new@example.org" } }
    assert_response :unprocessable_entity
    assert_nil user.reload.unconfirmed_email
    assert_no_emails
  end

  test "rejects an email address that is already taken" do
    user = users(:one)
    sign_in_as user
    patch settings_email_path, params: { user: { password_challenge: "password", unconfirmed_email: users(:two).email_address.upcase } }
    assert_response :unprocessable_entity
    assert_select "div", /New email address has already been taken/
    assert_nil user.reload.unconfirmed_email
    assert_no_enqueued_emails
  end

  test "sends email confirmation on successful update" do
    user = users(:one)
    sign_in_as user
    patch settings_email_path, params: { user: { password_challenge: "password", unconfirmed_email: "new@example.org" } }
    assert_response :redirect
    assert_equal "new@example.org", user.reload.unconfirmed_email
    assert_enqueued_email_with UserMailer, :email_confirmation, params: { user: user }
  end

  test "updates email immediately when confirmation is not required" do
    Rails.configuration.x.require_email_confirmation = false
    user = users(:one)
    sign_in_as user
    patch settings_email_path, params: { user: { password_challenge: "password", unconfirmed_email: "new@example.org" } }
    assert_redirected_to settings_email_path
    user.reload
    assert_equal "new@example.org", user.email_address
    assert_nil user.unconfirmed_email
    assert_no_enqueued_emails
  ensure
    Rails.configuration.x.require_email_confirmation = true
  end
end
