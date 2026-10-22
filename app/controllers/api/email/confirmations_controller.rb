class Api::Email::ConfirmationsController < Api::BaseController
  allow_unauthenticated_access

  def update
    user = User.find_by_token_for(:email_confirmation, params[:token])
    if user.nil?
      render_errors "Invalid token.", status: :not_found
    elsif user.confirm_email
      render_notice "Your email has been confirmed."
    else
      render_errors "That email address is already taken."
    end
  end
end
