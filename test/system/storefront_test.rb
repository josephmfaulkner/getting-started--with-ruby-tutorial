require "application_system_test_case"

class StorefrontTest < ApplicationSystemTestCase
  test "browse products and filter reviews" do
    visit root_path
    assert_selector "h1", text: "Products"
    assert_selector ".product-card", count: Product.count

    click_on "T-Shirt"
    assert_selector "h1", text: "T-Shirt"
    assert_text "15 in stock"
    assert_text "2 reviews"

    click_on "5 stars — 50% of reviews"
    assert_text "Filtered by 5 stars."
    assert_text "I love this."
    assert_no_text "Great quality."

    click_on "Clear filter"
    assert_text "Great quality."
  end

  test "guests sign in to write a review and come back to it" do
    visit product_path(products(:tshirt))
    click_on "Write a review"

    fill_in "Enter your email address", with: "one@example.com"
    fill_in "Enter your password", with: "password"
    click_on "Sign in"

    assert_selector "h1", text: "Add a review"
    find("label[for=rating_4]").click
    fill_in "Body", with: "Pretty good"
    click_on "Create Review"

    assert_text "Review was created successfully."
    assert_text "Pretty good"
    assert_text "3 reviews"
  end

  test "subscribe to an out of stock product" do
    visit product_path(products(:shoes))
    assert_text "Out of stock"
    fill_in "you@example.com", with: "waiting@example.org"
    click_on "Submit"
    assert_text "You are now subscribed."
    assert Subscriber.exists?(email: "waiting@example.org", product: products(:shoes))
  end

  test "unknown pages show not found" do
    visit "/nothing-here"
    assert_selector "h1", text: "Not found"
  end
end
