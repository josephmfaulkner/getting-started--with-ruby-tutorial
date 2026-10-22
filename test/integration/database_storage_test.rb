require "test_helper"

class DatabaseStorageTest < ActionDispatch::IntegrationTest
  test "uploaded files are stored in and served from the database" do
    sign_in_as users(:admin)
    post api_store_products_path, params: { product: { name: "Hat", inventory_count: 1, featured_image: fixture_file_upload("product.png", "image/png") } }
    assert_response :created

    blob = Product.last.featured_image.blob
    assert_equal "db", blob.service_name
    assert ActiveStorageDB::File.exists?(ref: blob.key)

    # The image URL in the API response redirects to the database-backed file
    get response.parsed_body["image_url"]
    assert_response :redirect
    get response.location
    assert_response :success
    assert_equal blob.download, response.body
    assert_equal blob.content_type, response.media_type
  end

  test "direct uploads (images added in the rich text editor) are stored in the database" do
    data = file_fixture("product.png").binread
    post rails_direct_uploads_path, as: :json, params: { blob: {
      filename: "inline.png", byte_size: data.bytesize, content_type: "image/png", checksum: OpenSSL::Digest::MD5.base64digest(data)
    } }
    assert_response :success
    signed_id, direct_upload = response.parsed_body.values_at("signed_id", "direct_upload")
    assert_match %r{/active_storage_db/files/}, direct_upload["url"]

    put direct_upload["url"], params: data, headers: direct_upload["headers"]
    assert_response :no_content

    blob = ActiveStorage::Blob.find_signed!(signed_id)
    assert ActiveStorageDB::File.exists?(ref: blob.key)
    assert_equal data, blob.download
  end
end
