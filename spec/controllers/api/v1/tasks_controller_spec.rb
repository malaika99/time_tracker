require 'rails_helper'

RSpec.describe Api::V1::TasksController, type: :controller do
  describe "GET #index" do
    it "returns a success response" do
      create(:task)
      get :index
      expect(response).to be_successful
    end
  end

  describe "GET #show" do
    let(:task) { create(:task) }

    it "returns a success response" do
      get :show, params: { id: task.id }
      expect(response).to be_successful
    end
  end

  describe "POST #create" do
    context "with valid parameters" do
      let(:valid_attributes) { { title: "New Task", description: "New Description", start_time: Time.now, end_time: Time.now + 1.hour } }

      it "creates a new Task" do
        expect {
          post :create, params: { task: valid_attributes }
        }.to change(Task, :count).by(1)
      end

      it "returns a created status" do
        post :create, params: { task: valid_attributes }
        expect(response).to have_http_status(:created)
      end
    end

    context "with invalid parameters" do
      let(:invalid_attributes) { { title: "", end_time: "" } }

      it "does not create a new Task" do
        expect {
          post :create, params: { task: invalid_attributes }
        }.to_not change(Task, :count)
      end

      it "returns an unprocessable entity status" do
        post :create, params: { task: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "PUT #update" do
    let(:task) { create(:task) }
    let(:new_attributes) { { title: "Updated Task" } }

    context "with valid parameters" do
      it "updates the requested task" do
        put :update, params: { id: task.id, task: new_attributes }
        task.reload
        expect(task.title).to eq("Updated Task")
      end

      it "returns a success response" do
        put :update, params: { id: task.id, task: new_attributes }
        expect(response).to be_successful
      end
    end

    context "with invalid parameters" do
      it "returns an unprocessable entity status" do
        put :update, params: { id: task.id, task: { start_time: "" } }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "DELETE #destroy" do
    let!(:task) { create(:task) }

    it "destroys the requested task" do
      expect {
        delete :destroy, params: { id: task.id }
      }.to change(Task, :count).by(-1)
    end

    it "returns a success response" do
      delete :destroy, params: { id: task.id }
      expect(response).to have_http_status(:no_content)
    end
  end
end