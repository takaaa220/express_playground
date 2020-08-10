export class TeamDao {
  constructor(
    public id: string,
    public name: string,
    public ownerId: string,
    public createdAt: Date,
    public updatedAt: Date,
    public userIds: string[],
  ) {}
}
