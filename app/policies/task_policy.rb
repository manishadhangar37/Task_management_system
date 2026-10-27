class TaskPolicy < ApplicationPolicy
  class Scope < ApplicationPolicy::Scope
    def resolve
      case user.role

      when "manager"
        scope.all

      when "team_lead"
        developer_emails = User.where(role: %w[developer tester]).pluck(:email)
        manager_ids = User.where(role: "manager").select(:id)
        scope.where(assignee: developer_emails).or scope.where(assignee: user.email)

      when "developer", "tester"
        scope.where(assignee: user.email)
      else
        scope.none
      end
    end
  end

  def show?
    Scope.new(user, Task.where(id: record.id)).resolve.exists?
  end

  def create?
    %w[manager team_lead].include?(user.role)
  end

  def update?
    case user.role
    when "manager"
      record.user_id == user.id || User.where(email: record.reporter, role: "team_lead").exists?

    when "team_lead"
      record.assignee == user.email || User.where(email: record.assignee, role: "developer").exists?

    when "developer", "tester"
      record.assignee == user.email
    end
  end

  def destroy?
    user.role == "manager" && record.user_id == user.id
  end
end
