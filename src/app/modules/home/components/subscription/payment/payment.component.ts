import {
  StripeService,
  StripeCardComponent,
  StripePaymentElementComponent,
} from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions,
} from '@stripe/stripe-js';

import { NgxUiLoaderService } from 'ngx-ui-loader';


import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';
import { resetFakeAsyncZone } from '@angular/core/testing';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit, OnChanges {
  @ViewChild(StripeCardComponent) paymentElement: StripeCardComponent;

  @Input() data = null;
  @Input() payment = false;
  @Output() closePayment = new EventEmitter();

 stripeTest : any ;

  createForm(){
    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  elementsOptions: StripeElementsOptions = {
    locale: 'en',
  };

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        // fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        // minHeight: '50px',
        fontSize: '14px',
        lineHeight: '2.6rem',
        '::placeholder': {
          color: '#CFD7E0',
          fontWeight: '300',
        },
      },
    },
  };

  paying = false;

  newData = null;

  constructor(
    private fb: FormBuilder,
    private stripeService: StripeService,
    private userService: UserService,
    private toastr: ToastrService,
    private spinner: NgxUiLoaderService


  ) {}

  ngOnInit() {
    this.createForm()
  }

  ngOnChanges(changes: SimpleChanges): void {
      if (changes['data'].currentValue) {
        console.log(changes['data'].currentValue, 'Ddata');
        this.newData = changes['data'].currentValue;
      }
  }

  asdf = '';

  createToken(): void {
    this.spinner.start();
    const name = this.stripeTest.get('name').value;
    this.stripeService
      .createToken(this.paymentElement.element, { name })
      .subscribe((result) => {
        if (result.token) {
          // Use the token
          console.log(result.token.id);
          this.pay(result.token.id);
        } else if (result.error) {
          // Error creating the token
          console.log(result.error.message);
        }
      });
  }

  
  pay(token): void {
    const body = {
      ...this.newData,
      customerTOken: token,
      name: this.stripeTest.value.name,
      stripeEmail: this.stripeTest.value.email,
    };
    this.userService.paymentApi(body).subscribe((result) => {
      console.log(result);

      if(result.status == "succeeded"){
        this.spinner.stop();
        this.toastr.message('Payment Success!!!', true);
        this.stripeTest.reset();
      }
      else{
        this.spinner.stop();
        this.toastr.message('Something wrong!!!', false);
      }
    });

    console.log(body);
  }

  hidePayment() {
    this.closePayment.emit();
    this.payment = false;
  }
}
