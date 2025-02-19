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

export const namespaces: { [key: string]: string; } = Object.freeze({
    users: 'users',
});


class RoutesDirectoryBuilder
{
    protected _baseurl: URL;
    protected _routes: RoutesDirectory;

    public constructor(baseurl: URL)
    {
        this._baseurl = baseurl;
        this._routes = {};
    }

    public set(data: {
        namespace: string,
        key: string,
        path: string,
        method: string,
        contentType?: string,
        accept?: string;
    })
    {
        const url = this._baseurl + namespaces[data.namespace] + data.path;

        if (!(data.namespace in this._routes)) {
            this._routes[data.namespace] = {};
        }

        this._routes[data.namespace][data.key] = {
            url,
            method: data.method,
            contentType: data.contentType,
            accept: data.accept,
        };

        return this;
    }

    public build()
    {
        return Object.freeze(this._routes);
    }
}


const builder = new RoutesDirectoryBuilder(new URL('http://localhost:3000/')); // BASE_URL


export const routes: RoutesDirectory = builder
    .set({
        namespace: namespaces.users,
        key: 'listAsJSON',
        path: '/',
        method: methods.GET,
        contentType: undefined,
        accept: formats.JSON,
    })
    .set({
        namespace: namespaces.users,
        key: 'listAsXLSX',
        path: '/xls',
        method: methods.GET,
        contentType: undefined,
        accept: formats.XLSX,
    })
    .set({
        namespace: namespaces.users,
        key: 'listAsXML',
        path: '/xml',
        method: methods.GET,
        contentType: undefined,
        accept: formats.XML,
    })
    .set({
        namespace: namespaces.users,
        key: 'showAsJSON',
        path: '/:id',
        method: methods.GET,
        contentType: undefined,
        accept: formats.JSON,
    })
    .set({
        namespace: namespaces.users,
        key: 'showAsXML',
        path: '/:id/xml',
        method: methods.GET,
        contentType: undefined,
        accept: formats.XML,
    })
    .set({
        namespace: namespaces.users,
        key: 'showAsPDF',
        path: '/:id/pdf',
        method: methods.GET,
        contentType: undefined,
        accept: formats.PDF,
    })
    .set({
        namespace: namespaces.users,
        key: 'createWithJSON',
        path: '/',
        method: methods.POST,
        contentType: formats.JSON,
        accept: undefined,
    })
    .set({
        namespace: namespaces.users,
        key: 'createWithXLSX',
        path: '/xls',
        method: methods.POST,
        contentType: formats.XLSX,
        accept: undefined,
    })
    .set({
        namespace: namespaces.users,
        key: 'updateWithJSON',
        path: '/:id',
        method: methods.PUT,
        contentType: formats.JSON,
        accept: undefined,
    })
    .set({
        namespace: namespaces.users,
        key: 'delete',
        path: '/:id',
        method: methods.DELETE,
        contentType: undefined,
        accept: undefined,
    })
    .set({
        namespace: namespaces.users,
        key: 'formsetWithJSON',
        path: '/formset',
        method: methods.POST,
        contentType: formats.JSON,
        accept: undefined,
    })
    .set({
        namespace: namespaces.users,
        key: 'attachmentsWithMultipart',
        path: '/:id/attachments',
        method: methods.POST,
        contentType: formats.MULTIPART,
        accept: undefined,
    })
    .set({
        namespace: namespaces.users,
        key: 'loginWithJSON',
        path: '/login',
        method: methods.POST,
        contentType: formats.JSON,
        accept: undefined,
    })
    .build();
