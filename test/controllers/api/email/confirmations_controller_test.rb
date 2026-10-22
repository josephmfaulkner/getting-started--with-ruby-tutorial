require "test_helper"

class Api::Email::ConfirmationsControllerTest < ActionDispatch::IntegrationTest
  test "invalid tokens are ignored" do
    user = users(:one)
    previous_email = user.email_address
    user.update(unconfirmed_email: "new@example.org")
    patch api_email_confirmation_path(token: "invalid")
    assert_response :not_found
    assert_equal [ "Invalid token." ], response.parsed_body["errors"]
    assert_equal previous_email, user.reload.email_address
  end

  test "email is not updated if it was taken after the change was requested" do
    user = users(:one)
    user.update(unconfirmed_email: "new@example.org")
    users(:two).update(email_address: "new@example.org")
    patch api_email_confirmation_path(token: user.generate_token_for(:email_confirmation))
    assert_equal [ "That email address is already taken." ], response.parsed_body["errors"]
    assert_equal "one@example.com", user.reload.email_address
  end

  test "email is updated with a valid token" do
    user = users(:one)
    user.update(unconfirmed_email: "new@example.org")
    patch api_email_confirmation_path(token: user.generate_token_for(:email_confirmation))
    assert_equal "Your email has been confirmed.", response.parsed_body["notice"]
    user.reload
    assert_equal "new@example.org", user.email_address
    assert_nil user.unconfirmed_email
  end
end
