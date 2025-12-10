export type SignTokenFunction = (
  payload: Object,
  duration: string
) => Promise<string | null>;
