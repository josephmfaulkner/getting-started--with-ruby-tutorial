# Serves the React single-page app (react/src) for every page URL; the app routes in the browser.
class SpaController < ApplicationController
  allow_unauthenticated_access
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  def show
    resume_session
  end
end
