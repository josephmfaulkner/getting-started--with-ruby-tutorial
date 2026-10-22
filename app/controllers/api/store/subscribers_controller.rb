class Api::Store::SubscribersController < Api::Store::BaseController
  before_action :set_subscriber, except: [ :index ]

  def index
    @subscribers = Subscriber.includes(:product).filter_by(params)
  end

  def show
  end

  def destroy
    @subscriber.destroy
    render_notice "Subscriber has been removed."
  end

  private
    def set_subscriber
      @subscriber = Subscriber.find(params[:id])
    end
end
