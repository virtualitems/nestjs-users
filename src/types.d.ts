type Generic<T = unknown> = Record<string, T>;

type Route = {
  path: string;
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

type HttpJsonResponse<T = unknown> = {
  message?: string;
  statusCode?: number;
  data?: T;
  error?: string | string[];
};

type FileData = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
};
