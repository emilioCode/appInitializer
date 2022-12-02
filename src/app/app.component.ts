import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ConfigService } from './core/services/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'appInitializer';

  enviroment: string = environment.envName.toUpperCase();
  json: string = '';
  constructor(private appConfigService: ConfigService) {
    const epvs = this.appConfigService.getConfig();
    console.log(epvs);
    this.json = JSON.stringify(epvs);
  }

  JSONMethod(carInfo: any) {
    debugger;
    let myJSON = JSON.stringify(carInfo);
    // localStorage.setItem("theJSON", myJSON);

    // text = localStorage.getItem("theJSON");
    let text = myJSON;
    let obj = JSON.parse(text);

    for (var i = 0; i < obj.length; i++) {
      var para = document.createElement('li');
      var node = document.createTextNode(obj[i]);
      para.appendChild(node);
      var element: any = document.getElementById('display');
      element.appendChild(myJSON);
    }
  }
}
