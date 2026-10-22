class Api::Settings::EmailsController < Api::BaseController
  def update
    if !Current.user.update(email_params)
      render_errors Current.user
    elsif Rails.configuration.x.require_email_confirmation
      UserMailer.with(user: Current.user).email_confirmation.deliver_later
      render_notice "We've sent a verification email to #{Current.user.unconfirmed_email}."
    elsif Current.user.confirm_email
      render_notice "Your email has been updated to #{Current.user.email_address}."
    else
      render_errors Current.user
    end
  end

  private
    def email_params
      params.expect(user: [ :password_challenge, :unconfirmed_email ]).with_defaults(password_challenge: "")
    end
end
