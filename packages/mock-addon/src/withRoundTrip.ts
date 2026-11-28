import type { DecoratorFunction, Parameters } from 'storybook/internal/types';

import { FORCE_RE_RENDER } from 'storybook/internal/core-events';
import { EVENTS, PARAM_KEY, GLOBAL_PARAM_KEY } from './utils/constants';
import faker from './utils/faker';
import { addons } from 'storybook/preview-api';

const getParameter = <T = unknown>(
    parameters: Parameters,
    key: string,
    defaultValue: T
): T => {
    return parameters[key] || defaultValue;
};

let INITIAL_MOUNT_STATE = true;
let CURRENT_STORY_ID: string | undefined;

const channel = addons.getChannel();

export const withRoundTrip: DecoratorFunction = (storyFn, context) => {
    const { parameters } = context;
    const paramData = getParameter(parameters, PARAM_KEY, []);
    const mockAddonConfigs = getParameter(parameters, GLOBAL_PARAM_KEY, {
        refreshStoryOnUpdate: false,
        globalMockData: [],
        disableUsingOriginal: false,
        ignoreQueryParams: false,
    });
    const {
        globalMockData,
        refreshStoryOnUpdate,
        disableUsingOriginal,
        ignoreQueryParams,
    } = mockAddonConfigs;
    const data = [...globalMockData, ...paramData];

    /**
     * Initiate event listener for panel updates.
     * This state executes once to setup.
     */
    if (INITIAL_MOUNT_STATE) {
        channel.on(EVENTS.UPDATE, ({ item, key, value }) => {
            faker.update(item, key, value);
            const req = faker.getRequests();
            channel.emit(EVENTS.SEND, {
                mockData: req,
                disableUsingOriginal,
            });
            if (refreshStoryOnUpdate) {
                channel.emit(FORCE_RE_RENDER);
            }
        });

        INITIAL_MOUNT_STATE = false;
    }

    /**
     * This state executes when a different story renders, so that it
     * takes the new parameters to set up the faker requests.
     * It is keyed by story id rather than the STORY_CHANGED event,
     * because only the manager UI emits that event: stories run as
     * tests (portable stories, addon-vitest) would otherwise reuse the
     * first story's mocks. Re-renders of the same story keep the mocks,
     * including edits made in the panel.
     */
    if (context.id !== CURRENT_STORY_ID) {
        CURRENT_STORY_ID = context.id;
        faker.makeInitialRequestMap(data);
        faker.setIgnoreQueryParams(ignoreQueryParams);

        channel.emit(EVENTS.SEND, {
            mockData: faker.getRequests(),
            disableUsingOriginal,
        });
    }
    return storyFn(context);
};
