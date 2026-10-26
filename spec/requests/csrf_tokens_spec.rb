require "rails_helper"

RSpec.describe "CSRF token endpoint", type: :request do
  it "returns a CSRF token as JSON" do
    get "/csrf_token", as: :json

    expect(response).to have_http_status(:ok)
    expect(response.media_type).to eq("application/json")
    expect(response.parsed_body["csrf_token"]).to be_present
  end
end