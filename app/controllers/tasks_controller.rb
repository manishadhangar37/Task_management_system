class TasksController < ApplicationController
  before_action :authenticate_user!

  def index
    @tasks = policy_scope(Task).order(due_date: :asc)

    respond_to do |format|
      format.html
      format.json { render json: @tasks }
    end
  end

  def create
    @task = current_user.tasks.new(task_params)
    @task.reporter = current_user.email

    authorize @task
    if @task.save
      TaskMailer.task_created(@task).deliver_later
      render json: @task, status: :created
    else
      render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def show
    @task = policy_scope(Task).find(params[:id])
    authorize @task
    render json: @task
  end

  def update
    @task = policy_scope(Task).find(params[:id])
    authorize @task

    permitted = params.require(:task).permit(:title, :description, :Assignee, :reporter, :status, :due_date, :priority)

    if permitted[:status].present? && !Task.statuses.key?(permitted[:status].to_s)
      return render json: { errors: [ "Please choose a valid task status." ] }, status: :unprocessable_entity
    end

    if permitted[:priority].present? && !Task.priorities.key?(permitted[:priority].to_s)
      return render json: { errors: [ "Please choose a valid task priority." ] }, status: :unprocessable_entity
    end

    if @task.update(permitted)
      render json: @task, status: :ok
    else
      render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def task_params
    params.require(:task).permit(:title, :description, :Assignee, :reporter, :status, :due_date, :priority)
  end
end
