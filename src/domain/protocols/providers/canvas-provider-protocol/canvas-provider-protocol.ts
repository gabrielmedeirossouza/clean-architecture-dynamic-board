export abstract class CanvasProviderProtocol<T>
{
    public abstract get width(): number;

    public abstract get height(): number;

    public abstract get context(): T;
}
