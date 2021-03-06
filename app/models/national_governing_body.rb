# == Schema Information
#
# Table name: national_governing_bodies
#
#  id                :bigint           not null, primary key
#  acronym           :string
#  country           :string
#  image_url         :string
#  membership_status :integer          default("area_of_interest"), not null
#  name              :string           not null
#  player_count      :integer          default(0), not null
#  region            :integer
#  website           :string
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#
# Indexes
#
#  index_national_governing_bodies_on_region  (region)
#

class NationalGoverningBody < ApplicationRecord
  include Rails.application.routes.url_helpers # needed to generate logo image route
  require 'activerecord-import/base'
  require 'activerecord-import/active_record/adapters/postgresql_adapter'

  self.per_page = 50

  enum region: {
    north_america: 0,
    south_america: 1,
    europe: 2,
    africa: 3,
    asia: 4
  }

  enum membership_status: {
    area_of_interest: 0,
    emerging: 1,
    developing: 2,
    full: 3,
  }

  has_many :referee_locations, dependent: :destroy
  has_many :referees, through: :referee_locations
  has_many :certified_referees, -> { certified }, through: :referee_locations, source: :referee

  has_many :teams, dependent: :destroy
  has_many :stats, inverse_of: :national_governing_body, class_name: 'NationalGoverningBodyStat', dependent: :destroy
  has_many :social_accounts, as: :ownable, dependent: :destroy

  has_many :national_governing_body_admins, dependent: :destroy
  has_many :admins, through: :national_governing_body_admins, source: :user

  has_one_attached :logo

  def logo_url
    return nil unless self.logo.attached?

    rails_blob_url(self.logo)
  end

  def is_admin?(user_id)
    admins.pluck(:user_id).include?(user_id)
  end
end
