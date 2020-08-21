const express=require('express');
const mongoose=require('mongoose');
const fs=require('fs');
const sgMail=require('@sendgrid/mail');
const app=express();
// .then(()=>console.log('connected')).catch(err=>console.error("could not connected",err));
const _=require('lodash');
var bodyParser=require('body-parser');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const path =require('path');
const multer=require('multer')



const webpush=require('web-push');
var http=require('http');
const { Socket } = require('dgram');
var server=http.createServer(app);
var io=require('socket.io').listen(server);
mongoose.connect("mongodb://localhost/bughoperdb",(err,db)=>{
    if(err) {console.log(err)}
    console.log('mongodb connected');
io.on('connection',(socket)=>{
    let chat =db.collection('chats');

    chat.find().limit(100).sort({_id:1}).toArray(function(err,res){
if(err){console.log(err)}
console.log(res);
console.log("hi ")
socket.emit('server_new_message',res);
    });
    
    socket.on('input',(data)=>{
        let name=data;
        let message=data.message;
            chat.insert({name:name,message:message},()=>{
                io.emit('output',[data]);
            })
    });
    socket.on('clear',(data)=>{
        chat.remove({},()=>{
            socket.emit('cleared')
        })
    } )
});
});


const storage = multer.diskStorage(
    {
        destination:(req,file,callBack)=>{
            callBack(null,'uploads')
        },
        filename:(req,file,callBack)=>{
            callBack(null,`FunOfHeuristic_${file.originalname}`)
        }

    })
var uplaod=multer({storage:storage})

app.post('/file',uplaod.single('file'),(req,res,next)=>{
    const file=req.file
    console.log(file.filename);
    if(!file)
    {
        const error=new error("No file")
        error.httpStatusCode=400
        return next(error)
    }
res.send(file)
})

accountsid='AC779a93a3614069471a87fbb012f74a39';
serviceid='VA8e2ab471ca6e7ebb7678ab0db2cdb17b';
authtoken='144726e04947fbc6fa6225bab7f698b4';
var client=require('twilio')(accountsid,authtoken)

const signupSchema=mongoose.Schema
({
    name:     { type:String, require:true },
    email:    { type:String,require:true,unique:true},
    mobile:   { type:String,require:true,unique:true,minLength:10},
    password: { type:String,require:true,minLength:6},
    password1:{ type:String, require:true, minLength:6},
    token:    { type:String},
    skills:   { type:String},
    code:     { type:String}
})
const sign=mongoose.model('signup',signupSchema);
// submitting the question schema
const askquestionSchema=mongoose.Schema
({
      title:     {type:String,require:true,},
      technology:{type:String,require:true,}, 
      question:  {type:String,require:true,},
      date:      {type:String,require:true},
      name:      {type:String,require:true},
      counter:   {type:Number}
});
const askQuestion=mongoose.model('question',askquestionSchema);
// submitting the blog schema
const blogSchema=mongoose.Schema
({
    title:     { type: String, required: true},
    body:      { type: String, required: true},
    createdBy: { type: String },
    createdAt: { type: Date, default: Date.now() },
    likes:     { type: Number, default: 0 },
    likedBy:   { type: Array },
    dislikes:  { type: Number, default: 0 },
    dislikedBy:{ type: Array },
    comments: [{ comment: { type: String,  },commentator: { type: String } }]
})
const blog=mongoose.model('Blog',blogSchema)
// submitting the question schema
const questionSchema=mongoose.Schema
({
    title:     { type: String, required: true},
    body:      { type: String, required: true},
    createdBy: { type: String },
    createdAt: { type: Date, default: Date.now() },
    likes:     { type: Number, default: 0 },
    likedBy:   { type: Array },
    dislikes:  { type: Number, default: 0 },
    dislikedBy:{ type: Array },
    comments:  [{comment: { type: String,  },commentator: { type: String } }]
})
const quest=mongoose.model('Quest',questionSchema)
// trial like
const reselSchema=new mongoose.Schema({
    title:    { type:String,require:true},
    price:    { type:Number, require:true},
    category: { type:String,require:true},
    pehchan:  { type:String,require:true,},
    plusminus:{ type:Number },
    imageName:{ type:String, require:true},
    ext :     { type:String, require:true}
})
const resell=mongoose.model("resell",reselSchema);
// chat schema
const chatSchema=new mongoose.Schema({
    name:{type:String,require:true},
    message:{type:String,require:true},
    date:{type:Date,require:true}
})
const chat=mongoose.model('chats',chatSchema);

app.use(function(req,res,next){
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Methods","PUT","GET","POST","DELETE","OPTIONS");
    res.setHeader('Access-Control-Allow-Headers',"Origin,x-auth,X-Requested-With,Content-Type,Accept");
    res.setHeader("Access-Control-Expose-Headers","x-auth");
    next();
});

app.use(bodyParser.json({limit: '50mb'}));

const publicKey="BID9FFtKjjmQtge-NSmMyWjim7lfyldDygCqcFjCOTwnrHW5VPNhl8C3zcCrgb_fPbJuF43QohR0Mek8BObTDt4";
const privateKey="gv9qCogt1JhMGXH5gJLRX2TORf1QFYs_01W3Gqz1hP0"     
// webpush.setVapidDetails('mailto:test@test.com',publicVapidKey,privateVapidKey);
// app.post('/subscribe',(req,res)=>{
// const subscription=req.body
// res.status(201).json({});
// const payload=JSON.stringify({title:'Push Test'});
// webpush.sendNotification(subscription,payload).catch(err=> console.error);
// });
const sendgridApiKey='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';
sgMail.setApiKey(sendgridApiKey)


io.on('connection',(socket)=>{   //this is used to make the connection inside this all the client requests are handled like a person joined chat sent msg  
    console.log("socket opened");
// chat.find().then(function(req,res){
//     console.log(res);
//     console.log("hey there");
// })
socket.on('client_new_msg',(data)=>{   //these are the eventlisten at server side when client server send the socket request 
    console.log('new msg',data);   // when user want to join the chat this mini api will fire same more queries for msg and send reply to all the users or particular user
    // socket.in(data.room).broadcast
    // .emit('server_new_message',{
    //     msg:data.msg,
    //     user:data.name, 
    //     date:new Date() , 
    // }) 
    const chatt=new chat({
        name:data.name,
        message:data.msg,
        date:new Date(),
        email:data.email
    })
    chatt.save();
 app.post('/data',(req,res)=>{
 // console.log(chats);
 chat.find().then((res)=>{
     console.log(res);
     console.log("hey there")
 })
 socket.in(data.room).broadcast
 .emit('server_new_message',{
     msg:data.msg,
     user:data.name, 
     date:new Date() , 
 }) 
 })
   
    // let chats=chat.find({}).sort({date:-1}).limit(100);
    // console.log(chats);
// console.log(data.msg);
// console.log(data.name);

})

socket.on('new_joinee',(data)=>{
    socket.join(data.room);
    socket.in(data.room).broadcast
    .emit('server_new_joinee',{
        msg:data.name+ " successfully joined room "+data.room,
        user:data.name,
        date:new Date()
    })
  })

})


app.post('/code',(req,res)=>{
    sign.findOne({email:req.body.email}).then((result)=>{
        if(!result){
        sign.findOne({mobile:req.body.mob}).then((result)=>{
        if(!result){
            console.log(req.body.mob);
            client
            .verify
            .services(serviceid)
            .verifications
            .create({
                to:req.body.mob,
                channel:'sms'
                 }).then((data)=>{
                 req.status(200).send(data) })
                 }
        else{res.status(403).send({"msg":"mobile already exist"})}
        })
}else { res.status(403).send({"msg":"email already exist"})}
})
})
app.post('/signup',(req,res)=>{
           bcrypt.genSalt(10,(err,salt)=>{
           bcrypt.hash(req.body.password,salt,(err,hash)=>{
           client
           .verify
           .services(serviceid)
           .verificationChecks
           .create({
           to:req.body.mobile,
           code:req.body.code                
           }).then((data)=>{
            console.log(data);
            if(data.status=='approved'){
                    sgMail.send({
                    to:req.body.email,
                    from:'nikhil.saroj.bansal@gmail.com',
                    subject:'Welcome to the Bughopperrs',
                    text:`welcome to buhoppers ${req.body.name} ,we hope you are doing great. aur bta ghar pe aaja pasta banwa de `,
                    html:'<a href="http://www.sendgrid.com">SendGrid.com</a>'
                             })
                    var user=new sign
                    ({
                    name:req.body.name,
                    email:req.body.email,
                    mobile:req.body.mobile,
                    password:hash,
                    password1:req.body.password1,
                    token:req.body.token,
                    skills:req.body.skills
                     });
                user.save().then((result)=>
                { 
                    let token=jwt.sign({sub:result._id.toHexString()},'secretKey').toString();
                    console.log(token);
                    result.token=token;
                    result.save().then((ress)=>{
                    res.status(200).header('x-auth',token).send({'token':token})
                    }).catch((err)=>{ res.send(err);});
                    }).catch((err)=>{   res.send(err);   });
                 }
        }).catch((err)=>{res.status(403).send({'msg':'chutiye sahi code daal na dikhta nhi h ya type krna nahi aata behen ke lode'})  })

})
})
})     
app.post('/login',(req,res)=>{
    sign.findOne({email:req.body.email},(err,user)=>{
    if(err){console.log(err)}
    else{
        if(!user){  res.status(406).send('invalid email');}
        else{
            return bcrypt.compare(req.body.password,user.password,(err,resu)=>{
            console.log(resu);
            if(err){ res.status(403).send(err);}
            else 
            if(!resu){ res.status(401).send('invalid password'); }
            else{
                let token=jwt.sign({sub:user._id.toHexString()},'secretKey').toString();
                console.log(token);
                user.token=token
                user.save().then((ree)=>{
                res.status(200).header('x-auth',token).send({'token':token});
                }).catch((err)=>{res.send(err);})
                }
})
}}
})
});    
app.post('/userprofile',(req,res)=>{
    sign.findOne({token:req.body.token},(err,result)=>{
    if(err){console.log(err);}
    else{ res.send(result); }
});
});
app.post('/askquestion',(req,res)=>{
    var question=new askQuestion(req.body);
    question.save().then((result)=>{
    res.send(result);
    }).catch((err)=>{ res.send(err); });
});
app.post('/getquestion',(req,res)=>{
    askQuestion.find().then((result)=>{
    res.status(200).send(result);
});
});
app.get('/allquestion',(req,res)=>{
    askQuestion.find().then((result)=>{
    res.status(200).send(result);
})
})
app.post('/allusers',(req,res)=>{
    sign.find().then((result)=>{
    res.status(200).send(result);
    }).catch((err)=>{console.log(err)});
});
app.post('/update',(req,res)=>{
   askQuestion.find({_id:req.body.id}).then(result=>{
   for (var i=0;i<result.length;i++)
    {   
     console.log(result[i]);
     result[i].counter=req.body.counter;
     result[i].save().then(ress=>{res.send(resu)}).catch(err=>{res.send(err)});
    }
})
})
app.post('/minuslike',(req,res)=>{
    askQuestion.find({_id:req.body.id}).then(result=>{
    console.log(req.body)
    for (var i=0;i<result.length;i++)
   {
     console.log(result[i]);
     result[i].counter=req.body.counter;
     result[i].save().then(ress=>{res.send(resu)}).catch(err=>{res.send(err)});
   }
})   
})
// for question
app.post('/newQuestion', (req, res) => {
    const questions = new quest(req.body);
    console.log(req.body);
    questions.save().then((result)=>{res.send(result)}).catch(err=>res.send(err))

});
app.get('/questions', (req, res) => {
    quest.find().then(result=>{
        console.log(result);
        res.send(result)}).catch((err=>{res.send(err) 
        console.log(err)}));
});
app.post('/likeQuest',(req,res)=>{
        quest.findOne({_id:req.body.blogid}).then((result)=>{
        console.log(req.body.blogid);
        sign.findOne({_id:req.body.id}).then((user)=>{
        console.log(req.body.id);
        if(user.name ==result.createdBy){res.send({'msg':'you cant like your own post'})}
        else {
            if(result.likedBy.includes(user.name))  { res.send({"msg":"you alreasy liked the post"}) }
            else{
                if(result.dislikedBy.includes(user.name))
                 {  result.dislikes--;
                    const arrayIndex=result.dislikedBy.indexOf(user.name);
                    result.dislikedBy.splice(arrayIndex,1);
                    result.likes++;
                    result.likedBy.push(user.name);
                    result.save().then((result)=>{res.send(result)}).catch(err=>{res.send(err);})
                 }
                 else{
                    result.likes++;
                    result.likedBy.push(user.name);
                    result.save().then((result)=>{res.send(result)}).catch(err=>{res.send(err);})
                  }
}
}
}).catch(err=>{res.send(err);})
}).catch((err)=>{ res.send(err); })
})
app.post('/dislQuestion',(req,res)=>{
    quest.findOne({_id:req.body.blogid}).then((result)=>{
    console.log(req.body.blogid);
    sign.findOne({_id:req.body.id}).then((user)=>{ 
        console.log(req.body.id);
        if(user.name ==result.createdBy){ res.send({'msg':'you cant dislike your own post'}) }
        else{
            if(result.dislikedBy.includes(user.name)){   res.send({"msg":"you alreasy disliked the post"})}
              else{
                 if(result.likedBy.includes(user.name))
                   {
                    result.likes--;
                    const arrayIndex=result.likedBy.indexOf(user.name);
                    result.likedBy.splice(arrayIndex,1);
                    result.dislikes++;
                    result.dislikedBy.push(user.name);
                    result.save().then((result)=>{res.send(result)}).catch(err=>{res.send(err);})
                    }
                   else{
                    result.dislikes++;
                    result.dislikedBy.push(user.name);
                    result.save().then((result)=>{res.send(result)}).catch(err=>{res.send(err);})
                    }
}
}
}).catch(err=>{res.send(err);})
}).catch((err)=>{res.send(err);})
})
app.post('/delQuest',(req,res)=>{
    quest.findOne({_id:req.body.blogid}).then((result)=>{
    sign.findOne({name:req.body.name}).then((user)=>{
          console.log(result.createdBy);
          if(user.name==result.createdBy){result.remove().then((result)=>{res.send(result)}).catch(err=>{res.send(err)}) }
          else{ res.send({"msg":"you are not allowed to delte the post"})  }
}).catch((err)=>{res.send(err)})
}).catch(err=>res.send(err))
})
app.post('/commentQuestion',(req,res)=>{
    quest.findOne(({_id:req.body.blogid})).then((result)=>{
    sign.findOne({_id:req.body.id}).then((user)=>{
    result.comments.push({
    comment:req.body.comment,
    commentator:user.name
                     })
    result.save().then((result)=>{res.send(result)
}).catch((err)=>{res.send(err);});
}).catch((err)=>{res.send(err);});
}).catch((err)=>{res.send(err);});
});
// for blogs
app.post('/newBlog', (req, res) => {     
    const blogs = new blog(req.body);
    blogs.save().then((result)=>{res.send(result)}).catch(err=>res.send(err))
  });
app.get('/allBlogs', (req, res) => { blog.find().then(result=>{res.send(result)}).catch((err=>{res.send(err)}));  });
app.post('/likeblog',(req,res)=>{
       blog.findOne({_id:req.body.blogid}).then((blog)=>{
       console.log(req.body.blogid);
       sign.findOne({_id:req.body.id}).then((user)=>{
       console.log(req.body.id);
       if(user.name ==blog.createdBy){res.send({'msg':'you cant like your own post'})}
        else {
            if(blog.likedBy.includes(user.name))  { res.send({"msg":"you alreasy liked the post"}) }
            else{
                if(blog.dislikedBy.includes(user.name))
                 {
                blog.dislikes--;
                const arrayIndex=blog.dislikedBy.indexOf(user.name);
                blog.dislikedBy.splice(arrayIndex,1);
                blog.likes++;
                blog.likedBy.push(user.name);
                blog.save().then((result)=>{res.send(result)}).catch(err=>{res.send(err);})
                 }
                else{ blog.likes++;
                      blog.likedBy.push(user.name);
                      blog.save().then((result)=>{res.send(result)}).catch(err=>{res.send(err);})
                     }
            }
            }
}).catch(err=>{res.send(err);})
}).catch((err)=>{ res.send(err); })
})
app.post('/dislikeblog',(req,res)=>{
    blog.findOne({_id:req.body.blogid}).then((blog)=>{
    console.log(req.body.blogid);
    sign.findOne({_id:req.body.id}).then((user)=>{
    console.log(req.body.id);
    if(user.name ==blog.createdBy){  res.send({'msg':'you cant dislike your own post'}) }
     else {  
            if(blog.dislikedBy.includes(user.name)) {res.send({"msg":"you alreasy disliked the post"})}
              else{
                if(blog.likedBy.includes(user.name))
                    {
                    blog.likes--;
                    const arrayIndex=blog.likedBy.indexOf(user.name);
                    blog.likedBy.splice(arrayIndex,1);
                    blog.dislikes++;
                    blog.dislikedBy.push(user.name);
                    blog.save().then((result)=>{res.send(result)}).catch(err=>{res.send(err);})
                    }
                    else{
                    blog.dislikes++;
                    blog.dislikedBy.push(user.name);
                    blog.save().then((result)=>{res.send(result)}).catch(err=>{res.send(err);})
                         }
                     }
                  }
}).catch(err=>{res.send(err);})
}).catch((err)=>{res.send(err); })
})
app.post('/deleteblog',(req,res)=>{
    blog.findOne({_id:req.body.blogid}).then((blog)=>{
    sign.findOne({name:req.body.name}).then((user)=>{
    console.log(blog.createdBy);
    if(user.name==blog.createdBy){ blog.remove().then((result)=>{res.send(result)}).catch(err=>{res.send(err)}) }
    else{ res.send({"msg":"you are not allowed to delte the post"})    }     
    }).catch((err)=>{res.send(err)})
    }).catch(err=>res.send(err))
})
app.post('/commentblog',(req,res)=>{
    blog.findOne(({_id:req.body.blogid})).then((blog)=>{
    sign.findOne({_id:req.body.id}).then((user)=>{
    blog.comments.push({
                      comment:req.body.comment,
                      commentator:user.name
                      }) 
    blog.save().then((result)=>{res.send(result)
    }).catch((err)=>{res.send(err);});
    }).catch((err)=>{res.send(err);});
    }).catch((err)=>{res.send(err);});
});
app.post('/sellData',(req,res)=>{
    var data=new resell({title:req.body.title,price:req.body.price,category:req.body.category,plusminus:req.body.plusminus,ext:req.body.ext});
    data.imageName=data._id;
    console.log(data.imageName);
    console.log(req.body.name);
    let url=req.body.name+'.'+req.body.ext;
    let buffer= new Buffer(req.body.imageUrl,"base64");
    console.log(buffer);
    return fs.writeFile('./backend/images/'+data.imageName+"."+req.body.ext,buffer,(err,ret)=>{
            if(err){ res.send('error'); }
            else{
               console.log("done");
               return data.save().then((result)=>{
               console.log(result);
               console.log(result.price);
               console.log(result.title);
               res.send(result);
               }).catch((err)=>{res.send(err); });     
              }
});
});
// used only for image uploading  storing data of selling
app.post('/sellData',(req,res)=>{
    var data=new resell({title:req.body.title,price:req.body.price,category:req.body.category,pehchan:req.body.pehchan,plusminus:req.body.plusminus,ext:req.body.ext});
    data.imageName=data._id;
    console.log(data.imageName);
    console.log(req.body.name);
    let url=req.body.name+'.'+req.body.ext;
    let buffer= new Buffer(req.body.imageUrl,"base64");
    console.log(buffer);
    return fs.writeFile('./backend/images/'+data.imageName+"."+req.body.ext,buffer,(err,ret)=>{
            if(err){ res.send('error'); }
            else{
               console.log("done");
               return data.save().then((result)=>{
               console.log(result);
               console.log(result.price);
               console.log(result.title);
               res.send(result);
               }).catch((err)=>{res.send(err);});
              }
});
});
app.post('/showReselData',(req,res)=>{
    console.log(req.body);
    resell.find().then((result)=>{
    console.log(result);
    res.status(200).send(result);               
}).catch((err)=>{res.send(err);});
});
app.post('/img',(req,res)=>{
    let path='./backend/images/'+req.body.imageName+'.'+req.body.ext;
    console.log(path);
    fs.readFile(path,'base64',(err,buffer)=>{
    let image=buffer.toString('base64');
    let resu={"image":image};
    res.send({"buffer":resu});
});
});
port=3000;
server.listen(port,(res)=>{ console.log(`listen on port ${port}`);});