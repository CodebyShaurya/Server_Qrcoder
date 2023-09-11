const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const bcrypt =require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

const db=knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : 'shauryagupta',
      database : 'qrcoder'
    }
  });

// db.select('*').from('users').then(data=>{
//     console.log(data);
// });

app.use(cors())

app.use(bodyparser.json())
const database ={
    users:[
        {
            id:1,
            name:'Bhai',
            email:'bhai@salu.com',
            password:'qwerty',
            entries:0,
            joined: new Date()
         },
         {
            id:2,
            name:'hai',
            email:'hai@salu.com',
            password:'qwert',
            entries:0,
            joined: new Date()
         }
         
    ]
}

app.get('/',(req,res)=>{
    res.send('Working');
})

app.post('/signin',(req,res)=>{

    db('login').select('email','hash')
    .where('email','=',req.body.email)
    .then(data =>{
        const isvalid=bcrypt.compareSync(req.body.password,data[0].hash);
        // console.log(isvalid)
        if (isvalid){
            return db.select('*').from('users')
            .where('email','=',req.body.email)
            .then(user => {
                // console.log(user[0])
                res.json(user[0])
            }).catch(err => res.status(400).json('unable to get user'))
        }
    }).catch(err => res.status(400).json('wrong input'))

    // console.log('req.body.ownerName');
    // database.users.forEach(user=>{
    //     console.log(user);
    //     if (req.body.email === user.email  && req.body.password === user.password) {
    //         res.json(user);
    
    //     }
    
    // })
    console.log('hn')
})

app.get('/profile/:id',(req,res)=>{

    const {id} = req.params;
    let found=false;
    database.users.forEach(user=>{
        if (user.id === id){
            found=true;
            return res.json(user);
            
        }})
        if (!found){
            res.status(404).json('no such users');
        }
    
    })





app.post('/register',(req,res)=>{
    const {email,name,password}= req.body;
    const hash= bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login').returning('email').then(loginemail =>{
                // console.log(loginemail[0])
            return trx('users').returning('*')  
            .insert({
                email:loginemail[0].email,
                name:name,
                joined:new Date()
            })
            .then(user => {
                res.json(user[0])
                
            })
        })
        .then(trx.commit).catch(trx.rollback)
    })
    

    
})

app.post('/link',(req,res)=>{

    const {id,entries} = req.body;
    const newentry = (Number(entries) +1).toString() ;
    // console.log(entries)
    // console.log(newentry)
    db('users').where('id ','=',id)
  .update({
    entries : newentry
  }).returning('*').then(user =>{
    res.json(user[0])}).catch(err => res.status(400).json('None'))
    // db('users').where('id ','=',id).increment('entries',1)
});




 
    

    



app.listen(3000, ()=>{
    console.log('app is running');
})

























    // .catch(err => res.status(400).json('Unable to send'))

    // database.users.push(
        
    //         {
    //             id:idsend,
    //             name: name,
    //             email: email,
    //             password: password,
    //             entries:0,
    //             joined: new Date()
    //         }
        
    // );
    // db.select('*').from('users').then(data=>{
    //     console.log(data);
    // });
    // res.json(database.users[database.users.length-1])

        // })
    // bcrypt.hash("bacon", null, null, function(_err, hash) {
    //     // Store hash in your password DB.
    // });
    
    // // Load hash from your password DB.
    // bcrypt.compare("bacon", hash, function(err, res) {
    //     // res == true
    // });
    // bcrypt.compare("veggies", hash, function(err, res) {
    //     // res = false
