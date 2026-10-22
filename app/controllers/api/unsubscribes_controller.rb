class Api::UnsubscribesController < Api::BaseController
  allow_unauthenticated_access

  def create
    Subscriber.find_by_token_for(:unsubscribe, params[:token])&.destroy
    render_notice "Unsubscribed successfully."
  end
end
