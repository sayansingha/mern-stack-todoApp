const express = require('express');
const app = express()
const bodyParser=require('body-parser')
const cors = require('cors')
const path = require('path');
const mongoose = require('mongoose')
const todoRoutes = express.Router()
const PORT = process.env.PORT || 4000;

let Todo = require('./backend/todo.model.js')
const mongoUrl = 'mongodb+srv://sayan:fBJZHG8Fq1SncQnG@cluster0.ovm15.mongodb.net/todo?retryWrites=true&w=majority';
app.use(express.static(path.resolve("./frontend/build")))
// app.use(cors())
// app.use(bodyParser.json())
mongoose.connect(mongoUrl,{ useNewUrlParser: true, useUnifiedTopology: true })
const connection = mongoose.connection

connection.once('open',()=>{
    console.log("MongoDB database connection succesful!")
})

todoRoutes.route('/').get((req,res)=>{
    Todo.find((err,todos)=>{
        if(err){
            console.log(err)
        } else{
            res.json(todos)
        }
    })
})

todoRoutes.route('/:id').get((req,res)=>{
    let id= req.params.id
    Todo.findById(id,function(err,todo){
        res.json(todo)
    })
})

todoRoutes.route('/add').post((req,res)=>{
    let todo = new Todo(req.body)
    todo.save()
        .then(todo=>{
            res.status(200).json({'todo':'todo add success!'})
        })
        .catch(err=>{
            res.status(400).send('adding new todo failed')
        })
})
todoRoutes.route('/update/:id').post((req,res)=>{
    Todo.findById(req.params.id,(err,todo)=>{
        if(!todo)
            res.status(404).send('Data is not found!')
        else
            todo.todo_description = req.body.todo_description
            todo.todo_responsible = req.body.todo_responsible
            todo.todo_priority = req.body.todo_priority
            todo.todo_completed = req.body.todo_completed

            todo.save().then(todo=>{
                res.json('Todo updated!')
            })
            .catch(err=>{
                res.status(400).send("Update not possible!")
            })
    })
})
app.use('/todos', todoRoutes)

app.listen(PORT, function(){
    console.log("server is running on PORT:"+PORT)
})



