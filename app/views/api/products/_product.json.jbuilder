json.(product, :id, :name, :inventory_count, :reviews_count)
json.rating product.rating.to_f
json.description_html product.description.present? ? product.description.to_s : nil
json.image_url product.featured_image.attached? ? url_for(product.featured_image) : nil
