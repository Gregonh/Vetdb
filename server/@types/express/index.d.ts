// to make the file a module and avoid the TypeScript error
export {};

declare global {
  namespace Express {
    export interface Request {
      userId?: string;
      //...any other field you might attach to request object
    }
  }
}
