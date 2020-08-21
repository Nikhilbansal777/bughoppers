import { Component, OnInit } from '@angular/core';
import {FormGroup,FormControl,ValidationErrors} from '@angular/forms'
import{Router} from '@angular/router'
import {ApiconnectionService} from '../apiconnection.service'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private route:Router,private service:ApiconnectionService) { }

  ngOnInit() {
  }
  form=new FormGroup({
    email:new FormControl(''),
    password:new FormControl('')
  })
  get email(){
    return this.form.get('email');
  }
  
  get password(){
    return this.form.get('password');
  }
  OnSubmit(d1,d2){
    // console.log(d1.value);
    this.service.login(d1.value,d2.value).subscribe((res)=>{
      console.log(res);
      if(res['token']){
        this.service.saveToken(res['token'])
        localStorage.setItem('email',d1.value);
        
        this.route.navigate(['/landingpage'])
      }
      // this.service.saveToken(res['token']);
      // console.log(res['token']);
    },(err)=>{
      console.log(err);
      if(err.status==401){
        window.alert("invalid password");
      }else if(err.status==406){
        window.alert("unauthorised acces")
      }
    })
  }
  signuprouting(){
    this.route.navigate(['/signup'])
  }

}
