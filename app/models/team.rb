# == Schema Information
#
# Table name: teams
#
#  id                         :bigint(8)        not null, primary key
#  city                       :string           not null
#  country                    :string           not null
#  name                       :string           not null
#  state                      :string
#  status                     :integer          default("competitive")
#  type                       :integer          default("university")
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  national_governing_body_id :bigint(8)
#
# Indexes
#
#  index_teams_on_national_governing_body_id  (national_governing_body_id)
#
# Foreign Keys
#
#  fk_rails_...  (national_governing_body_id => national_governing_bodies.id)
#

class Team < ApplicationRecord
  enum status: {
    competitive: 0,
    developing: 1,
    inactive: 2
  }

  enum type: {
    university: 0,
    community: 1,
    youth: 2
  }

  belongs_to :national_governing_body

  has_many :team_status_changesets, dependent: :destroy
end
