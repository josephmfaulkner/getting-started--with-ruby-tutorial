require "test_helper"

class SpaControllerTest < ActionDispatch::IntegrationTest
  test "serves the React app for page URLs" do
    [ "/", "/products/1", "/wishlists/1-my-wishlist", "/settings/profile", "/store/products/new", "/sign_up" ].each do |path|
      get path
      assert_response :success, path
      assert_select "#root", 1
      assert_select "script[src*='application']"
    end
  end

  test "embeds the current session for the React app" do
    get root_path
    session = JSON.parse(css_select("#root").first["data-session"])
    assert_nil session["user"]
    assert session["csrf_token"].present?

    sign_in_as users(:admin)
    get root_path
    session = JSON.parse(css_select("#root").first["data-session"])
    assert_equal "admin@example.com", session.dig("user", "email_address")
    assert session.dig("user", "admin")
  end

  test "mailer links point at React pages" do
    helpers = Rails.application.routes.url_helpers
    assert_equal "/passwords/abc/edit", helpers.edit_password_path("abc")
    assert_equal "/email/confirmations/abc", helpers.email_confirmation_path(token: "abc")
    assert_equal "/unsubscribe?token=abc", helpers.unsubscribe_path(token: "abc")
    assert_equal "/products/1", helpers.product_path(1)
  end

  test "does not serve the app for API, Active Storage, or non-HTML requests" do
    [ "/api/nothing-here", "/rails/active_storage/nothing-here", "/missing.js" ].each do |path|
      get path
      assert_response :not_found, path
      assert_no_match 'id="root"', response.body
    end
  end
end
