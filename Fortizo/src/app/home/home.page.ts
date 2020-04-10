import { Component } from '@angular/core';
import { Sim } from '@ionic-native/sim/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { AlertController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  carrier: string;
  country: string;
  header;
  constructor(private callNumber: CallNumber,private sim: Sim,private qrScanner: QRScanner,public alertController: AlertController,private platform: Platform) {
    this.sim.requestReadPermission().then(
      () => console.log('Permission granted'),
      () => console.log('Permission denied')
    );

    this.sim.getSimInfo().then(
      (info) => {
        this.carrier = info.cards[0].carrierName.toLowerCase();
        this.country = info.countryCode;
        console.log('Sim info: ', info)
    
    },
      (err) => console.log('Unable to get sim info: ', err)
    );

    //back press
    this.platform.backButton.subscribeWithPriority(0, ()=>{
      document.getElementsByTagName("body")[0].style.opacity = '1';
    });


  }

  

  scan(){
    // Optionally request the permission early
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted
          this.qrScanner.show();
          // start scanning\
          document.getElementsByTagName("body")[0].style.opacity = '0';
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            console.log('Scanned something', text);
            this.showAlert(text);
              this.qrScanner.hide(); // hide camera preview
            scanSub.unsubscribe(); // stop scanning
            document.getElementsByTagName("body")[0].style.opacity = '1';

          });

        } else if (status.denied) {
          console.log("denied");
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => console.log('Error is', e));
  }

  async showAlert(text){
    if(isNaN(text)){
      this.header = "No voucher found";
    }else{
     this.header = "Confirm voucher";
    }

    const alert = await this.alertController.create({
      header: this.header,
      message: text,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            if(this.header == "Confirm voucher"){
              console.log('Confirm Okay');
              this.Recharge(text);
            }
          }
        }
      ]
    });

    await alert.present();
  }


  Recharge(text){
    if(this.carrier.includes("cellc")|| this.carrier.includes("cell c")){
      console.log("your carrir is cell c")
      this.callNumber.callNumber("*102*"+text+"#", true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
    }else if(this.carrier.includes("mtn")){
      console.log("your carrir is mtn")
      this.callNumber.callNumber("*141*"+text+"#", true)
    }else if(this.carrier.includes("vodacom")){
      console.log("your carrir is vodacom")
      this.callNumber.callNumber("*100*01*"+text+"#", true);
    }else if(this.carrier.includes("telkom")){
      this.callNumber.callNumber("*188*"+text+"#", true);
    }
    else if(this.carrier.includes("rain")){
      this.showErr("This function is not supported on this network");
    }
  }


  checkBalance(){
    if(this.carrier.includes("cellc")|| this.carrier.includes("cell c")){
      this.callNumber.callNumber("*101#", true);
    }else if(this.carrier.includes("mtn")){
      this.callNumber.callNumber("*141#", true);
    }else if(this.carrier.includes("vodacom")){
      this.callNumber.callNumber("*100#", true);
    }else if(this.carrier.includes("telkom")){
      this.callNumber.callNumber("*188#", true);
    }
    else if(this.carrier.includes("rain")){
      this.showErr("This function is not supported on this network");
    }
  }

  customerCare(){
    if(this.carrier.includes("cellc")|| this.carrier.includes("cell c")){
      this.callNumber.callNumber("084140", true);
    }else if(this.carrier.includes("mtn")){
      this.callNumber.callNumber("083173", true);
    }else if(this.carrier.includes("vodacom")){
      this.callNumber.callNumber("082111", true);
    }else if(this.carrier.includes("telkom")){
      this.callNumber.callNumber("081180", true);
    }
    else if(this.carrier.includes("rain")){
      this.showErr("This function is not supported on this network");
    }
  }


  buyData(){
    if(this.carrier.includes("cellc")|| this.carrier.includes("cell c")){
      this.callNumber.callNumber("*147#", true);
    }else if(this.carrier.includes("mtn")){
      this.callNumber.callNumber("*141*2#", true);
    }else if(this.carrier.includes("vodacom")){
      this.callNumber.callNumber("*111#", true);
    }else if(this.carrier.includes("telkom")){
      this.callNumber.callNumber("*147#", true);
    }
    else if(this.carrier.includes("rain")){
      this.showErr("This function is not supported on this network");
    }
  }



  //show erro
  async showErr(err){
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'error',
      message: err,
      buttons: ['OK']
    });

    await alert.present();
  }

}


