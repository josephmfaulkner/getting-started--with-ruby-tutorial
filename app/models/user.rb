class User < ApplicationRecord
  has_secure_password
  has_many :sessions, dependent: :destroy

  attr_readonly :admin

  normalizes :email_address, :unconfirmed_email, with: ->(e) { e.strip.downcase }

  validates :first_name, :last_name, presence: true
  validates :email_address, uniqueness: true
  validate :unconfirmed_email_not_taken, if: -> { unconfirmed_email? && will_save_change_to_unconfirmed_email? }

  generates_token_for :email_confirmation, expires_in: 7.days do
    unconfirmed_email
  end

  def confirm_email
    update(email_address: unconfirmed_email, unconfirmed_email: nil)
  end

  def full_name
    "#{first_name} #{last_name}"
  end

  private
    def unconfirmed_email_not_taken
      errors.add(:unconfirmed_email, :taken) if User.where.not(id: id).exists?(email_address: unconfirmed_email)
    end
end
