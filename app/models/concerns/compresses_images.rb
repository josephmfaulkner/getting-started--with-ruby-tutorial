# Compresses uploaded images before they're stored: shrinks them to fit within
# 2000x2000 pixels, converts them to WebP, and strips metadata (like GPS location).
#
#   class Product < ApplicationRecord
#     has_one_attached :featured_image
#     compresses_images :featured_image
#   end
#
# Applies to files assigned through the attachment writer (product.featured_image = file),
# which is how form uploads arrive. Signed blob IDs and other attachables pass through unchanged.
module CompressesImages
  extend ActiveSupport::Concern

  MAX_DIMENSION = 2000
  WEBP_QUALITY = 80
  # Animated GIFs and SVGs are left alone (WebP conversion would flatten or rasterize them)
  COMPRESSIBLE_TYPES = %w[ image/jpeg image/png image/webp image/tiff image/heic image/heif ]

  class_methods do
    def compresses_images(*attachment_names)
      attachment_names.each do |name|
        define_method(:"#{name}=") do |attachables|
          super(attachables.is_a?(Array) ? attachables.map { CompressesImages.compress(it) } : CompressesImages.compress(attachables))
        end
      end
    end
  end

  # Returns an attachable for a compressed copy of an uploaded image, or the original
  # if it isn't an uploaded image, can't be processed, or wouldn't get any smaller
  def self.compress(attachable)
    return attachable unless attachable.respond_to?(:original_filename) && attachable.respond_to?(:path)

    content_type = Marcel::MimeType.for(Pathname.new(attachable.path))
    return attachable unless COMPRESSIBLE_TYPES.include?(content_type)

    compressed = ImageProcessing::Vips
      .source(attachable.path)
      .resize_to_limit(MAX_DIMENSION, MAX_DIMENSION)
      .convert("webp")
      .saver(quality: WEBP_QUALITY, strip: true)
      .call
    return attachable if compressed.size >= File.size(attachable.path)

    { io: compressed, filename: "#{File.basename(attachable.original_filename, ".*")}.webp", content_type: "image/webp" }
  rescue Vips::Error, ImageProcessing::Error => error
    Rails.logger.warn("Couldn't compress #{attachable.original_filename}: #{error.message}")
    attachable
  end
end
