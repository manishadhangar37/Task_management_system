require "rails_helper"

RSpec.describe TaskMailer, type: :mailer do
  let(:task) do
    build(
    :task,
    title: "Test Task",
    Assignee: "developer@example.com",
    reporter: "reporter@example.com"
    )
  end

  let(:mail) { described_class.task_created(task) }
  it "renders the headers" do
    expect(mail.subject).to eq("New Task for You Test Task")
    expect(mail.to).to eq([ "developer@example.com" ])
    expect(mail.from).to eq([ "from@example.com" ])
  end

  it "renders the body" do
  expect(mail.body.encoded).to match("You have a new task")
  expect(mail.body.encoded).to match("A task has been assigned to you.")
  expect(mail.body.encoded).to match(task.title)
  expect(mail.body.encoded).to match(task.description)
  expect(mail.body.encoded).to match(task.reporter)  end
end
