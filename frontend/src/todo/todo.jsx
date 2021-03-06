import React, { Component } from 'react'
import axios from 'axios'

import PageHeader from '../template/pageHeader'
import TodoForm from '../todo/todoForm'
import TodoList from '../todo/todoList'

const URL = 'http://localhost:3003/api/todos'

export default class Todo extends  Component{
   constructor(props){
      super(props)
      this.state = { description: '', list: [] }
      this.handleChange = this.handleChange.bind(this)
      this.handleAdd = this.handleAdd.bind(this)
      this.handleRemove = this.handleRemove.bind(this)
      this.handleMarkAsPending = this.handleMarkAsPending.bind(this)
      this.handleMarkAsDone = this.handleMarkAsDone.bind(this)
      this.handleSearch = this.handleSearch.bind(this)
      this.handleClear = this.handleClear.bind(this)

      this.reflesh()
   }

   reflesh(description = ''){
      const search = description ? `&description__regex=/${description}/` : ''
      axios.get(`${URL}?sort=-createdAt${search}`)
         .then(resp => this.setState({...this.state, description, list: resp.data}))
   }

   handleSearch() {
      this.reflesh(this.state.description)
   }

   handleChange(e){
      this.setState({...this.state, description: e.target.value})
   }

   handleAdd(){
      const description = this.state.description
      axios.post(URL, {description}).then(resp => this.reflesh())
   }

   handleMarkAsDone(todo) {
      axios.put(`${URL}/${todo._id}`, { ...todo, done: true})
      .then(resp => this.reflesh(this.state.description))
   }

   handleMarkAsPending(todo) {
      axios.put(`${URL}/${todo._id}`, { ...todo, done: false })
         .then(resp => this.reflesh(this.state.description))
   }

   handleRemove(todo){
      axios.delete(`${URL}/${todo._id}`)
         .then(resp => this.reflesh(this.state.description))
   }

   handleClear(){
      this.reflesh()
   }

   render(){
      return(
         <div>
            <PageHeader name='Tarefas' small='Cadastro' />

            <TodoForm description={this.state.description} 
               handleAdd={this.handleAdd} 
               handleChange={this.handleChange}
               handleSearch={this.handleSearch}
               handleClear={this.handleClear}/>

            <TodoList list={this.state.list} 
               handleMarkAsDone={this.handleMarkAsDone} 
               handleMarkAsPending={this.handleMarkAsPending} 
               handleRemove={this.handleRemove}/>
         </div>
      )
   }
}