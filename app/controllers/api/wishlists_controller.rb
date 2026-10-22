class Api::WishlistsController < Api::BaseController
  allow_unauthenticated_access only: %i[ show ]
  before_action :set_wishlist, only: %i[ update destroy ]

  def index
    @wishlists = Current.user.wishlists
  end

  def show
    @wishlist = Wishlist.find(params[:id])
    @owned = authenticated? && @wishlist.user == Current.user
  end

  def create
    @wishlist = Current.user.wishlists.new(wishlist_params)
    if @wishlist.save
      render_notice "Your wishlist was created successfully.", status: :created, wishlist: { id: @wishlist.id, param: @wishlist.to_param }
    else
      render_errors @wishlist
    end
  end

  def update
    if @wishlist.update(wishlist_params)
      render_notice "Your wishlist has been updated successfully.", wishlist: { id: @wishlist.id, param: @wishlist.to_param }
    else
      render_errors @wishlist
    end
  end

  def destroy
    @wishlist.destroy
    head :no_content
  end

  private
    def set_wishlist
      @wishlist = Current.user.wishlists.find(params[:id])
    end

    def wishlist_params
      params.expect(wishlist: [ :name ])
    end
end
