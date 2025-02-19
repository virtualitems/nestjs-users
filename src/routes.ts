export const methods = Object.freeze({
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH',
    OPTIONS: 'OPTIONS',
    HEAD: 'HEAD',
});

export const formats = Object.freeze({
    CSV: 'text/csv',
    FORM: 'application/x-www-form-urlencoded',
    JSON: 'application/json',
    MULTIPART: 'multipart/form-data',
    PDF: 'application/pdf',
    XLS: 'application/vnd.ms-excel',
    XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    XML: 'application/xml',
    ZIP: 'application/zip',
});

export const namespaces = Object.freeze({
    users: 'users',
});

export function routes(baseUrl: string = '')
{
    return Object.freeze({
        users: {
            listAsJSON: {
                namespace: namespaces.users,
                path: '/',
                url: baseUrl + '/' + namespaces.users + '/',
                method: methods.GET,
                contentType: undefined,
                accept: formats.JSON,
            },
            listAsXLSX: {
                namespace: namespaces.users,
                path: '/xls',
                url: baseUrl + '/' + namespaces.users + '/xls',
                method: methods.GET,
                contentType: undefined,
                accept: formats.XLSX,
            },
            listAsXML: {
                namespace: namespaces.users,
                path: '/xml',
                url: baseUrl + '/' + namespaces.users + '/xml',
                method: methods.GET,
                contentType: undefined,
                accept: formats.XML,
            },
            showAsJSON: {
                namespace: namespaces.users,
                path: '/:id',
                url: baseUrl + '/' + namespaces.users + '/:id',
                method: methods.GET,
                contentType: undefined,
                accept: formats.JSON,
            },
            showAsXML: {
                namespace: namespaces.users,
                path: '/:id/xml',
                url: baseUrl + '/' + namespaces.users + '/:id/xml',
                method: methods.GET,
                contentType: undefined,
                accept: formats.XML,
            },
            showAsPDF: {
                namespace: namespaces.users,
                path: '/:id/pdf',
                url: baseUrl + '/' + namespaces.users + '/:id/pdf',
                method: methods.GET,
                contentType: undefined,
                accept: formats.PDF,
            },
            createWithJSON: {
                namespace: namespaces.users,
                path: '/',
                url: baseUrl + '/' + namespaces.users + '/',
                method: methods.POST,
                contentType: formats.JSON,
                accept: undefined,
            },
            createWithXLSX: {
                namespace: namespaces.users,
                path: '/xls',
                url: baseUrl + '/' + namespaces.users + '/xls',
                method: methods.POST,
                contentType: formats.XLSX,
                accept: undefined,
            },
            updateWithJSON: {
                namespace: namespaces.users,
                path: '/:id',
                url: baseUrl + '/' + namespaces.users + '/:id',
                method: methods.PUT,
                contentType: formats.JSON,
                accept: undefined,
            },
            delete: {
                namespace: namespaces.users,
                path: '/:id',
                url: baseUrl + '/' + namespaces.users + '/:id',
                method: methods.DELETE,
                contentType: undefined,
                accept: undefined,
            },
            formsetWithJSON: {
                namespace: namespaces.users,
                path: '/formset',
                url: baseUrl + '/' + namespaces.users + '/formset',
                method: methods.POST,
                contentType: formats.JSON,
                accept: undefined,
            },
            attachmentsWithMultipart: {
                namespace: namespaces.users,
                path: '/:id/attachments',
                url: baseUrl + '/' + namespaces.users + '/:id/attachments',
                method: methods.POST,
                contentType: formats.MULTIPART,
                accept: undefined,
            },
            loginWithJSON: {
                namespace: namespaces.users,
                path: '/login',
                url: baseUrl + '/' + namespaces.users + '/login',
                method: methods.POST,
                contentType: formats.JSON,
                accept: undefined,
            },
        }
    });
}
