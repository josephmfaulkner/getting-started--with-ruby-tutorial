Rails.application.routes.draw do
  # JSON API used by the React app in react/src
  namespace :api, defaults: { format: :json } do
    resource :session, only: %i[ show create destroy ]
    resource :sign_up, only: :create
    resources :passwords, param: :token, only: %i[ create show update ]

    resources :products, only: %i[ index show ] do
      resource :wishlist, only: :create, module: :products
      resources :reviews, only: :create, module: :products
      resources :subscribers, only: :create, module: :products
    end
    resource :unsubscribe, only: :create

    resources :wishlists, except: %i[ new edit ] do
      resources :wishlist_products, only: %i[ update destroy ], module: :wishlists
    end

    namespace :settings do
      resource :email, only: :update
      resource :password, only: :update
      resource :profile, only: :update
      resource :user, only: :destroy
    end

    namespace :email do
      resources :confirmations, param: :token, only: :update
    end

    # Admins Only
    namespace :store do
      resources :products, except: %i[ new edit ]
      resources :reviews, only: %i[ index show update destroy ]
      resources :users, only: %i[ index show update ]
      resources :wishlists, only: %i[ index show ]
      resources :subscribers, only: %i[ index show destroy ]
    end
  end

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Every other page is rendered by the React app. These named routes are the
  # React pages that mailers link to (product_url, edit_password_url, ...).
  root "spa#show"
  get "products/:id", to: "spa#show", as: :product
  get "passwords/:token/edit", to: "spa#show", as: :edit_password
  get "email/confirmations/:token", to: "spa#show", as: :email_confirmation
  get "unsubscribe", to: "spa#show", as: :unsubscribe
  get "*path", to: "spa#show", constraints: ->(request) { request.format.html? && !request.path.start_with?("/rails/", "/api/") }
end
