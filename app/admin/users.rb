
ActiveAdmin.register User do
  permit_params :name, :email, :role, :password, :password_confirmation

  index do
    selectable_column
    id_column
    column :email
    column :name
    column :role
    column :created_at
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

  form do |f|
    f.inputs "User Details" do
      f.input :name
      f.input :email

      f.input :role,
              as: :select,
              collection: User.roles.keys,
              include_blank: false

      f.input :password
      f.input :password_confirmation
    end

    f.actions
  end
end
