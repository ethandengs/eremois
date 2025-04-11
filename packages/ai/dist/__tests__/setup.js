import '@tensorflow/tfjs-core';
// Mock WebGL context for TensorFlow.js
const mockWebGLContext = {
    getExtension: () => null,
    createBuffer: () => null,
    bindBuffer: () => null,
    bufferData: () => null,
    // Add other WebGL methods as needed
};
// Mock canvas and WebGL context
global.document = {
    createElement: (tag) => {
        if (tag === 'canvas') {
            return {
                getContext: () => mockWebGLContext,
            };
        }
        return {};
    },
};
// Custom test matchers
expect.extend({
    toBeModelCompatible(received, expected) {
        const hasRequiredMethods = [
            'initialize',
            'predict',
            'train',
            'export',
            'import',
            'dispose',
        ].every(method => typeof received[method] === 'function');
        const hasRequiredProperties = [
            'id',
            'metadata',
            'config',
        ].every(prop => prop in received);
        if (hasRequiredMethods && hasRequiredProperties) {
            return {
                message: () => 'Model implements BaseModel interface correctly',
                pass: true,
            };
        }
        else {
            return {
                message: () => 'Model does not implement BaseModel interface correctly',
                pass: false,
            };
        }
    },
});
// Global test timeout
jest.setTimeout(10000);
// Clear all mocks after each test
afterEach(() => {
    jest.clearAllMocks();
});
//# sourceMappingURL=setup.js.map