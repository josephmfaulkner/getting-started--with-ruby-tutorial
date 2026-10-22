require "application_system_test_case"

class StoreAdminTest < ApplicationSystemTestCase
  setup { sign_in_as users(:admin) }

  test "create a product with a rich text description and image" do
    click_on "Settings"
    assert_text "Store Settings"
    within(".settings nav") { click_on "Products" }
    click_on "New product"

    fill_in "Name", with: "Scarf"
    find("trix-editor").click.set("Soft and warm")
    attach_file "Featured image", file_fixture("product.png")
    fill_in "Inventory count", with: 5
    click_on "Create Product"

    assert_selector "h1", text: "Scarf"
    assert_text "Soft and warm"
    product = Product.find_by!(name: "Scarf")
    assert product.featured_image.attached?
    assert_equal "Soft and warm", product.description.to_plain_text

    click_on "View in Storefront"
    assert_current_path "/products/#{product.id}"
    assert_text "5 in stock"
  end

  test "edit a product keeps its description" do
    products(:tshirt).update!(description: "<div>Cotton</div>")
    visit "/store/products/#{products(:tshirt).id}/edit"
    assert_selector "trix-editor", text: "Cotton"
    fill_in "Name", with: "Tee"
    click_on "Update Product"
    assert_selector "h1", text: "Tee"
    assert_text "Cotton"
  end

  test "filter and edit reviews" do
    visit "/store/reviews"
    select "4 stars", from: "Rating"
    click_on "Filter"
    assert_current_path "/store/reviews?rating=4+stars"
    assert_text "Great quality."
    assert_no_text "I love this."

    click_on "View review"
    click_on "Edit"
    fill_in "Body", with: "Really great quality."
    click_on "Update Review"
    assert_selector "h1", text: "Review"
    assert_text "Really great quality."
  end

  test "remove a subscriber" do
    visit "/store/subscribers"
    assert_selector "h1", text: "#{Subscriber.count} Subscribers"
    click_on "david@example.org"
    accept_confirm { click_on "Remove" }
    assert_text "Subscriber has been removed."
    assert_no_text "david@example.org"
  end
end
