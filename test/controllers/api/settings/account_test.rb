require "test_helper"

class Api::Settings::AccountTest < ActionDispatch::IntegrationTest
  test "update profile" do
    sign_in_as users(:one)
    patch api_settings_profile_path, params: { user: { first_name: "Uno", last_name: "" } }
    assert_response :unprocessable_content
    assert_equal [ "Last name can't be blank" ], response.parsed_body["errors"]

    patch api_settings_profile_path, params: { user: { first_name: "Uno", last_name: "One" } }
    assert_response :success
    assert_equal "Uno One", users(:one).reload.full_name
  end

  test "update password requires the current password" do
    sign_in_as users(:one)
    patch api_settings_password_path, params: { user: { password: "newpassword", password_confirmation: "newpassword", password_challenge: "wrong" } }
    assert_response :unprocessable_content
    assert_equal [ "Current password is invalid" ], response.parsed_body["errors"]

    patch api_settings_password_path, params: { user: { password: "newpassword", password_confirmation: "newpassword" } }
    assert_response :unprocessable_content

    patch api_settings_password_path, params: { user: { password: "newpassword", password_confirmation: "newpassword", password_challenge: "password" } }
    assert_response :success
    assert users(:one).reload.authenticate("newpassword")
  end

  test "delete account" do
    sign_in_as users(:one)
    assert_difference "User.count", -1 do
      delete api_settings_user_path
    end
    assert_equal "Your account has been deleted.", response.parsed_body["notice"]
    assert_empty cookies[:session_id]
  end
end
