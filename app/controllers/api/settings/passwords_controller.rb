class Api::Settings::PasswordsController < Api::BaseController
  def update
    if Current.user.update(password_params)
      render_notice "Your password has been updated."
    else
      render_errors Current.user
    end
  end

  private
    def password_params
      params.expect(user: [ :password, :password_confirmation, :password_challenge ]).with_defaults(password_challenge: "")
    end
end
