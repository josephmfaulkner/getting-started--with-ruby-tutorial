require "test_helper"

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  driven_by :selenium, using: :headless_chrome, screen_size: [ 1400, 1400 ] do |options|
    # After signing in, Chrome's password manager ("Save password?", and a breached-password
    # warning for the fixtures' "password") steals keyboard focus from the page
    options.add_preference("credentials_enable_service", false)
    options.add_preference("profile.password_manager_enabled", false)
    options.add_preference("profile.password_manager_leak_detection", false)
    options.add_argument("--disable-features=PasswordLeakDetection")
  end

  # Let click_on/fill_in find elements by aria-label (e.g. the rating summary links)
  Capybara.enable_aria_label = true

  def sign_in_as(user, password: "password")
    visit new_session_path
    fill_in "Enter your email address", with: user.email_address
    fill_in "Enter your password", with: password
    click_on "Sign in"
    assert_button "Log out"
  end

  # Clicks a button that asks "Are you sure?" in a dialog, then confirms
  def click_and_confirm(button)
    click_on button
    within("[role=dialog]") { click_on "Confirm" }
  end

  private
    def new_session_path = "/session/new"
end
