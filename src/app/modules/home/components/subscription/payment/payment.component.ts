import {
  StripeService,
  StripeCardComponent,
  StripePaymentElementComponent,
} from 'ngx-stripe';
import {
  StripeCardElementChangeEvent,
  StripeCardElementOptions,
  StripeElementsOptions,
} from '@stripe/stripe-js';

import { NgxUiLoaderService } from 'ngx-ui-loader';


import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';
import { resetFakeAsyncZone } from '@angular/core/testing';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { SubscriptionService } from 'src/app/services/subscription.service';


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
 enablePayment=false;
  createForm(){
    this.stripeTest = this.fb.group({
      name: ['', [Validators.required,Validators.pattern('^[a-zA-Z ]*$'),Validators.maxLength(32)]],
      email: ['', [Validators.required,  Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
    });
    this.stripeTest.valueChanges.subscribe(()=>{
      this.formErrors = valueChanges(
        this.stripeTest,
        { ...this.formErrors },
        this.formErrorMessages
      );
    })
  }
  onChange(event: StripeCardElementChangeEvent) {
    const displayError = document.getElementById('card-errors');
    //console.log(event);
    
    if (event.empty) {
      displayError.textContent = "Card details are required ";
      displayError.textContent = "Card details are required ";
      this.enablePayment=false;
      return;
    }
    if (event.error) {
      displayError.textContent = event.error.message;

    } else {
      displayError.textContent = '';
      this.enablePayment=true;
    }
  }
  formErrors = {
    name: '',
    email: '',
  };

  formErrorMessages = {
    name: {
      required: 'Name is required.',
      pattern: 'Invalid Name',
      maxlength: 'Word limit Exceed..',
    },
    email: {
      required: 'Email is required.',
      pattern:
      'Please enter valid email address. For example johndoe@domain.com ',
    },

  };
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
    private subscription: SubscriptionService,
    private toastr: ToastrService,
    private spinner: NgxUiLoaderService


  ) {}



  ngOnChanges(changes: SimpleChanges): void {
      if (changes['data'].currentValue) {
        //console.log(changes['data'].currentValue, 'Ddata');
        this.newData = changes['data'].currentValue;
      }
  }

  asdf = '';
  createToken(): void {
    if (this.stripeTest.invalid) {
      this.stripeTest.markAllAsTouched();
      this.formErrors = valueChanges(
        this.stripeTest,
        { ...this.formErrors },
        this.formErrorMessages
      );

      //console.log('invalid');
      return;
      }
    this.spinner.start();
    const name = this.stripeTest.get('name').value;
    this.stripeService
      .createToken(this.paymentElement.element, { name })
      .subscribe((result) => {
        if (result.token) {
          // Use the token
          console.log(result);
          this.pay(result.token.id);
        } else if (result.error) {
          // Error creating the token
          this.spinner.stop();
          this.toastr.message(result.error.message, false);
          document.getElementById('card-errors').textContent=result.error.message;
          //console.log(result.error.message);
        }
      });
  }

  
  pay(token): void {
    const body = {
      ...this.newData,
      customerTOken: token,
      name: this.stripeTest.value.name,
      stripeEmail: this.stripeTest.value.email,
      // priceId: this.stripeTest.value.email,
      // priceId : "price_1Kj18mJrEVeMChFE8FQtb5bm"
      // priceId : "price_1KjO1cJrEVeMChFEiW4aBXDE"

      // "stripeEmail": "ali@gmail.com",
      // "name": "ALia Bhatt Dhariwala",
      // "customerTOken" : "tok_1KjMmyJrEVeMChFEj2kX6p1g",
      // "priceId" : "price_1Kj18mJrEVeMChFE8FQtb5bm"
    };
    this.subscription.paymentApi(body).subscribe((result) => {
      console.log(result);

      if(result.success){
        this.spinner.stop();
        this.toastr.message('Payment Success!!!', true);
        this.stripeTest.reset();
        this.closePayment.emit();
        this.payment = false;
        this.subscription.subscriptionActive.next(result?.data?.isActive);
        this.subscription.canceledSubscription.next(false);
        const {subscriptionStartDate=new Date(),subscriptionEndDate=new Date(),amount=0,isActive=false,_id,isCancelled,priceId=''} = result?.data;
        this.subscription.subscriptionDetails.next({
         subscriptionStartDate,
        subscriptionEndDate,
        amount,
        priceId,
        isActive,
        _id,
        isCancelled,
        });

      }
      else{
        this.spinner.stop();
        this.toastr.message('Something wrong!!!', false);
      }
    });

    //console.log(body);
  }

  hidePayment() {
    this.closePayment.emit();
    this.payment = false;
  }
  ngOnInit() {
    this.createForm()

  }
}
