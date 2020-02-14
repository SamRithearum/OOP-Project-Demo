import { Component } from '@angular/core';
import { MenuController, ModalController } from "@ionic/angular";
import { BaseHome } from '../base-home';
import { AngularFirestore } from "@angular/fire/firestore";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage extends BaseHome {
  orderArray: any = [];
  coffees = [
    "Americano",
    "Cappuccino",
    "Latte",
    "Espresso",
    "Machiato",
    "Mocha",
    "Chocolate",
    "Milk Tea"
  ];
  coffeeOrder = [];
  addCoffee = coffee => this.coffeeOrder.push(coffee);
  removeCoffee = coffee => {
    let index = this.coffeeOrder.indexOf(coffee);
    if (index > -1) this.coffeeOrder.splice(index, 1);
  };

  constructor(
    private menu: MenuController,
    private modCtrl: ModalController,
    private firestore: AngularFirestore
  ) {
    super();
    // this.listOrder();
  }
  ngOnInit() {
    this.listOrder();
  }
  coffeeOrdersList = [];
  listOrder() {
    this.firestore
      .collection("coffeeOrders", ref =>
        ref.limit(5).orderBy("timestamp", "desc")
      )
      .snapshotChanges()
      .subscribe(
        response => {
          this.coffeeOrdersList = response;
        },
        error => {
          console.log(error);
        }
      );
  }

  addNew(waitingNumberInput) {
    let waitingNumberValue = waitingNumberInput.value;
    let orderList = this.coffeeOrder;

    let orderObj = {
      waitingNumber: waitingNumberValue,
      orderList: orderList,
      isDone: false,
      timestamp: Math.floor(Date.now() / 1000)
    };
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection("coffeeOrders")
        .add(orderObj)
        .then(
          res => {
            this.coffeeOrder.length = 0;
            waitingNumberInput.value = "";
          },
          err => reject(err)
        );
    });
  }

  delete(order) {
    console.log(order);
    return this.firestore
      .collection("coffeeOrders")
      .doc(order.payload.doc.id)
      .delete();
  }

  update() {

  }

  setDone(order) {
    this.firestore
      .collection("coffeeOrders")
      .doc(order.payload.doc.id)
      .set({ isDone: !order.payload.doc.data().isDone }, { merge: true });
  }
}
