type Route = {
    url: string;
    method: string;
};


export function routes(): { [key: string]: Route }
{
    return {
        index: {
            url: '',
            method: 'GET',
        },
        // users list
        usersListAsJSON: {
            url: 'users',
            method: 'GET',
        },
        usersListAsXLS: {
            url: 'users/xls',
            method: 'GET',
        },
        usersListAsXML: {
            url: 'users/xml',
            method: 'GET',
        },
        // users show
        showUserAsJSON: {
            url: 'users/:id',
            method: 'GET',
        },
        showUserAsXML: {
            url: 'users/:id/xml',
            method: 'GET',
        },
        showUserAsPDF: {
            url: 'users/:id/pdf',
            method: 'GET',
        },
        // users create
        createUserAsJSON: {
            url: 'users',
            method: 'POST',
        },
        createUserAsXLS: {
            url: 'users/xls',
            method: 'POST',
        },
        // users update
        updateUserAsJSON: {
            url: 'users/:id',
            method: 'PUT',
        },
        // users delete
        deleteUserAsJSON: {
            url: 'users/:id',
            method: 'DELETE',
        },
        // users crud
        formsetUserAsJSON: {
            url: 'users/formset',
            method: 'POST',
        },
        // users files
        uploadUserAttachmentsAsFormData: {
            url: 'users/:id/attachments',
            method: 'POST',
        },
        // auth login
        authLoginAsJSON: {
            url: 'auth/login',
            method: 'POST',
        },
    };
}
