class TaskMailer < ApplicationMailer
  def task_created(task)
    @task = task

    mail(
    to: @task.Assignee,
    subject: "New Task for You #{@task.title}"
    )
  end

  def due_date_reminder(task)
    @task = task
    mail(
      to: task.Assignee,
      subject: "Your Due date for #{task.title} is today"
    )
  end

  def task_updated(task)
    @task = task
    mail(
      to: task.Assignee,
      from: task.reporter,
      subject: "Task Updated: #{task.title}"
    )
  end
end
