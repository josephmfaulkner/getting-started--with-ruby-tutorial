class Api::Products::ReviewsController < Api::BaseController
  before_action :set_product

  def create
    review = @product.reviews.new(review_params)
    if review.save
      render_notice "Review was created successfully.", status: :created
    else
      render_errors review
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
