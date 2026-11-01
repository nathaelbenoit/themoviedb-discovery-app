import { isValidElement, type ReactElement, type ReactNode } from 'react';
import { StrictMode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { BrowserRouter } from 'react-router';
import App from './App';

const { createRootMock, renderMock } = vi.hoisted(() => ({
  createRootMock: vi.fn(),
  renderMock: vi.fn(),
}));

vi.mock('react-dom/client', () => ({
  createRoot: createRootMock,
}));

vi.mock('./App.tsx', () => ({
  default: vi.fn(),
}));

vi.mock('./global.css', () => ({}));

describe('main', () => {
  it('mounts the application inside BrowserRouter and StrictMode', async () => {
    // Arrange: provide a root element and mock React DOM's rendering API.
    const rootElement = {} as HTMLElement;
    const getElementByIdMock = vi.fn(() => rootElement);
    const documentMock = { getElementById: getElementByIdMock };

    vi.stubGlobal('document', documentMock);
    createRootMock.mockReturnValue({ render: renderMock });

    // Act: importing main executes the application's mounting code.
    await import('./main');

    // Assert: the application mounts to #root with the expected providers.
    expect(getElementByIdMock).toHaveBeenCalledExactlyOnceWith('root');
    expect(createRootMock).toHaveBeenCalledExactlyOnceWith(rootElement);
    expect(renderMock).toHaveBeenCalledOnce();

    const strictModeElement = renderMock.mock.calls[0][0] as ReactElement<{
      children: ReactNode;
    }>;

    expect(isValidElement(strictModeElement)).toBe(true);
    expect(strictModeElement.type).toBe(StrictMode);

    const routerElement = strictModeElement.props.children as ReactElement<{
      children: ReactNode;
    }>;

    expect(isValidElement(routerElement)).toBe(true);
    expect(routerElement.type).toBe(BrowserRouter);

    const appElement = routerElement.props.children as ReactElement;

    expect(isValidElement(appElement)).toBe(true);
    expect(appElement.type).toBe(App);

    vi.unstubAllGlobals();
  });
});
