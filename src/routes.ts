type Route = {
    url: string;
    method: string;
    receives: string | null;
    returns: string | null;
};

type Directory = {
    [key: string]: {
        [key: string]: Route;
    };
};


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

export const routes: Directory = Object.freeze({
    [namespaces.users]: {
        listAsJSON: {
            url: '/',
            method: methods.GET,
            receives: null,
            returns: formats.JSON,
        },
        listAsXLSX: {
            url: '/xls',
            method: methods.GET,
            receives: null,
            returns: formats.XLSX,
        },
        listAsXML: {
            url: '/xml',
            method: methods.GET,
            receives: null,
            returns: formats.XML,
        },
        showAsJSON: {
            url: '/:id',
            method: methods.GET,
            receives: null,
            returns: formats.JSON,
        },
        showAsXML: {
            url: '/:id/xml',
            method: methods.GET,
            receives: null,
            returns: formats.XML,
        },
        showAsPDF: {
            url: '/:id/pdf',
            method: methods.GET,
            receives: null,
            returns: formats.PDF,
        },
        createWithJSON: {
            url: '/',
            method: methods.POST,
            receives: formats.JSON,
            returns: null,
        },
        createWithXLSX: {
            url: '/xls',
            method: methods.POST,
            receives: formats.XLSX,
            returns: null,
        },
        updateWithJSON: {
            url: '/:id',
            method: methods.PUT,
            receives: formats.JSON,
            returns: null,
        },
        delete: {
            url: '/:id',
            method: methods.DELETE,
            receives: null,
            returns: null,
        },
        formsetWithJSON: {
            url: '/formset',
            method: methods.POST,
            receives: formats.JSON,
            returns: null,
        },
        attachmentsWithMultipart: {
            url: '/:id/attachments',
            method: methods.POST,
            receives: formats.MULTIPART,
            returns: null,
        },
        loginWithJSON: {
            url: '/login',
            method: methods.POST,
            receives: formats.JSON,
            returns: null,
        },
    },
});
