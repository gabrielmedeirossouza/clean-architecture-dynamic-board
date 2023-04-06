export interface CanvasProviderProtocol<T> {
    readonly width: number;
    readonly height: number;
    readonly context: T;
}
