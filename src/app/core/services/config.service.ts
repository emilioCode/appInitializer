import { Injectable } from '@angular/core';
import { Config } from '../models/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private appConfig!: any; //Config;

  constructor(private http: HttpClient) {}

  loadAppConfig() {
    return this.http
      .get('/assets/data/appConfig.json')
      .toPromise()
      .then((data) => {
        this.appConfig = data as Config;
      });
  }
  loadAppConfigExtend() {
    return this.http
      .get(`/assets/data/appConfig-${environment.envName}.json`)
      .toPromise()
      .then((data) => {
        this.isEqual(this.appConfig, data);
      });
  }
  getConfig(): Config {
    return this.appConfig;
  }
  getServiceURL(...paths: any[]): string {
    let servicesPath = this.appConfig.services;
    for (const index in paths) {
      if (!servicesPath.hasOwnProperty(paths[index])) {
        throw new Error('Not found services path.');
      }
      servicesPath = servicesPath[paths[index]];
    }
    const fullPath = (this.appConfig.api.baseURL + servicesPath).replace(
      '{{version}}',
      this.appConfig.api.version
    );
    return fullPath;
  }
  getURL(...paths: any[]): string {
    let servicesPath = this.appConfig.services;
    for (const index in paths) {
      if (!servicesPath.hasOwnProperty(paths[index])) {
        throw new Error('Not found services path.');
      }
      servicesPath = servicesPath[paths[index]];
    }
    // const fullPath = (this.appConfig.api.baseURLNetCore + servicesPath).replace(
    //   '{{environmentNetCore}}',
    //   this.appConfig.api.environmentNetCore
    // );
    return servicesPath;
  }
  getOptions() {
    const headers: HttpHeaders = new HttpHeaders();
    // .set('Access-Control-Allow-Credentials','true')
    // .set('Access-Control-Allow-Origin', '*')
    // .set('Access-Control-Allow-Headers','*')
    this.appConfig.api.options.forEach(
      (option: { key: string; value: string | string[] }) => {
        headers.set(option.key, option.value);
      }
    );
    const userName = btoa(`${this.getUserName()}:1111`);
    headers.set('Authorization', `Basic ${userName}`);
    return { headers: headers };
  }
  getUserName(): string {
    return sessionStorage.getItem('userName') || this.appConfig.userNameMock;
  }
  compare(item1: any, item2: any, key?: string) {
    // Get the object type
    const itemType = Object.prototype.toString.call(item1);
    // If an object or array, compare recursively
    if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
      if (!this.isEqual(item1, item2, key)) {
        return false;
      }
    } else {
      // Otherwise, do a simple comparison
      // If the two items are not the same type, return false
      if (itemType !== Object.prototype.toString.call(item2)) {
        return false;
      }
      // Else if it's a function, convert to a string and compare
      // Otherwise, just compare
      if (itemType === '[object Function]') {
        if (item1.toString() !== item2.toString()) {
          return false;
        }
      }
      return true;
    }
    return;
  }
  isEqual(value: any, other: any, keyRef?: any) {
    // Get the value type
    const type = Object.prototype.toString.call(value);
    // If the two objects are not the same type, return false
    if (type !== Object.prototype.toString.call(other)) {
      return false;
    }
    // If items are not an object or array, return false
    if (['[object Array]', '[object Object]'].indexOf(type) < 0) {
      return false;
    }
    // Compare properties
    for (const key in other) {
      if (value.hasOwnProperty(key)) {
        if (['[object Array]'].indexOf(type) < 0) {
          this.appConfig[key] = other[key] ? other[key] : this.appConfig[key];
        } else if (this.compare(value[key], other[key], key) === false) {
          if (keyRef) {
            this.appConfig[keyRef][key] = other[key];
          } else {
            this.appConfig[key] = other[key] ? other[key] : this.appConfig[key];
          }
        }
      } else {
        this.appConfig[key] = other[key] ? other[key] : this.appConfig[key];
      }
    }
    return true;
  }
}
