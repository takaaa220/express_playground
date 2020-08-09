export class CreateTeamForm {
  private _name: string;
  private _ownerName: string;

  constructor(obj: { name?: string; ownerName?: string }) {
    this._name = obj.name ?? "";
    this._ownerName = obj.ownerName ?? "";
  }

  get name() {
    return this._name;
  }

  get ownerName() {
    return this._ownerName;
  }
}
