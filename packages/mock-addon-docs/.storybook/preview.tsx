import { definePreview } from '@storybook/react-vite';
import addonDocs from '@storybook/addon-docs';
import addonLinks from '@storybook/addon-links';

// to load the built addon in this test Storybook
import addonMock from '../../mock-addon/dist/index.js';

export default definePreview({
    addons: [addonDocs(), addonLinks(), addonMock()],
    parameters: {
        mockAddonConfigs: {
            globalMockData: [],
            refreshStoryOnUpdate: true,
            disableUsingOriginal: false,
        },
    },
});
