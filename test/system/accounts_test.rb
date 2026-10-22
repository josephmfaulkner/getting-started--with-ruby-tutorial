require "application_system_test_case"

class AccountsTest < ApplicationSystemTestCase
  test "sign up, save a product to a wishlist, and log out" do
    visit "/sign_up"
    fill_in "First name", with: "Ada"
    fill_in "Last name", with: "Lovelace"
    fill_in "Email address", with: "ada@example.org"
    fill_in "Password", with: "password123"
    fill_in "Password confirmation", with: "password123"
    click_on "Sign up"
    assert_button "Log out"

    visit product_path(products(:tshirt))
    click_on "Add to wishlist"
    assert_text "T-Shirt added to wishlist."
    assert_selector "h1", text: "My Wishlist"
    assert_current_path %r{\A/wishlists/\d+-my-wishlist\z}

    click_on "Log out"
    assert_current_path "/session/new"
    assert_link "Login"
  end

  test "sign up errors are shown" do
    visit "/sign_up"
    fill_in "First name", with: "Ada"
    fill_in "Last name", with: "Lovelace"
    fill_in "Email address", with: users(:one).email_address
    fill_in "Password", with: "password123"
    fill_in "Password confirmation", with: "password123"
    click_on "Sign up"
    assert_text "Error: Email address has already been taken"
  end

  test "wrong password" do
    visit "/session/new"
    fill_in "Enter your email address", with: "one@example.com"
    fill_in "Enter your password", with: "nope"
    click_on "Sign in"
    assert_text "Try another email address or password."
  end

  test "manage a wishlist" do
    sign_in_as users(:one)
    click_on "Wishlists"
    click_on "Create a wishlist"
    fill_in "Name", with: "Birthday"
    click_on "Create Wishlist"
    assert_text "Your wishlist was created successfully."

    visit wishlist_path(wishlists(:one))
    select "Birthday", from: "Move to wishlist"
    click_on "Move"
    assert_text "T-Shirt has been moved to Birthday"
    assert_text "0 Products"

    click_and_confirm "Delete"
    assert_selector "h1", text: "Your Wishlists"
    assert_no_link wishlists(:one).name
  end

  test "update profile in settings" do
    sign_in_as users(:one)
    click_on "Settings"
    assert_selector "h1", text: "Profile"
    assert_no_text "Store Settings"
    fill_in "First name", with: "Uno"
    click_on "Update profile"
    assert_text "Your profile was updated successfully."
    assert_equal "Uno", users(:one).reload.first_name
  end

  test "change email requires the current password" do
    sign_in_as users(:one)
    visit "/settings/email"
    fill_in "New email address", with: "new@example.org"
    fill_in "Current password", with: "wrong"
    click_on "Update email address"
    assert_text "Error: Current password is invalid"

    fill_in "New email address", with: "new@example.org"
    fill_in "Current password", with: "password"
    click_on "Update email address"
    assert_text "We've sent a verification email to new@example.org."
  end

  test "regular users are kept out of the store admin" do
    sign_in_as users(:one)
    visit "/store/products"
    assert_current_path "/"
    assert_text "You aren't allowed to do that."
  end

  test "signed out visitors are sent to log in" do
    visit "/settings/profile"
    assert_current_path "/session/new"
  end

  private
    def wishlist_path(wishlist) = "/wishlists/#{wishlist.to_param}"
end
