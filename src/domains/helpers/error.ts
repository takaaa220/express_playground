type Code = "InvalidArgument";

export class DomainError extends Error {
  code?: Code;

  constructor(message: string, code?: Code) {
    super(message);

    this.code = code;
    this.name = "DomainError";
  }
}
