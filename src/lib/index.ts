export class Store {
  base_url: string;

  constructor(base_url: string) {
    this.base_url = base_url;
  }

  greet() {
    return "Store base url is " + this.base_url;
  }
}
