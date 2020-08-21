import { Injectable } from '@angular/core';
import {HttpClient, HttpParams } from '@angular/common/http';
import { tap, startWith, debounceTime, switchMap, map } from 'rxjs/operators';
import * as io from 'socket.io-client'
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiconnectionService {

public socket=io('http://localhost:3000')

  constructor(private http:HttpClient) { }
  
x; mesg=[];
  signup(d1,d2,d3,d4,d5,d6,d7){    return this.http.post('http://localhost:3000/signup',{'name':d1,'email':d2,'mobile':d3,'password':d4,'password1':d5,'skills':d6,'code':d7}); }
  login(d1,d2){    return this.http.post('http://localhost:3000/login',{'email':d1,'password':d2});  }
  saveToken(d)  {   return localStorage.setItem('token',d);  }
  getToken()  {    return localStorage.getItem('token');  }
  userprofile(d){    return this.http.post('http://localhost:3000/userprofile',{'token':d})  }
  question(d1,d2,d3,d4,d5,d6){return this.http.post("http://localhost:3000/askquestion",{'title':d1,'technology':d2,'question':d3,'date':d4,'name':d5,'counter':d6}); }
fetchQuestion(d1){  return this.http.post("http://localhost:3000/getquestion",{'email':d1});}
fetchUsers(d){  return this.http.post("http://localhost:3000/allusers",{'email':d});}
opts = [];
getData() {  return   this.http.get<any>("http://localhost:3000/allquestion").pipe(tap(data => this.opts = data))}
updatelike(a,b,c,d,e,f){  return this.http.post("http://localhost:3000/update",{'counter':a,'name':b,'title':c,'technology':d,'question':e,'id':f})}
minuslike(a,b,c,d,e,f){  return this.http.post("http://localhost:3000/minuslike",{'counter':a,'name':b,'title':c,'technology':d,'question':e,'id':f})}



newBlog(blog){return this.http.post("http://localhost:3000/newBlog",blog);}
getAllBlogs(){  return this.http.get("http://localhost:3000/allBlogs");}
likeBlog(id){        let userid=localStorage.getItem('userid')
 return this.http.post("http://localhost:3000/likeblog",{'blogid':id,'id':userid})
}
dislikeBlog(id){  let userid=localStorage.getItem('userid')
  return this.http.post("http://localhost:3000/dislikeblog",{'blogid':id,'id':userid})
}
deleteBlog(id){  let email=localStorage.getItem('name')
  return this.http.post("http://localhost:3000/deleteblog",{'blogid':id,'name':email})
}
postComment(id,comment){  
  let userid=localStorage.getItem('userid')
  return this.http.post("http://localhost:3000/commentblog",{'blogid':id,'id':userid,'comment':comment})
}





reselItem(d1,d2,d3,d4,d5,d6,d7,d8)
{
  return this.http.post("http://localhost:3000/sellData",{'title':d1,'price':d2,"category":d3,'pehchan':d4,"plusminus":d5,"imageUrl":d6,"ext":d7,"name":d8})
}
fetchresel(d2)
{
  // let params:HttpParams=new HttpParams().set("pehchan",localStorage.getItem('email'));
    return this.http.post("http://localhost:3000/showReselData",{"pehchan":d2});
}
getImage(d1,d2)
{
  return this.http.post("http://localhost:3000/img",{"imageName":d1,"ext":d2});
}






newQuestion(blog){return this.http.post("http://localhost:3000/newQuestion",blog);}
getAllQuestions(){  return this.http.get("http://localhost:3000/questions");}

likeQuestion(id){        let userid=localStorage.getItem('userid')
 return this.http.post("http://localhost:3000/likeQuest",{'blogid':id,'id':userid})
}
dislikeQuestion(id){  let userid=localStorage.getItem('userid')
  return this.http.post("http://localhost:3000/dislQuestion",{'blogid':id,'id':userid})
}

deleteQuest(id){  let email=localStorage.getItem('name')
  return this.http.post("http://localhost:3000/delQuest",{'blogid':id,'name':email})
}
postCommentQuestion(id,comment){  
  let userid=localStorage.getItem('userid')
  return this.http.post("http://localhost:3000/commentQuestion",{'blogid':id,'id':userid,'comment':comment})
}
getCode(email, mob)
{
  return this.http.post("http://localhost:3000/code",{'email':email,'mob':mob});
}

 

joinRoom( user,room){
  console.log('onside the service')
  
  this.socket.emit('new_joinee',{
    name:user,
    room:room
  })
}
serverJoinRoom(){
  return new  Observable ((observer)=>{
this.socket.on('server_new_joinee',(data)=>{

     observer.next(data);
})
  });
}
serverNewMessage(){
  return this.socket.on('server_new_message',(data)=>{

     console.log(data);
     this.mesg.push=data;

     for(var x=0;x<data.length;x++)
     {
       console.log(data[x].name + " : ");
      //  console.log("hi");
     }
})


}
sendMessageClient(user,msg,room)
{ 
  console.log('inside the service',{
    name:user,
    msg:msg,
    room:room
  })
  this.socket.emit('client_new_msg',{
    name:user,
    msg:msg,
    room:room,
    email:localStorage.getItem("email")
    
  })

  
}

// msg()
// {
//   this.socket.on('output',(data)=>{
//     console.log(data);
//   })
// }
chat()
{
  return this.http.get("http://localhost:3000/chat");

}
}