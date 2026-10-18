class TasksController < ApplicationController
before_action :authenticate_user!
    def index
        @tasks = Task.all
    end

    def new
        @task = Task.new
    end

    

end
