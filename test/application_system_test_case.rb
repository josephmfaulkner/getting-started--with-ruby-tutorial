require "test_helper"

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  driven_by :selenium, using: :headless_chrome, screen_size: [ 1400, 1400 ]

  # Let click_on/fill_in find elements by aria-label (e.g. the rating summary links)
  Capybara.enable_aria_label = true

  def sign_in_as(user, password: "password")
    visit new_session_path
    fill_in "Enter your email address", with: user.email_address
    fill_in "Enter your password", with: password
    click_on "Sign in"
    assert_button "Log out"
  end

  private
    def new_session_path = "/session/new"
end
