class TaskMailer < ApplicationMailer
  
  def task_created(task)
    @task = task
    
    mail(
    to: @task.Assignee,
    subject: "New Task for You #{@task.title}"
    )
  end
end
