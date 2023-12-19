module Api
  module V1
    class TasksController < ApplicationController
      protect_from_forgery with: :null_session
      before_action :set_task, only: [:show, :update, :destroy]
    
      def home
      end
    
      def index
        @tasks = Task.all
        render json: @tasks
      end
    
      def show
        render json: @task
      end
    
      def create
        @task = Task.new(task_params)
        if @task.save
          render json: @task, status: :created
        else
          render json: @task.errors.full_messages, status: :unprocessable_entity
        end
      end
    
      def update
        if @task.update(task_params)
          render json: @task
        else
          render json: @task.errors.full_messages, status: :unprocessable_entity
        end
      end
    
      def destroy
        @task.destroy
        head :no_content
      end
    
      private
    
      def set_task
        @task = Task.find(params[:id])
      end
    
      def task_params
        params.require(:task).permit(:id, :title, :description, :start_time, :end_time)
      end
    end
  end
end
