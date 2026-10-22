class Api::PasswordsController < Api::BaseController
  allow_unauthenticated_access
  before_action :set_user_by_token, only: %i[ show update ]
  rate_limit to: 10, within: 3.minutes, only: :create, with: -> { render_errors "Try again later.", status: :too_many_requests }

  def create
    if user = User.find_by(email_address: params[:email_address])
      PasswordsMailer.reset(user).deliver_later
    end

    render_notice "Password reset instructions sent (if user with that email address exists)."
  end

  # Lets the reset page check its link before showing the form
  def show
    head :no_content
  end

  def update
    if @user.update(params.permit(:password, :password_confirmation))
      @user.sessions.destroy_all
      render_notice "Password has been reset."
    else
      render_errors "Passwords did not match."
    end
  end

  private
    def set_user_by_token
      @user = User.find_by_password_reset_token!(params[:token])
    rescue ActiveSupport::MessageVerifier::InvalidSignature
      render_errors "Password reset link is invalid or has expired.", status: :not_found
    end
end
