# == Schema Information
#
# Table name: questions
#
#  id               :bigint(8)        not null, primary key
#  description      :text             not null
#  feedback         :text
#  points_available :integer          default(1), not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  test_id          :integer          not null
#

FactoryBot.define do
  factory :question do
    test_id 1
    description "MyText"
    points_available 1
    feedback "MyText"
  end
end
