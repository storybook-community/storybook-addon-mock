import preview from '../../../../.storybook/preview';
import React from 'react';
import { customMockData, mockData } from '../../../mock';
import { GetComponent } from '../../components/get-component';
import { callFetch } from '../../utils';
import { customFunctinBlock } from '../../utils/code-blocks';

const meta = preview.meta({
    title: 'Examples/Fetch',
    component: GetComponent,
});

const Template = (args) => (
    <GetComponent title={args.title} callApi={callFetch} />
);

export const Get = meta.story({
    render: Template,
    args: {
        title: 'Fetch (GET request)',
    },
    parameters: {
        mockData: mockData.slice(0, 1),
    },
});

export const ResponseFunction = meta.story({
    render: Template,
    args: {
        title: 'Fetch (Response function)',
        code: customFunctinBlock,
    },
    parameters: {
        mockData: customMockData,
    },
});
