class TaskReminderJob < ApplicationJob
  queue_as :default

  def perform
    tasks = Task.where(due_date: Time.zone.today.all_day).where.not(status: :done)
    tasks.each do |task|
      TaskMailer.due_date_reminder(task).deliver_now
    end
  end
end
