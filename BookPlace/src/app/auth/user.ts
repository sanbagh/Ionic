export class User {
  constructor(
    public id: string,
    public email: string,
    private token: string,
    private tokenExpDate: Date
  ) {}
  get userToken() {
    if (!this.tokenExpDate || this.tokenExpDate <= new Date()) {
      return null;
    }
    return this.token;
  }
  get tokenDuration() {
    if (!this.userToken) {
      return 0;
    }
    return this.tokenExpDate.getTime() - new Date().getTime();
  }
}
