type Route = {
    url: string;
    method: string;
};

type RouteTree = {
    [key: string]: Route | RouteTree;
};


export function routes(): RouteTree
{
    return {
        index: {
            url: '/',
            method: 'GET',
        },
        users: {
            list: {
                json: {
                    url: '/users',
                    method: 'GET',
                },
                xls: {
                    url: '/users/xls',
                    method: 'GET',
                },
                xml: {
                    url: '/users/xml',
                    method: 'GET',
                }
            },
            show: {
                json: {
                    url: '/users/:id',
                    method: 'GET',
                },
                xml: {
                    url: '/users/:id/xml',
                    method: 'GET',
                },
                pdf: {
                    url: '/users/:id/pdf',
                    method: 'GET',
                }
            },
            create: {
                json: {
                    url: '/users',
                    method: 'POST',
                },
                xls: {
                    url: '/users/xls',
                    method: 'POST',
                },
                formset: {
                    json: {
                        url: '/users/formset',
                        method: 'POST',
                    }
                }
            },
            update: {
                json: {
                    url: '/users/:id',
                    method: 'PUT',
                },
            },
            delete: {
                json: {
                    url: '/users/:id',
                    method: 'DELETE',
                },
            },
            attachments: {
                json: {
                    url: '/users/:id/attachments',
                    method: 'POST',
                },
            },
        },
        auth: {
            login: {
                json: {
                    url: '/auth/login',
                    method: 'POST',
                },
            },
        },
    };
} //:: ƒ routes(): RouteTree
