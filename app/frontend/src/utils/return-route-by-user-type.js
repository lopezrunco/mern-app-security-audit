export const returnRouteBlogActions = (userRole) => {
    switch (userRole) {
        case 'ADMIN':
            return "/admin/articulos"
        case 'AUTHOR':
            return "/autor/articulos/mis-articulos"
        default:
            return "/"
    }
}

export const returnRouteAdsActions = (userRole) => {
    switch (userRole) {
        case 'ADMIN':
            return "/admin/anuncios/listar"
        case 'AUTHOR':
            return "/autor/anuncios/mis-anuncios"
        default:
            return "/"
    }
}

// TO DO: Create a new function to return Event, lot and preoffer actions