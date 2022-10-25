const {describe, it} = require('mocha');
const {expect} = require('chai');
const {filterRoute, parseQueryRoute} = require('../lib/Utils');
const isEqual = require('lodash/isEqual');

describe('Utils', function () {
    it('Should remove leading and trailing slashes.', async function () {
        expect(filterRoute('/v1/test/')).to.be.equal('v1/test');
    });

    it('Should split route and query sections', async function () {
        const route = '/v1/test/';
        const query = '?key=value';
        const fullUrl = filterRoute(`${route}${query}`);
        const parsedQuery = {
            key: 'value'
        };

        const {route: parsedRoute, params: parsedParams} = parseQueryRoute(fullUrl);

        expect(isEqual(parsedRoute, filterRoute(route))).to.be.true;
        expect(isEqual(parsedParams, parsedQuery)).to.be.true;
    });

    it('Should parse numbers as number types', async function () {
        const route = filterRoute('/v1/test/?num=0');

        const {params: parsedParams} = parseQueryRoute(route);
        expect(isNaN(parsedParams.num)).to.be.false;
    });

    it('Should parse comma separated values into arrays', async function () {
        const route = filterRoute('/v1/test/?array=a,b,c');
        const parsedQuery = {
            array: ['a', 'b', 'c']
        };

        const {params: parsedParams} = parseQueryRoute(route);
        expect(isEqual(parsedParams, parsedQuery)).to.be.true;
    });

    it('Should parse comma separated numbers into number arrays', async function () {
        const route = filterRoute('/v1/test/?array=0,1,2');
        const parsedQuery = {
            array: [0, 1, 2]
        };

        const {params: parsedParams} = parseQueryRoute(route);
        expect(isEqual(parsedParams, parsedQuery)).to.be.true;
    });
});
