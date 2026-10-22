require "test_helper"

class ProductTest < ActiveSupport::TestCase
  include ActionMailer::TestHelper

  test "sends email notifications when back in stock" do
    product = products(:tshirt)

    # Set product out of stock
    product.update(inventory_count: 0)

    assert_emails 2 do
      product.update(inventory_count: 99)
    end
  end

  test "attaching and analyzing an image does not check stock" do
    product = products(:tshirt)

    assert_no_emails do
      assert_nothing_raised do
        perform_enqueued_jobs do
          product.featured_image.attach(io: file_fixture("product.png").open, filename: "product.png")
        end
      end
    end
    assert product.featured_image.blob.reload.analyzed?
  end
end