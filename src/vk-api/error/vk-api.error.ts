export class VkApiError extends Error {
  constructor(
    message: string,
    public code: number,
    public params: Array<{ key: string; value: string }>,
  ) {
    super(message)
  }
}
