import { fileURLToPath } from 'node:url';

/**
 * preview annotations are registered in .storybook/preview.tsx with definePreview
 */
export function previewAnnotations(entry = []) {
    return entry;
}

export function managerEntries(entry = []) {
    return [
        ...entry,
        fileURLToPath(import.meta.resolve('../../mock-addon/dist/manager.js')),
    ];
}

export * from '../../mock-addon/dist/preset.js';
