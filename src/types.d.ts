type Generic<T = unknown> = Record<string, T>;

type Route = {
    url: string;
    method: string;
    contentType?: string;
    accept?: string;
};

type RoutesNamespace = {
    [key: string]: Route;
};

type RoutesDirectory = {
    [key: string]: RoutesNamespace;
};
