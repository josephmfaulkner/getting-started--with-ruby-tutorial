class Store::ReviewsController < Store::BaseController
  before_action :set_review, except: [ :index ]

  def index
    @reviews = Review.includes(:product, :user).with_attached_images.filter_by(params)
  end

  def show
  end

  def edit
  end

  def update
    if @review.update(review_params)
      redirect_to store_review_path(@review)
    else
      render :edit, status: :unprocessable_content
    end
  end

  def destroy
    @review.destroy
    redirect_to store_reviews_path
  end

  private
    def set_review
      @review = Review.find(params[:id])
    end

    def review_params
      params.expect(review: [ :rating, :body, images: [] ])
    end
end
