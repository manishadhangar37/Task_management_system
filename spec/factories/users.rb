FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    password { "Strong@123" }
    password_confirmation { password }
    role { :developer }
  end
end
