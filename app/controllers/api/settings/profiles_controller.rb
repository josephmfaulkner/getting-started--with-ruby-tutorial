class Api::Settings::ProfilesController < Api::BaseController
  def update
    if Current.user.update(profile_params)
      render_notice "Your profile was updated successfully."
    else
      render_errors Current.user
    end
  end

  private
    def profile_params
      params.expect(user: [ :first_name, :last_name ])
    end
end
