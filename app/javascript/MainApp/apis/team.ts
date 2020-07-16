import axios from 'axios'
import { transform } from 'lodash'

import { HeadersMap } from '../pages/ImportWizard/MapStep';
import { DataAttributes, GetTeamSchema, IncludedAttributes } from '../schemas/getTeamSchema';
import { Attributes, Datum, GetTeamsSchema, GroupAffiliation, Meta, Status } from '../schemas/getTeamsSchema';
import { baseAxios, camelToSnake } from './utils'

export interface TeamsResponse {
  teams: Datum[];
  meta: Meta;
}

export interface TeamResponse {
  team: DataAttributes;
  id: string;
  socialAccounts: IncludedAttributes[]
}

export interface GetTeamsFilter {
  nationalGoverningBodies?: number[];
  status?: Status[];
  q?: string;
  groupAffiliation?: GroupAffiliation[];
  page?: number;
}

export interface UpdateTeamRequest extends Attributes {
  urls: string[]
}

export async function getTeams(filter: GetTeamsFilter) {
  const url = 'teams'
  const transformedFilter = camelToSnake(filter)

  try {
    const teamsResponse = await baseAxios.get<GetTeamsSchema>(url, { params: transformedFilter })

    return {
      meta: teamsResponse.data.meta,
      teams: teamsResponse.data.data,
    }
  } catch (err) {
    throw err   
  }
}

export async function getNgbTeams(filter?: GetTeamsFilter) {
  const url = 'ngb-admin/teams'
  const transformedFilter = camelToSnake(filter)

  try {
    const teamsResponse = await baseAxios.get<GetTeamsSchema>(url, { params: transformedFilter })

    return {
      meta: teamsResponse.data.meta,
      teams: teamsResponse.data.data,
    }
  } catch (err) {
    throw err
  }
}

export async function importNgbTeams(file: File, mappedData: HeadersMap) {
  const url = '/api/v1/ngb-admin/teams_import'
  const reversedMap = transform(mappedData, (acc, value, key) => {
    acc[value] = key
    return acc
  }, {})

  try {
    const data = new FormData()
    data.append('file', file)
    data.append('mapped_headers', JSON.stringify(reversedMap))

    const teamsResponse = await axios.post<GetTeamsSchema>(url, data)

    return {
      meta: teamsResponse.data.meta,
      teams: teamsResponse.data.data,
    }
  } catch (err) {
    throw err
  }
}

export async function createTeam(team: UpdateTeamRequest): Promise<TeamResponse> {
  const url = 'ngb-admin/teams'

  try {
    const teamResponse = await baseAxios.post<GetTeamSchema>(url, {...team})
    const socialAccounts = teamResponse.data.included.map((account) => account.attributes)

    return {
      id: teamResponse.data.data.id,
      socialAccounts,
      team: teamResponse.data.data.attributes,
    }
  } catch (err) {
    throw err
  }
}

export async function getTeam(id: string): Promise<TeamResponse> {
  const url = `ngb-admin/teams/${id}`

  try {
    const teamResponse = await baseAxios.get<GetTeamSchema>(url)
    const socialAccounts = teamResponse.data.included.map((account) => account.attributes)

    return {
      id: teamResponse.data.data.id,
      socialAccounts,
      team: teamResponse.data.data.attributes,
    }
  } catch (err) {
    throw err
  }
}

export async function updateTeam(id: string, team: UpdateTeamRequest): Promise<TeamResponse> {
  const url = `ngb-admin/teams/${id}`

  try {
    const teamResponse = await baseAxios.put<GetTeamSchema>(url, {...team})
    const socialAccounts = teamResponse.data.included.map((account) => account.attributes)

    return {
      id: teamResponse.data.data.id,
      socialAccounts,
      team: teamResponse.data.data.attributes,
    }
  } catch (err) {
    throw err
  }
}

export async function deleteTeam(id: string): Promise<TeamResponse> {
  const url = `ngb-admin/teams/${id}`

  try {
    const teamResponse = await baseAxios.delete<GetTeamSchema>(url)

    return {
      id: teamResponse.data.data.id,
      socialAccounts: [],
      team: teamResponse.data.data.attributes
    }
  } catch (err) {
    throw err
  }
}
