class Api::Store::WishlistsController < Api::Store::BaseController
  def index
    @wishlists = Wishlist.includes(:user).filter_by(params)
  end

  def show
    @wishlist = Wishlist.find(params[:id])
  end
end
