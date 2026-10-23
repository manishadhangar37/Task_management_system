class UsersDashboardController < ApplicationController
    before_action :authenticate_user!

    def index
        @tasks = current_user.tasks
        render json: @tasks
    end
end
