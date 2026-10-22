class ProductsController < ApplicationController
  allow_unauthenticated_access

  def index
    @products = Product.with_attached_featured_image.with_rich_text_description
  end

  def show
    @product = Product.find(params[:id])
    @reviews = @product.reviews.with_attached_images.rated(params[:rating])
  end
end
