class Api::Wishlists::WishlistProductsController < Api::BaseController
  before_action :set_wishlist
  before_action :set_wishlist_product

  def update
    new_wishlist = Current.user.wishlists.find(params[:new_wishlist_id])
    if @wishlist_product.update(wishlist: new_wishlist)
      render_notice "#{@wishlist_product.product.name} has been moved to #{new_wishlist.name}"
    else
      render_errors "#{@wishlist_product.product.name} is already on #{new_wishlist.name}."
    end
  end

  def destroy
    @wishlist_product.destroy
    render_notice "#{@wishlist_product.product.name} removed from wishlist."
  end

  private
    def set_wishlist
      @wishlist = Current.user.wishlists.find(params[:wishlist_id])
    end

    def set_wishlist_product
      @wishlist_product = @wishlist.wishlist_products.find(params[:id])
    end
end
