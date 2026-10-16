class Task < ApplicationRecord
  belongs_to :user
  validates :title, presence: true
  validates :description, presence: true
  validates :Assignee, presence: true
  validates :reporter, presence: true
  validates :status, presence: true
  validates :due_date, presence: true
  validates :priority, presence: true
 

  enum :status,{
    todo: 0,
    inProgress: 1,
    inReview: 2,
    done: 3
  }

  enum :priority,{
    high: 0,
    medium: 1,
    low: 2
  }
end
