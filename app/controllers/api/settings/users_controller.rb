class Api::Settings::UsersController < Api::BaseController
  def destroy
    user = Current.user
    terminate_session
    user.destroy
    render_notice "Your account has been deleted."
  end
end
