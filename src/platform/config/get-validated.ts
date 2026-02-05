export function getValidated<T extends {
  body?: any;
  query?: any;
  params?: any;
}>(c: any): T {
  return c.get("validated") as T;
}