import "server-only";

export const loggerMiddleware = <T,P>(actionName: string, action: (input: T) => Promise<P>) => {
  return async (input: T) => {
    console.log(`Action ${actionName} started`);
    const result = await action(input);
    console.log(`Action ${actionName} completed`);
    return result;
  };
}