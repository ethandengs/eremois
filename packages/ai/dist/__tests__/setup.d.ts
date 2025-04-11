import '@tensorflow/tfjs-core';
declare global {
    namespace jest {
        interface Matchers<R> {
            toBeModelCompatible(expected: any): R;
        }
    }
}
//# sourceMappingURL=setup.d.ts.map