import { describe, it, expect, vi } from 'vitest';
import { StrictMode } from 'react';

// Mock `createRoot` ve `render` methodunu global olarak tanımlayın
const renderMock = vi.fn();
const createRootMock = vi.fn(() => ({ render: renderMock }));

// `react-dom/client` modülünü mocklayın
vi.mock('react-dom/client', () => ({
  createRoot: createRootMock,
}));

// Mock `App` bileşeni
vi.mock('./App.tsx', () => ({
  default: () => <div>MockedApp</div>,
}));

describe('Main entry point', () => {
  it('renders the App component into the root element', async () => {
    // Mock the root element
    const rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);

    // `document.getElementById`'yi mocklayın
    vi.spyOn(document, 'getElementById').mockReturnValue(rootElement);

    // Dynamically import the main file (this triggers the rendering)
    await import('./main');

    // Assert that `document.getElementById` was called with 'root'
    expect(document.getElementById).toHaveBeenCalledWith('root');

    // Assert that `createRoot` was called with the root element
    expect(createRootMock).toHaveBeenCalledWith(rootElement);

    // Assert that `createRoot`'s `render` method was called with the correct structure
    expect(renderMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: StrictMode,
        props: expect.objectContaining({
          children: expect.anything(), // Accepts any React element
        }),
      }),
    );
  });
});