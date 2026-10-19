export class HttpError extends Error {
  /**
   * @param {number} status HTTP status code
   * @param {string} message Human-readable message, safe to show to users
   * @param {{ code?: string, details?: Record<string, string>, meta?: object }} [options]
   */
  constructor(status, message, { code, details, meta } = {}) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.code = code;
    this.details = details;
    this.meta = meta;
  }
}
