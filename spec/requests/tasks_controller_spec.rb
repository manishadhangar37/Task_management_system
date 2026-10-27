require "rails_helper"

RSpec.describe "Tasks API", type: :request do
  include Devise::Test::IntegrationHelpers
  let(:user) { create(:user, role: :manager, email: "manager@example.com") }
  let!(:task) do
    create(
      :task,
      user: user,
      reporter: user.email,
      Assignee: "developer@example.com",
      status: :todo,
      priority: :medium
    )
  end

  before do
    sign_in user
  end

  describe "GET /tasks" do
    it "returns tasks visible to the signed-in manager as JSON" do
      get "/tasks", as: :json

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body.map { |record| record["id"] }).to include(task.id)
    end
  end

  describe "POST /tasks" do
    let(:task_attributes) do
      {
        title: "Prepare release",
        description: "Review the release checklist",
        Assignee: "developer@example.com",
        status: "todo",
        due_date: 2.days.from_now.to_date,
        priority: "high"
      }
    end

    it "creates a task for the current user and sets the reporter" do
      expect do
        post "/tasks", params: { task: task_attributes }, as: :json
      end.to change(Task, :count).by(1)

      expect(response).to have_http_status(:created)
      expect(response.parsed_body["title"]).to eq("Prepare release")
      expect(response.parsed_body["reporter"]).to eq(user.email)
      expect(response.parsed_body["user_id"]).to eq(user.id)
    end

    it "returns validation errors for an invalid task" do
      post "/tasks", params: { task: task_attributes.merge(title: "") }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(response.parsed_body["errors"]).to include("Title can't be blank")
    end
  end

  describe "GET /tasks/:id" do
    it "returns the requested task as JSON" do
      get "/tasks/#{task.id}", as: :json

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["id"]).to eq(task.id)
    end
  end

  describe "PATCH /tasks/:id" do
    it "updates permitted task fields" do
      patch "/tasks/#{task.id}", params: {
        task: { title: "Updated task", priority: "high" }
      }, as: :json

      expect(response).to have_http_status(:ok)
      expect(task.reload.title).to eq("Updated task")
      expect(task.priority).to eq("high")
    end

    it "rejects an invalid status without changing the task" do
      patch "/tasks/#{task.id}", params: {
        task: { status: "not_a_status" }
      }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(response.parsed_body["errors"]).to include("Please choose a valid task status.")
      expect(task.reload.status).to eq("todo")
    end
  end

  context "when unauthenticated" do
    before do
      sign_out user
    end

    it "requires a user session" do
      get "/tasks", as: :json

      expect(response).to have_http_status(:unauthorized).or have_http_status(:found)
    end
  end
end
