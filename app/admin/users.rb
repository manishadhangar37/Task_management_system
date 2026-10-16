
ActiveAdmin.register User do
  permit_params :email

  index do
    selectable_column
    id_column
    column :email
    column :created_at
    column :name
    column :role
    
    actions
  end

  filter :email
  filter :name
  filter :role
  filter :created_at

  show do
    attributes_table do
      row :id
      row :email
      row :created_at
      row :updated_at
    end
  end

  #Edit form
  
ActiveAdmin.register User do
  permit_params :role

  index do
    selectable_column
    id_column
    column :email
    column :created_at
    column :name
    column :role
    actions
  end

  filter :email
  filter :name
  filter :role
  filter :created_at

  show do
    attributes_table do
      row :id
      row :email
      row :name
      row :role
      row :created_at
      row :updated_at
    end
  end

  # Edit form: only role
  form do |f|
    f.inputs "Edit User Role" do
       f.input :email
      f.input :role, include_blank: false
    end
    f.actions
  end
end


end
