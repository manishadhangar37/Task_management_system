
require 'rails_helper'

RSpec.describe User, type: :model do
  # Factory
  it 'has a valid factory' do
    expect(build(:user)).to be_valid
  end

  # Associations
  it { should have_many(:tasks) }

  # Validations
  it { should validate_presence_of(:email) }
  it { should validate_uniqueness_of(:email).case_insensitive }

  # Password validation
  it 'accepts a strong password' do
    user = build(:user, password: 'Strong@123',
                        password_confirmation: 'Strong@123')

    expect(user).to be_valid
  end

  it 'rejects a password without an uppercase letter' do
    user = build(:user, password: 'weak@123',
                        password_confirmation: 'weak@123')

    user.valid?

    expect(user.errors[:password]).to include(
      'must include uppercase, lowercase, number, and special character, and be at least 8 characters'
    )
  end

  it 'rejects a password without a lowercase letter' do
    user = build(:user, password: 'STRONG@123',
                        password_confirmation: 'STRONG@123')

    user.valid?

    expect(user.errors[:password]).to include(
      'must include uppercase, lowercase, number, and special character, and be at least 8 characters'
    )
  end

  it 'rejects a password without a number' do
    user = build(:user, password: 'Strong@abc',
                        password_confirmation: 'Strong@abc')

    user.valid?

    expect(user.errors[:password]).to include(
      'must include uppercase, lowercase, number, and special character, and be at least 8 characters'
    )
  end

  it 'rejects a password without a special character' do
    user = build(:user, password: 'Strong123',
                        password_confirmation: 'Strong123')

    user.valid?

    expect(user.errors[:password]).to include(
      'must include uppercase, lowercase, number, and special character, and be at least 8 characters'
    )
  end

  it 'rejects a password shorter than 8 characters' do
    user = build(:user, password: 'Ab@123',
                        password_confirmation: 'Ab@123')

    user.valid?

    expect(user.errors[:password]).to include(
      'must include uppercase, lowercase, number, and special character, and be at least 8 characters'
    )
  end

  # Enums
  it do
    should define_enum_for(:role).with_values(
      manager: 0,
      team_lead: 1,
      developer: 2,
      tester: 3
    )
  end
end
