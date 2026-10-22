module Authorization
  extend ActiveSupport::Concern

  class_methods do
    def admin_access_only(**options)
      before_action -> { render json: { errors: [ "You aren't allowed to do that." ] }, status: :forbidden unless authenticated? && Current.user.admin? }, **options
    end
  end
end
