class TasksController < ApplicationController
  before_action :authenticate_user!
  def index
    @tasks = Task.all
  end
  
  
  def create
    @task = current_user.tasks.new(task_params)
    @task.reporter = current_user.email
    if @task.save
      TaskMailer.task_created(@task).deliver_later
      render json: @task, status: :created
    else
      render json: { errors: @task.errors.full_messages },
      status: :unprocessable_entity
    end
  end
  
  def update
    
    @task = Task.find(params[:id])
    
    if @task.update(params)
      
      render json: @task, status: :ok
    else
      render json: {errors: @task.errors.full_messages}, status: :unprocessable_entity
    end
  end
  
  private 
  def task_params
    params.require(:task).permit(:title,:description,:Assignee,:reporter,:status,:due_date,:priority)
  end
  
end
