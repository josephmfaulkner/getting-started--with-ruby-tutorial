class Api::Store::ProductsController < Api::Store::BaseController
  before_action :set_product, only: %i[ show update destroy ]

  def index
    @products = Product.all
  end

  def show
  end

  def create
    @product = Product.new(product_params)
    if @product.save
      render :show, status: :created
    else
      render_errors @product
    end
  end

  def update
    if @product.update(product_params)
      render :show
    else
      render_errors @product
    end
  end

  def destroy
    @product.destroy
    head :no_content
  end

  private
    def set_product
      @product = Product.find(params[:id])
    end

    def product_params
      params.expect(product: [ :name, :description, :featured_image, :inventory_count ])
    end
end
