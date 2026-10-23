Rails.application.routes.draw do
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  devise_for :users
  get "up" => "rails/health#show", as: :rails_health_check
   get "/tasks/assigned", to: "users_dashboard#assigned"
   get "/current_user", to: "users_dashboard#find_current_user"
  resources :tasks, only: [ :index, :create, :show, :update ]
  get "users_dashboard", to: "users_dashboard#index"
  get "/csrf_token", to: "csrf_tokens#show"
end
