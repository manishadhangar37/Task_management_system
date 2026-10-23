ActiveAdmin.register Task do
   permit_params :title, :description, :Assignee, :reporter,
                :status, :due_date, :priority
  actions :all



  index do
    selectable_column
    id_column
    column :title
    column :description
    column :due_date
    column :priority
    column :status
    column :Assignee
    column :reporter
    actions
  end

  show do
    attributes_table do
      row :title
      row :description
      row :due_date
      row :status
      row :Assignee
      row :reporter
      row :priority
    end
  end

  form do |f|
    f.inputs "Edit Task" do
      f.input :title
      f.input :description
      f.input :due_date
      f.input :status
      f.input :priority
      f.input :Assignee
      f.input :reporter
    end
    f.actions
  end
end
