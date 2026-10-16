class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
  :recoverable, :rememberable, :validatable

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

