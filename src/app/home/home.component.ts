import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { FireService } from '../services/fire.service';
import { NgxSpinnerService } from 'ngx-spinner';

interface Car {
  make: string;
  maxSpeed: number;
  engineSize: string;
  createdDate: Date;
}
const CAR: Car[] = [];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  carList = CAR;
  carForm: FormGroup;
  isSubmitted  =  false;
  id:any;
  selectedCar:any;
  updateCar: boolean = false;
  constructor(private modalService: NgbModal,
     private formBuilder: FormBuilder,
     private fireService: FireService,
     private spinner: NgxSpinnerService,
     ) { }

  ngOnInit(): void {
    this.getAllCarsList();
    this.carForm  =  this.formBuilder.group({
      make: ['', Validators.required],
      maxSpeed: ['', Validators.required],
      engineSize: ['', Validators.required]
    });
  }

  get formControls() { return this.carForm.controls; }

  open(content, name, car?) {
    this.isSubmitted = false;
    this.id = car?.id;
    if(name = 'add-new-car' && car != undefined) {
      this.selectedCar = car;
      this.updateCar = true;
      this.carForm.setValue({
        make:this.selectedCar.make,
        maxSpeed:this.selectedCar.maxSpeed,
        engineSize:this.selectedCar.engineSize
     });
    } else {
      this.updateCar = false;
    }
    this.modalService.open(content, {ariaLabelledBy: name}).result.then((result) => {
      console.log(result)
    }, (reason) => {
      console.log(reason);
      
    });
  }

  close(){
    this.carForm.reset();
    this.modalService.dismissAll();
  }

  getAllCarsList(){
    this.spinner.show();
    this.fireService.getAllCars().then((res: any) => {
       console.log(res);
       this.spinner.hide();
       this.carList = res;
     }, (err) => {
       console.log(err);
       this.spinner.hide();
       alert(err.message);
     });
  }
  addNewCar(){
    this.isSubmitted = true;
    if(this.carForm.invalid){
      return;
    }
    let params = {
      "make":this.carForm.value.make,
      "maxSpeed":this.carForm.value.maxSpeed,
      "engineSize":this.carForm.value.engineSize,
      "createdDate":new Date().getTime(),
    }
    let id = this.fireService.makeid(10);
    this.fireService.newCar(id, params).then((res: any) => {
     alert('New car added successfully!');
     this.modalService.dismissAll();
      console.log(res);
      this.carForm.reset();
      this.getAllCarsList();
    }, (err) => {
      console.log(err);
      alert(err.message);
    });
  }

  deleteCar(){
    this.fireService.deleteCar(this.id).then((res: any) => {
      alert('Car deleted successfully!');
      this.modalService.dismissAll();
       console.log(res);
       this.carForm.reset();
       this.getAllCarsList();
     }, (err) => {
       console.log(err);
       alert(err.message);
     });
  }

  updateCarDetails() {

   let params = {
    "make":this.carForm.value.make,
    "maxSpeed":this.carForm.value.maxSpeed,
    "engineSize":this.carForm.value.engineSize,
    "createdDate":new Date().getTime(),
   }

   this.fireService.updateCar(this.id, params).then((res: any) => {
    alert('car details updated successfully!');
    this.modalService.dismissAll();
     console.log(res);
     this.getAllCarsList();
   }, (err) => {
     console.log(err);
     alert(err.message);
   });

  }
  

}
