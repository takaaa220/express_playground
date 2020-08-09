export class PresentationError extends Error {
  constructor(message: string) {
    super(message);

    this.name = "PresentationError";
  }
}
