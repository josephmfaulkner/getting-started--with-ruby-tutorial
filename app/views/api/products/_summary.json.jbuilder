json.(product, :id, :name, :inventory_count)
json.description_excerpt product.description.to_plain_text.squish.truncate(100, separator: " ").presence
json.thumbnail_url product.featured_image.attached? ? url_for(product.featured_image.variant(resize_to_fill: [ 400, 400 ])) : nil
