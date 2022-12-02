export interface Config {
  api: {
    baseURL: string;
    options: any;
    timeout: number;
    version: string;
  };
  services: any;
  userNameMock: string;
}
