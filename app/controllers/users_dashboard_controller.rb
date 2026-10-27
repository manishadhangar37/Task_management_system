class UsersDashboardController < ApplicationController
    def index
        @tasks = current_user.tasks
        render json: @tasks
    end

    def all_users
        @users = User.all
        render json: @users
    end

    def assigned
        current_user_email = current_user.email
        @tasks = Task.where(assignee: current_user_email)
        render json: @tasks
    end

    def find_current_user
        render json: current_user
    end
end
