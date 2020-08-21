import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormGroup,FormControl,ValidationErrors} from '@angular/forms'
import { ApiconnectionService } from '../apiconnection.service';
// import { ToastrManager } from 'ng6-toastr-notifications';
import { Injectable } from '@angular/core';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private route:Router,private service:ApiconnectionService) { }
  userdetails={}
  naam;emaal;mob;pass;pass1;skill;


  ngOnInit() 
  {}
    form=new FormGroup({
    name:new FormControl(''),
    email:new FormControl(''),
    mobile:new FormControl(''),
    password:new FormControl(''),
    password1:new FormControl(''),
    skills:new FormControl('')
    
  })
  codeverify=new FormGroup({
    code:new FormControl('')
  })

  get name(){
    return this.form.get('name');
  }
  get email(){
    return this.form.get('email');
  }
  get mobile(){
    return this.form.get('mobile');
  }
  get password(){
    return this.form.get('password');
  }
  get password1(){
    return this.form.get('password1');
  }  
  get skills(){
    return this.form.get('skills');
  }
  get code()
  {return this.codeverify.get('code');}

  onSubmit(d1,d2,d3,d4,d5,d6){
this.naam=d1.value;
this.emaal=d2.value;
this.mob=d3.value;
this.pass=d4.value;
this.pass1=d5.value;
this.skill=d6.value;
    console.log(d1.value);
    
this.service.getCode(this.emaal,this.mob).subscribe((res)=>{
  console.log(res);
},(err)=>{if(err.status==403){
  window.alert(err.error.msg)
}}
)
  }

  onCode(code){
    console.log(code.value);
    if(!localStorage.getItem('token')){

      this.service.signup(this.naam,this.emaal,this.mob,this.pass,this.pass1,this.skill,code.value).subscribe((res)=>{
        this.userdetails=res
        localStorage.setItem('token',res['token']);
        localStorage.setItem('name',this.naam);
        localStorage.setItem('email',this.emaal);
        

        console.log(res)
        this.route.navigate(['/'])
        },(err)=>{
          
            if(err.status==403){window.alert(err.error.msg)}
          
        });
    }
   
  }

  tcp()
  {
    this.route.navigate(['/tcp']);
  }

}

