type Generic<T = unknown> = Record<string, T>;

type Route = {
    url: string;
    method: string;
    expects: string | null;
    returns: string | null;
};

type RoutesNamespace = {
    [key: string]: Route;
};

type RoutesDirectory = {
    [key: string]: RoutesNamespace;
};
