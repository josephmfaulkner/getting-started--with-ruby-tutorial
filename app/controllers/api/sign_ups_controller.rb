class Api::SignUpsController < Api::BaseController
  unauthenticated_access_only
  rate_limit to: 10, within: 3.minutes, only: :create, with: -> { render_errors "Try again later.", status: :too_many_requests }

  def create
    user = User.new(sign_up_params)
    if user.save
      start_new_session_for(user)
      render "api/sessions/show", status: :created
    else
      render_errors user
    end
  end

  private
    def sign_up_params
      params.expect(user: [ :first_name, :last_name, :email_address, :password, :password_confirmation ])
    end
end
