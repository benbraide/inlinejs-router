"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const concept_1 = require("../concept");
const fetcher_1 = require("../fetcher");
(0, mocha_1.describe)('router concept', () => {
    (0, mocha_1.it)('should handle fetchers', () => __awaiter(void 0, void 0, void 0, function* () {
        let concept = new concept_1.RouterConcept, runFetcher = (path) => __awaiter(void 0, void 0, void 0, function* () {
            let info = concept.FindFetcher(path);
            return (info ? yield info.fetcher.Handle({ path, params: (info.params || {}) }) : null);
        });
        concept.AddFetcher(new fetcher_1.RouterFetcher('/', () => Promise.resolve('Home page')));
        concept.AddFetcher(new fetcher_1.RouterFetcher('/about', () => Promise.resolve('About page')));
        concept.AddFetcher(new fetcher_1.RouterFetcher('/users/:id:integer', ({ params }) => Promise.resolve(`User id: ${params['id']}`)));
        concept.AddFetcher(new fetcher_1.RouterFetcher('/groups/:groupId/users/:userId', ({ params }) => Promise.resolve(`${params['groupId']}::${params['userId']}`)));
        concept.AddFetcher(new fetcher_1.RouterFetcher('/articles/:id?', ({ params }) => Promise.resolve(`Article -> ${params['id'] || 'new'}`)));
        concept.AddFetcher(new fetcher_1.RouterFetcher('/orders/:id?/delete', ({ params }) => Promise.resolve(`Order del -> ${params['id'] || 'all'}`)));
        concept.AddFetcher(new fetcher_1.RouterFetcher('/%^profile.*$%/:userId?', ({ params }) => Promise.resolve(`Profile* -> ${params['userId'] || 'auth'}`)));
        concept.AddFetcher(new fetcher_1.RouterFetcher(/^\/scope.*$/, () => Promise.resolve('Scoped page')));
        (0, chai_1.expect)(yield runFetcher('/unknown')).equal(null);
        (0, chai_1.expect)(yield runFetcher('/')).equal('Home page');
        (0, chai_1.expect)(yield runFetcher('/about')).equal('About page');
        (0, chai_1.expect)(yield runFetcher('/about/unknown')).equal(null);
        (0, chai_1.expect)(yield runFetcher('/users')).equal(null);
        (0, chai_1.expect)(yield runFetcher('/users/9')).equal('User id: 9');
        (0, chai_1.expect)(yield runFetcher('/users/john')).equal(null);
        (0, chai_1.expect)(yield runFetcher('/users/108')).equal('User id: 108');
        (0, chai_1.expect)(yield runFetcher('/users/9/unknown')).equal(null);
        (0, chai_1.expect)(yield runFetcher('/groups/0/users/9')).equal('0::9');
        (0, chai_1.expect)(yield runFetcher('/groups/10/users/99')).equal('10::99');
        (0, chai_1.expect)(yield runFetcher('/articles')).equal('Article -> new');
        (0, chai_1.expect)(yield runFetcher('/articles/18')).equal('Article -> 18');
        (0, chai_1.expect)(yield runFetcher('/articles/18/27')).equal(null);
        (0, chai_1.expect)(yield runFetcher('/orders/delete')).equal('Order del -> all');
        (0, chai_1.expect)(yield runFetcher('/orders/18/delete')).equal('Order del -> 18');
        (0, chai_1.expect)(yield runFetcher('/orders/18/27/delete')).equal(null);
        (0, chai_1.expect)(yield runFetcher('/profile')).equal('Profile* -> auth');
        (0, chai_1.expect)(yield runFetcher('/profile/36')).equal('Profile* -> 36');
        (0, chai_1.expect)(yield runFetcher('/profiles/72')).equal('Profile* -> 72');
        (0, chai_1.expect)(yield runFetcher('/profile-page/45')).equal('Profile* -> 45');
        (0, chai_1.expect)(yield runFetcher('/free-profile')).equal(null);
        (0, chai_1.expect)(yield runFetcher('/scope')).equal('Scoped page');
        (0, chai_1.expect)(yield runFetcher('/scoped-trade')).equal('Scoped page');
        (0, chai_1.expect)(yield runFetcher('/scope/name')).equal('Scoped page');
        (0, chai_1.expect)(yield runFetcher('/name/scope')).equal(null);
    }));
});
