require "rails_helper"

RSpec.describe TaskReminderJob, type: :job do
  describe "#perform" do
    let!(:due_task1) do
      create(:task, due_date: Time.zone.now, status: :inProgress)
    end

    let!(:due_task2) do
      create(:task, due_date: Time.zone.now, status: :inReview)
    end

    let!(:completed_task) do
      create(:task, due_date: Time.zone.now, status: :done)
    end

    let!(:future_task) do
      create(:task, due_date: 2.days.from_now, status: :inProgress)
    end

    it "sends reminders for tasks due today that are not completed" do
      mail_double = instance_double(ActionMailer::MessageDelivery, deliver_now: true)

      expect(TaskMailer).to receive(:due_date_reminder)
        .with(due_task1).ordered.and_return(mail_double)

      expect(TaskMailer).to receive(:due_date_reminder)
        .with(due_task2).ordered.and_return(mail_double)

      described_class.perform_now
    end

    it "does not send reminders for completed tasks" do
      allow(TaskMailer).to receive(:due_date_reminder)
        .and_return(double(deliver_now: true))

      described_class.perform_now

      expect(TaskMailer).not_to have_received(:due_date_reminder)
        .with(completed_task)
    end

    it "does not send reminders for tasks due on another date" do
      allow(TaskMailer).to receive(:due_date_reminder)
        .and_return(double(deliver_now: true))

      described_class.perform_now

      expect(TaskMailer).not_to have_received(:due_date_reminder)
        .with(future_task)
    end
  end
end
