export const ServerError = (response, functionName = "") => {
    const {status, statusText, url} = response
    const responseHeaders = Array
        .from(response.headers, value => value)
        .reduce((a, b) => a.concat({ [b[0]] : b[1] }), [])

    const error = Error(statusText)
    error.name = 'ServerError'
    error.status = status
    error.url = url
    error.functionName = functionName
    error.responseHeaders = responseHeaders

    if (Error.captureStackTrace) Error.captureStackTrace(error, ServerError)
    return error
}

export const _throw = error => { throw error }

export const sleep = async milliseconds => await new Promise(resolve => setTimeout(resolve, milliseconds))
