import { expect } from 'chai'
import { describe, it } from 'mocha'
import { RouterConcept } from '../concept';
import { RouterFetcher } from '../fetcher';

describe('router concept', () => {
    it('should handle fetchers', async () => {
        let concept = new RouterConcept, runFetcher = async (path: string) => {
            let info = concept.FindFetcher(path);
            return (info ? await info.fetcher.Handle({ path, params: (info.params || {}) }) : null);
        };

        concept.AddFetcher(new RouterFetcher('/', () => Promise.resolve('Home page')));
        concept.AddFetcher(new RouterFetcher('/about', () => Promise.resolve('About page')));
        concept.AddFetcher(new RouterFetcher('/users/:id:integer', ({ params }) => Promise.resolve(`User id: ${params['id']}`)));
        concept.AddFetcher(new RouterFetcher('/groups/:groupId/users/:userId', ({ params }) => Promise.resolve(`${params['groupId']}::${params['userId']}`)));
        concept.AddFetcher(new RouterFetcher('/articles/:id?', ({ params }) => Promise.resolve(`Article -> ${params['id'] || 'new'}`)));
        concept.AddFetcher(new RouterFetcher('/orders/:id?/delete', ({ params }) => Promise.resolve(`Order del -> ${params['id'] || 'all'}`)));
        concept.AddFetcher(new RouterFetcher('/%^profile.*$%/:userId?', ({ params }) => Promise.resolve(`Profile* -> ${params['userId'] || 'auth'}`)));
        concept.AddFetcher(new RouterFetcher(/^\/scope.*$/, () => Promise.resolve('Scoped page')));
        
        expect(await runFetcher('/unknown')).equal(null);
        expect(await runFetcher('/')).equal('Home page');

        expect(await runFetcher('/about')).equal('About page');
        expect(await runFetcher('/about/unknown')).equal(null);

        expect(await runFetcher('/users')).equal(null);
        expect(await runFetcher('/users/9')).equal('User id: 9');
        expect(await runFetcher('/users/john')).equal(null);
        expect(await runFetcher('/users/108')).equal('User id: 108');
        expect(await runFetcher('/users/9/unknown')).equal(null);

        expect(await runFetcher('/groups/0/users/9')).equal('0::9');
        expect(await runFetcher('/groups/10/users/99')).equal('10::99');

        expect(await runFetcher('/articles')).equal('Article -> new');
        expect(await runFetcher('/articles/18')).equal('Article -> 18');
        expect(await runFetcher('/articles/18/27')).equal(null);

        expect(await runFetcher('/orders/delete')).equal('Order del -> all');
        expect(await runFetcher('/orders/18/delete')).equal('Order del -> 18');
        expect(await runFetcher('/orders/18/27/delete')).equal(null);

        expect(await runFetcher('/profile')).equal('Profile* -> auth');
        expect(await runFetcher('/profile/36')).equal('Profile* -> 36');
        expect(await runFetcher('/profiles/72')).equal('Profile* -> 72');
        expect(await runFetcher('/profile-page/45')).equal('Profile* -> 45');
        expect(await runFetcher('/free-profile')).equal(null);

        expect(await runFetcher('/scope')).equal('Scoped page');
        expect(await runFetcher('/scoped-trade')).equal('Scoped page');
        expect(await runFetcher('/scope/name')).equal('Scoped page');
        expect(await runFetcher('/name/scope')).equal(null);
    });
});
