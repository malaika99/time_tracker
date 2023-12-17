FactoryBot.define do
  factory :task do
    title { "Sample Task" }
    description { "Sample Description" }
    start_time { Time.now }
    end_time { Time.now + 1.hour }
  end
end