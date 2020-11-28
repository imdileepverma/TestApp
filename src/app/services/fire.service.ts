import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import * as firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class FireService {

  db = firebase.firestore();

  constructor(
    private fireAuth: AngularFireAuth,
    private adb: AngularFirestore,
    private http: HttpClient
  ) { }

  public login(email: string, password: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.fireAuth.auth.signInWithEmailAndPassword(email, password)
        .then(res => {
          console.log(res)
          resolve(res);
        })
        .catch(err => {
          console.log(err);
          reject(err)
        });
    });
  }

  public register(fullname: string, email: string, password: string ): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.fireAuth.auth.createUserWithEmailAndPassword(email, password)
        .then(res => {
          if (res.user) {
            this.db.collection('users').doc(res.user.uid).set({
              uid: res.user.uid,
              email: email,
              fullname: fullname,
            });
          }
          resolve(res);
        })
        .catch(err => {
          console.log(err)
          reject(err)
        });
    });
  }

  public newCar(id, param): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.adb.collection('fruit').doc(id).set(param).then((data) => {
        resolve(data);
      }, error => {
        reject(error);
      }).catch(error => {
        reject(error);
      });
    });
  }

  public getAllCars(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.adb.collection('fruit').get().subscribe((data: any) => {
        var cars = data.docs.map(doc => {
          var item = doc.data();
          item.id = doc.id;
          return item;
        });
        resolve(cars);
      }, error => {
        reject(error);
      });
    });
  }

  public updateCar(id, param): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      this.adb.collection('fruit').doc(id).update(param).then(async (order: any) => {
        resolve(order);
      }).catch(error => {
        reject(error);
      });
    });
  }

  public deleteCar(id): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.adb.collection('fruit').doc(id).delete().then((data) => {
        resolve(data);
      }, error => {
        reject(error);
      }).catch(error => {
        reject(error);
      });
    });
  }

  makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

}
