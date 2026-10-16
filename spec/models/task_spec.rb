require 'rails_helper'

RSpec.describe Task, type: :model do
  # Factory
  it 'has a valid factory' do
    expect(build(:task)).to be_valid
  end

  # Associations
  it { should belong_to(:user) }

  # Validations
  it { should validate_presence_of(:title) }
  it { should validate_presence_of(:description) }
  it { should validate_presence_of(:Assignee) }
  it { should validate_presence_of(:reporter) }
  it { should validate_presence_of(:status) }
  it { should validate_presence_of(:due_date) }
  it { should validate_presence_of(:priority) }

  # Enums
  it { should define_enum_for(:status).with_values(todo: 0, inProgress: 1, inReview: 2, done: 3) }
  it { should define_enum_for(:priority).with_values(high: 0, medium: 1, low: 2) }
end
