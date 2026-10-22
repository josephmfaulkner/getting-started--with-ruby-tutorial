class ProductsController < ApplicationController
  allow_unauthenticated_access

  def index
    @products = Product.all
  end

  def show
    @product = Product.find(params[:id])
    @reviews = @product.reviews.with_attached_images.rated(params[:rating])
  end
end
