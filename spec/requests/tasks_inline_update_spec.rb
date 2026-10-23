require 'rails_helper'

RSpec.describe 'Task inline updates', type: :request do
  let(:user) { create(:user, role: 'manager', email: 'manager@example.com') }
  let!(:task) { create(:task, user: user, reporter: user.email, Assignee: 'old.assignee@example.com', status: 'todo', priority: 'medium', due_date: 1.day.from_now) }

  before do
    sign_in user
  end

  it 'updates multiple editable task fields through PATCH /tasks/:id' do
    patch "/tasks/#{task.id}", params: {
      task: {
        title: 'Updated title',
        description: 'Updated description',
        Assignee: 'new.assignee@example.com',
        status: 'inProgress',
        priority: 'high',
        due_date: '2026-11-15'
      }
    }, as: :json

    expect(response).to have_http_status(:ok)

    task.reload
    expect(task.title).to eq('Updated title')
    expect(task.description).to eq('Updated description')
    expect(task.Assignee).to eq('new.assignee@example.com')
    expect(task.status).to eq('inProgress')
    expect(task.priority).to eq('high')
    expect(task.due_date.to_date).to eq(Date.parse('2026-11-15'))
  end
end
