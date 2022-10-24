function filterRoute(route) {
    route = route.replace(/^\//g, '');
    route = route.replace(/\/$/g, '');

    return route;
}

module.exports = {
    filterRoute
}
