function filterRoute(route) {
    route = route.replace(/^\//g, '');
    route = route.replace(/\/$/g, '');

    return route;
}

function parseQueryRoute(baseRoute) {
    const [route, query] = baseRoute.split('?');
    const params = {};

    query?.split('&').forEach(keyValue => {
        const [key, value] = keyValue.split('=');

        if (value.includes(','))
            params[key] = value.split(',').map(v => isNaN(Number(v)) ? v : Number(v));
        else
            params[key] = isNaN(Number(value)) ? value : Number(value);
    });

    return {route: filterRoute(route), params};
}

module.exports = {
    filterRoute,
    parseQueryRoute
};
