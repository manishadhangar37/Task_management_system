class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  has_many :tasks
  devise :database_authenticatable, :registerable,
  :recoverable, :rememberable, :validatable
  validates :password,format: { with: /\A(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}\z/,
            message: "must include uppercase, lowercase, number, and special character, and be at least 8 characters"}, if: -> { password.present? }


  enum :role,{
  manager: 0,
  team_lead: 1,
  developer: 2 ,
  tester: 3
}

# Attributes ActiveAdmin can search and filter
def self.ransackable_attributes(auth_object = nil)
  %w[id name email role created_at updated_at]
end

 def self.ransackable_associations(auth_object = nil)
    []
  end
  
end
