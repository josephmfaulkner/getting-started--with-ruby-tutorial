class Settings::EmailsController < Settings::BaseController
  def show
  end

  def update
    if !Current.user.update(email_params)
      render :show, status: :unprocessable_entity
    elsif Rails.configuration.x.require_email_confirmation
      UserMailer.with(user: Current.user).email_confirmation.deliver_later
      redirect_to settings_email_path, status: :see_other, notice: "We've sent a verification email to #{Current.user.unconfirmed_email}."
    elsif Current.user.confirm_email
      redirect_to settings_email_path, status: :see_other, notice: "Your email has been updated to #{Current.user.email_address}."
    else
      render :show, status: :unprocessable_entity
    end
  end

  private
    def email_params
      params.expect(user: [ :password_challenge, :unconfirmed_email ]).with_defaults(password_challenge: "")
    end


end
