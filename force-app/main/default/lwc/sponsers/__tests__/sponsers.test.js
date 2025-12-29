import { createElement } from '@lwc/engine-dom';
import Sponsers from 'c/sponsers';

describe('c-sponsers', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('TODO: basic smoke test - component renders', () => {
        const element = createElement('c-sponsers', { is: Sponsers });
        document.body.appendChild(element);
        expect(element).toBeTruthy();
    });
});
