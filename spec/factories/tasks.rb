FactoryBot.define do
  factory :task do
    association :user
    title { "Sample Task" }
    description { "A task description" }
    Assignee { "John Doe" }
    reporter { "Jane Smith" }
    status { :todo }
    due_date { 1.week.from_now }
    priority { :medium }
  end
end
