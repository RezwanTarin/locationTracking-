import { Component } from '@angular/core';
import { Geolocation,Geoposition } from '@ionic-native/geolocation/ngx';
//import { Plugins } from 'protractor/built/plugins';
import { KeyboardStyle, Plugins } from "@capacitor/core";

const {Stroage} = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  position: [number,number] = [0,0];
  locations: Location[];
  lat:number;
  lng:number;
  constructor(private geolocation: Geolocation) {
    this.geolocation.getCurrentPosition({
      timeout:1000,enableHighAccuracy:true, maximumAge:3600
    })
    .then((resp)=>{
      this.position[0] = resp.coords.latitude;
      this.position[1] = resp.coords.longitude;
    });

    let positionWatch = this.geolocation.watchPosition({
      timeout:1000,enableHighAccuracy:true, maximumAge:3600
    });
    positionWatch.subscribe(
      (data:Geoposition) =>{
        this.position[0] = data.coords.latitude;
      this.position[1] = data.coords.longitude;
      },
      (error:any)=>{
        console.log("POSITION",error);
      }
    );
    this.readLocation();
  }
  SaveLocation(){
    const location = new Location();
    this.setLocation(JSON.stringify(this.position),location)

  }
  async setLocation(key:string, value:any){
    await Stroage.set(
      {
        key: key,
        value: JSON.stringify(value)
      }
    );
    this.readLocation();

  }
  async readLocation(){
    this.locations = [];
    const { keys } = await Stroage.keys();
    keys.forEach(this.getLocation,this);
  }
  async getLocation(key){
    const item = await Stroage.get({key:key});
    let location = JSON.parse(item.value);
    this.locations.push(location);

  }
  async clear(){
    await Stroage.clear();
    this.locations = [];
  }
/*
  async deleteLocation(index){
    let user = this.locations[index];
    await Storage.remove({key:JSON.stringify(this.position)});
    this.readLocation();
  }
*/


}

