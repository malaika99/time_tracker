require 'rails_helper'

RSpec.describe Task, type: :model do
  describe 'validations' do
    it 'is invalid if the end time is before the start time' do
      task = Task.new(start_time: Time.current, end_time: Time.current - 1.hour)
      expect(task).to_not be_valid
      expect(task.errors[:end_time]).to include('must be after the start time')
    end
  end
end
