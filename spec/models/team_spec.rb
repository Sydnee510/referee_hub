# == Schema Information
#
# Table name: teams
#
#  id                         :bigint           not null, primary key
#  city                       :string           not null
#  country                    :string           not null
#  group_affiliation          :integer          default("university")
#  joined_at                  :datetime
#  name                       :string           not null
#  state                      :string
#  status                     :integer          default("competitive")
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  national_governing_body_id :bigint
#
# Indexes
#
#  index_teams_on_national_governing_body_id  (national_governing_body_id)
#
# Foreign Keys
#
#  fk_rails_...  (national_governing_body_id => national_governing_bodies.id)
#

require 'rails_helper'

RSpec.describe Team, type: :model do
  let(:team) { create :team }

  subject { team.update!(status: 'developing') }

  it 'generates a changeset' do
    expect { subject }.to change { team.reload.team_status_changesets.count }.by(1)
    expect(team.reload.status).to eq 'developing'
  end

  context 'when updating a different attribute' do
    subject { team.update!(name: 'new name') }

    it 'does not generate a changeset' do
      expect { subject }.to_not change { team.reload.team_status_changesets.count }
    end
  end

  context 'when joined_at changes' do
    let(:prev_date) { Date.new }
    let(:new_date) { 10.days.ago }
    let!(:team) { create :team, joined_at: prev_date }
    let(:service_double) { double(:perform => :return_value) }

    before { allow(Services::ManageTeamJoinedChange).to receive(:new).and_return(service_double) }

    subject { team.update!(joined_at: new_date) }

    it 'calls the manage service' do
      expect(Services::ManageTeamJoinedChange).to receive(:new)
        .with(prev_date: prev_date, new_date: new_date, team: team)

      subject
    end
  end
end
