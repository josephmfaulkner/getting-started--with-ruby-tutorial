class Products::ReviewsController < ApplicationController
  before_action :set_product

  def new
    @review = Review.new
  end

  def create
    @review = @product.reviews.new(review_params)
    if @review.save
      redirect_to @product, notice: "Review was created successfully."
    else
      render :new, status: :unprocessable_content
    end
  end

  private
    def set_product
      @product = Product.find(params[:product_id])
    end

    def review_params
      params.expect(review: [ :rating, :body, images: [] ]).with_defaults(user: Current.user)
    end
end
