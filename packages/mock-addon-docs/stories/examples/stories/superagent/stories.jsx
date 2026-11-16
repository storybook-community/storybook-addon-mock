import preview from '../../../../.storybook/preview';
import React from 'react';
import { customMockData, mockData } from '../../../mock';
import { GetComponent } from '../../components/get-component';
import { callSuperAgent } from '../../utils';
import { customFunctinBlock } from '../../utils/code-blocks';

const meta = preview.meta({
    title: 'Examples/Superagent',
    component: GetComponent,
});

const Template = (args) => (
    <GetComponent title={args.title} callApi={callSuperAgent} />
);

export const Get = meta.story({
    render: Template,
    args: {
        title: 'Superagent (GET request)',
    },
    parameters: {
        mockData: mockData.slice(0, 1),
    },
});

export const ResponseFunction = meta.story({
    render: Template,
    args: {
        title: 'Superagent (Response function)',
        code: customFunctinBlock,
    },
    parameters: {
        mockData: customMockData,
    },
});
