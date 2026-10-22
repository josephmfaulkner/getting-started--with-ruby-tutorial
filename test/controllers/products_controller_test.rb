require "test_helper"

class ProductsControllerTest < ActionDispatch::IntegrationTest
  test "index shows products in a grid with thumbnails" do
    products(:tshirt).featured_image.attach(io: file_fixture("product.png").open, filename: "product.png", content_type: "image/png")
    products(:tshirt).update!(description: "<div>A <strong>soft</strong> cotton tee. #{"Comfortable all day. " * 10}</div>")

    get products_path
    assert_response :success
    assert_select "#products a.product-card[href=?]", product_path(products(:tshirt)) do
      assert_select "img.product-card__image"
      assert_select ".product-card__name", "T-Shirt"
      assert_select ".product-card__description", text: /\AA soft cotton tee\. Comfortable.*\.\.\.\z/
      assert_select ".product-card__description strong", 0
    end
    assert_select "a.product-card[href=?] .product-card__placeholder", product_path(products(:shoes)), text: "No image"
  end
end
