class Api::SessionsController < Api::BaseController
  allow_unauthenticated_access only: %i[ show create ]
  rate_limit to: 10, within: 3.minutes, only: :create, with: -> { render_errors "Try again later.", status: :too_many_requests }

  def show
    resume_session
  end

  def create
    if user = User.authenticate_by(params.permit(:email_address, :password))
      start_new_session_for user
      render :show, status: :created
    else
      render_errors "Try another email address or password.", status: :unauthorized
    end
  end

  def destroy
    terminate_session
    Current.session = nil
    render :show
  end
end
