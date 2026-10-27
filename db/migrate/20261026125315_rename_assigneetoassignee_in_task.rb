class RenameAssigneetoassigneeInTask < ActiveRecord::Migration[8.1]
  def change
    rename_column :tasks, :Assignee, :assignee
  end
end
