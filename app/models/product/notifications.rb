module Product::Notifications
  extend ActiveSupport::Concern

  included do
    has_many :subscribers, dependent: :destroy
    after_update_commit :notify_subscribers, if: :back_in_stock?
  end

  def back_in_stock?
    # Other updates (e.g. Active Storage touching the product after analyzing its image) don't change the count
    saved_change_to_inventory_count? && inventory_count_previously_was.zero? && inventory_count.positive?
  end

  def notify_subscribers
    subscribers.each do |subscriber|
      ProductMailer.with(product: self, subscriber: subscriber).in_stock.deliver_later
    end
  end
end
