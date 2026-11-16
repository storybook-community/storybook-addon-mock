import preview from '../../../../.storybook/preview';
import React from 'react';
import { customMockData, mockData } from '../../../mock';
import { GetComponent } from '../../components/get-component';
import { callAxios } from '../../utils';
import { customFunctinBlock } from '../../utils/code-blocks';

const meta = preview.meta({
    title: 'Examples/Axios',
    component: GetComponent,
});

const Template = (args) => (
    <GetComponent title={args.title} callApi={callAxios} code={args.code} />
);

export const Get = meta.story({
    render: Template,
    args: {
        title: 'Axios (GET request)',
    },
    parameters: {
        mockData: mockData.slice(0, 1),
    },
});

export const ResponseFunction = meta.story({
    render: Template,
    args: {
        title: 'Axios (Response function)',
        code: customFunctinBlock,
    },
    parameters: {
        mockData: customMockData,
    },
});
