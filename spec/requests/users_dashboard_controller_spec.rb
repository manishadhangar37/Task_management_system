require "rails_helper"

RSpec.describe "Users dashboard API", type: :request do
  let(:user) { create(:user, role: :developer, email: "developer@example.com") }

  before do
    sign_in user
  end

  describe "GET /users_dashboard" do
    it "returns only tasks belonging to the current user" do
      own_task = create(:task, user: user, Assignee: user.email)
      create(:task, Assignee: "another@example.com")

      get "/users_dashboard", as: :json

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body.map { |record| record["id"] }).to eq([ own_task.id ])
    end
  end

  describe "GET /tasks/assigned" do
    it "returns tasks assigned to the current user's email" do
      assigned_task = create(:task, Assignee: user.email)
      create(:task, Assignee: "another@example.com")

      get "/tasks/assigned", as: :json

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body.map { |record| record["id"] }).to eq([ assigned_task.id ])
    end
  end

  describe "GET /current_user" do
    it "returns the signed-in user's identity" do
      get "/current_user", as: :json

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body).to include(
        "id" => user.id,
        "email" => user.email
      )
    end
  end

  context "when unauthenticated" do
    before do
      sign_out user
    end

    it "requires a user session for dashboard data" do
      get "/users_dashboard", as: :json

      expect(response).to have_http_status(:unauthorized).or have_http_status(:found)
    end
  end
end