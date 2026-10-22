class Email::ConfirmationsController < ApplicationController
  allow_unauthenticated_access

  def show
    user = User.find_by_token_for(:email_confirmation, params[:token])
    if user.nil?
      flash[:alert] = "Invalid token."
    elsif user.confirm_email
      flash[:notice] = "Your email has been confirmed."
    else
      flash[:alert] = "That email address is already taken."
    end
    redirect_to root_path
  end
end
