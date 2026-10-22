class Api::Store::UsersController < Api::Store::BaseController
  before_action :set_user, only: %i[ show update ]

  def index
    @users = User.all
  end

  def show
  end

  def update
    if @user.update(user_params)
      render_notice "User has been updated"
    else
      render_errors @user
    end
  end

  private
    def set_user
      @user = User.find(params[:id])
    end

    def user_params
      params.expect(user: [ :first_name, :last_name, :email_address ])
    end
end
