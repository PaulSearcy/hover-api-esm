import fetch from 'node-fetch'
import { ServerError, _throw, sleep } from './util.js'

let cookies = ''

let hoverApiUrl = 'https://www.hover.com/api/control_panel'
export const setHoverApiUrl = url => hoverApiUrl = url

const hoverFetchBase = (body, method = 'POST') => {
    let fetchOptions = {
        method: method,
        headers: {
            'Content-Type':'application/json;charset=UTF-8',
            'cookie': cookies
        },
        credentials: 'include',
        body: JSON.stringify(body)
    }
    if (method === 'GET'){
        delete fetchOptions.body
    }
    return fetchOptions
}

export const login = async (username, password) =>
    fetch(
        'https://www.hover.com/api/login',
        hoverFetchBase({
            username: username,
            password: password,
            remember: 'true'
        })
    )
    .then(data => data.status !== 200 ?
            _throw(ServerError(data, login.name))
        :
            data
    )
    .then(data => cookies = data.headers.get('set-cookie') )
    .catch(console.error)

export const getDomains = async () => 
    fetch(
        `${hoverApiUrl}/domains`,
        hoverFetchBase({}, 'GET')
    )
    .then(data => data.status !== 200 ?
            _throw(ServerError(data, getDomains.name))
        :
            data.json()
    )
    .then(data => data.domains)
    .catch(console.error)

export const getRecords = async (domain) =>
    fetch(
        `${hoverApiUrl}/dns/${domain}`,
        hoverFetchBase({}, 'GET')
    )
    .then(data => data.status !== 200 ?
            _throw(ServerError(data, getRecords.name))
        :
            data.json()
    )
    .then(data => data.domain.dns)
    .catch(console.error)

export const createRecord = async (content,name,ttl,type,domain) =>
    fetch(
        `${hoverApiUrl}/dns`,
        hoverFetchBase(
            {
                dns_record: {
                    content: content,
                    name: name,
                    ttl: ttl,
                    type: type
                },
                id: `domain-${domain}`
            },
            'POST'
        )
    )
    .then(data => data.status !== 200 ?
            _throw(ServerError(data, createRecord.name))
        :
            data.json()
    )
    .then(data => data.dns_record)
    .catch(console.error)

export const updateRecord = async (id, params) =>
    fetch(
        `${hoverApiUrl}/dns`,
        hoverFetchBase(
            {
                domain: {
                    dns_records: [
                        {
                            can_revert: false,
                            content: params.content,
                            id: id,
                            is_default: false,
                            name: params.name,
                            ttl: params.ttl,
                            type: params.type,
                        }
                    ],
                    id: `domain-${params.domain}`
                },
                fields: {
                    content: params.content,
                    ttl: params.ttl
                }
            },
            'PUT'
        )
    )
    .then(data => data.status !== 200 ?
            _throw(ServerError(data, updateRecord.name))
        :
            data.json()
    )
    .then(data => data.domain.dns_records[0])
    .catch(console.error)

export const deleteRecords = async (domain, dnsRecords) =>
    fetch(
        `${hoverApiUrl}/dns`,
        hoverFetchBase({
            domains: [
                {
                    id: `domain-${domain}`,
                    name: domain,
                    dns_records: dnsRecords
                }
            ]
        }, 'DELETE')
    )
    .then(data => data.status !== 200 ?
            _throw(ServerError(data, deleteRecords.name))
        :
            data.json()
    )
    .then(data => data.domains.dns_records)
    .catch(console.error)

export { sleep }

export default {
    login,
    setHoverApiUrl,
    getRecords,
    getDomains,
    createRecord,
    updateRecord,
    deleteRecords,
    sleep
}