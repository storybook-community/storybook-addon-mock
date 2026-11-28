import type { StoryContext } from 'storybook/internal/types';

const listeners: Record<string, Array<(payload?: unknown) => void>> = {};
const channel = {
    emit: jest.fn((event: string, payload?: unknown) => {
        (listeners[event] ?? []).forEach((listener) => listener(payload));
    }),
    on: jest.fn((event: string, listener: (payload?: unknown) => void) => {
        (listeners[event] ??= []).push(listener);
    }),
};

jest.mock('storybook/preview-api', () => ({
    addons: { getChannel: () => channel },
}));
jest.mock('storybook/internal/core-events', () => ({
    FORCE_RE_RENDER: 'forceReRender',
    STORY_CHANGED: 'storyChanged',
}));

import { withRoundTrip } from './withRoundTrip';
import faker from './utils/faker';
import { EVENTS } from './utils/constants';

const mockFor = (url: string, name: string) => ({
    url,
    method: 'GET',
    status: 200,
    response: { name },
});

const renderStory = (id: string, mockData: unknown[]) => {
    const storyFn = jest.fn(() => 'rendered');
    const context = { id, parameters: { mockData } } as unknown as StoryContext;
    (withRoundTrip as (fn: unknown, ctx: StoryContext) => unknown)(
        storyFn,
        context
    );
    expect(storyFn).toHaveBeenCalled();
};

const responseFor = (url: string) =>
    (faker.matchMock(url, 'GET') as { response?: { name: string } } | null)
        ?.response?.name;

// Stories run as tests (portable stories, addon-vitest) render one after
// another with no manager UI, so STORY_CHANGED is never emitted.
describe('withRoundTrip without the manager UI', () => {
    it('applies each story its own mockData', () => {
        renderStory('example--first', [mockFor('/api/first', 'first')]);
        expect(responseFor('/api/first')).toBe('first');

        renderStory('example--second', [mockFor('/api/second', 'second')]);
        expect(responseFor('/api/second')).toBe('second');
        expect(responseFor('/api/first')).toBeUndefined();
    });

    it('keeps panel updates when the same story re-renders', () => {
        renderStory('example--third', [mockFor('/api/third', 'third')]);
        channel.emit(EVENTS.UPDATE, {
            item: mockFor('/api/third', 'third'),
            key: 'response',
            value: { name: 'edited' },
        });
        renderStory('example--third', [mockFor('/api/third', 'third')]);
        expect(responseFor('/api/third')).toBe('edited');
    });
});
