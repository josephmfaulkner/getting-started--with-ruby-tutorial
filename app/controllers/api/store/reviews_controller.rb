class Api::Store::ReviewsController < Api::Store::BaseController
  before_action :set_review, except: [ :index ]

  def index
    @reviews = Review.includes(:product, :user).with_attached_images.filter_by(params)
  end

  def show
  end

  def update
    if @review.update(review_params)
      render :show
    else
      render_errors @review
    end
  end

  def destroy
    @review.destroy
    head :no_content
  end

  private
    def set_review
      @review = Review.find(params[:id])
    end

    def review_params
      params.expect(review: [ :rating, :body, images: [] ])
    end
end
