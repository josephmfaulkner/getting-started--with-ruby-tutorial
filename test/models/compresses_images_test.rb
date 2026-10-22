require "test_helper"

class CompressesImagesTest < ActiveSupport::TestCase
  test "shrinks and converts uploaded photos to WebP" do
    upload = image_upload("photo.jpg", "image/jpeg", width: 3000, height: 1500)
    product = products(:tshirt)
    product.update!(featured_image: upload)

    blob = product.featured_image.blob
    assert_equal "photo.webp", blob.filename.to_s
    assert_equal "image/webp", blob.content_type
    assert_operator blob.byte_size, :<, File.size(upload.path)

    blob.analyze
    assert_equal [ 2000, 1000 ], [ blob.metadata[:width], blob.metadata[:height] ]
  end

  test "compresses each of many attached images and keeps existing ones" do
    review = reviews(:five_star)
    review.images.attach(io: file_fixture("product.png").open, filename: "existing.png")
    existing = review.images.first.signed_id

    review.update!(images: [ "", existing, image_upload("a.png", "image/png", width: 2500, height: 2500) ])

    assert_equal %w[ existing.png a.webp ], review.images.map { it.filename.to_s }
  end

  test "leaves GIFs and other files alone" do
    gif = image_upload("animation.gif", "image/gif", width: 50, height: 50)
    assert_same gif, CompressesImages.compress(gif)

    text = file_upload("not an image", "notes.txt", "text/plain")
    assert_same text, CompressesImages.compress(text)

    assert_equal "signed-id", CompressesImages.compress("signed-id")
    assert_nil CompressesImages.compress(nil)
  end

  test "keeps the original when it can't be processed" do
    broken = file_upload("\xFF\xD8\xFF not really a jpeg".b, "broken.jpg", "image/jpeg")
    assert_same broken, CompressesImages.compress(broken)
  end

  private
    # Uploads arrive as temp files on disk, like Rails' ActionDispatch::Http::UploadedFile
    def file_upload(content, filename, content_type)
      file = Tempfile.new([ "upload", File.extname(filename) ], binmode: true)
      file.write(content)
      file.flush
      Rack::Test::UploadedFile.new(file.path, content_type, original_filename: filename)
    end

    def image_upload(filename, content_type, width:, height:)
      file = Tempfile.new([ "upload", File.extname(filename) ])
      # Noise compresses poorly, like a real photo
      Vips::Image.gaussnoise(width, height).cast(:uchar).bandjoin([ 128, 64 ]).write_to_file(file.path)
      Rack::Test::UploadedFile.new(file.path, content_type, original_filename: filename)
    end
end
