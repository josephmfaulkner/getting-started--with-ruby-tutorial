class CreateReviews < ActiveRecord::Migration[8.1]
  def change
    create_table :reviews do |t|
      t.belongs_to :product, null: false, foreign_key: true
      t.belongs_to :user, null: false, foreign_key: true
      t.integer :rating, null: false
      t.text :body, null: false

      t.timestamps
    end

    add_column :products, :reviews_count, :integer, default: 0
    add_column :products, :rating, :decimal, precision: 2, scale: 1, default: 0
  end
end
