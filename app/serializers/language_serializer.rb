# == Schema Information
#
# Table name: languages
#
#  id           :bigint           not null, primary key
#  long_name    :string           default("english"), not null
#  long_region  :string
#  short_name   :string           default("en"), not null
#  short_region :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
class LanguageSerializer < BaseSerializer
  attributes :long_name, :short_name, :short_region
end
