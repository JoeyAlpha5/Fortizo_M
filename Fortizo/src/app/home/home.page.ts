import { Component } from '@angular/core';
import { OCR, OCRSourceType } from '@ionic-native/ocr/ngx';
import { Sim } from '@ionic-native/sim/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  carrier: string;
  country: string;
  constructor(private ocr: OCR,private sim: Sim,private statusBar: StatusBar,private camera: Camera,private qrScanner: QRScanner) {
    this.statusBar.overlaysWebView(false);
    this.statusBar.styleDefault();
    this.statusBar.backgroundColorByHexString('#3C51A3');
    this.sim.requestReadPermission().then(
      () => console.log('Permission granted'),
      () => console.log('Permission denied')
    );

    this.sim.getSimInfo().then(
      (info) => {
        this.carrier = info.carrierName;
        this.country = info.countryCode;
        console.log('Sim info: ', info)
    
    },
      (err) => console.log('Unable to get sim info: ', err)
    );


  }


  scan(){

    // Optionally request the permission early
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted

          this.qrScanner.show();
          // start scanning
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            console.log('Scanned something', text);

            this.qrScanner.hide(); // hide camera preview
            scanSub.unsubscribe(); // stop scanning
          });
          this.qrScanner.show();

        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => console.log('Error is', e));



    // const options: CameraOptions = {
    //   quality: 100,
    //   destinationType: this.camera.DestinationType.FILE_URI,
    //   encodingType: this.camera.EncodingType.JPEG,
    //   mediaType: this.camera.MediaType.PICTURE,
    //   sourceType: this.camera.PictureSourceType.CAMERA,
    //   targetWidth: 100,
    //   targetHeight:100,
    //   // allowEdit: true,
    //   saveToPhotoAlbum:false,
    //   correctOrientation:true,
    // }


    // this.camera.getPicture(options).then((imageData) => {
    //   // imageData is either a base64 encoded string or a file URI
    //   // If it's base64 (DATA_URL):
    //   console.log(imageData)

    //   console.log("got image")
    //   this.recognizeImage(imageData);


    //  }, (err) => {
    //   // Handle error
    //  });
  }

  // recognizeImage(imageData) {
  //   this.ocr.recText(OCRSourceType.NORMFILEURL, imageData)
  //   .then((res) => console.log(JSON.stringify(res)))
  //   .catch((error: any) => console.error(error));


  //   this.sim.getSimInfo().then(
  //     (info) => console.log('Sim info: ', info),
  //     (err) => console.log('Unable to get sim info: ', err)
  //   );
  // }

}


