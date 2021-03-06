new Vue({
  el:'#app',

  data:{
    isEditing: false,
    selectedIndex: null,
    todo:'',
    todos:[],
  },

  methods:{
    storeTodo(){
      this.todos.push(this.todo)
      this.todo=''
    },

    editToDo(todo,index){
      this.todo=todo
      this.selectedIndex=index
      this.isEditing= true
    },

    updateTodo(){
      this.todos.splice(this.selectedIndex, 1, this.todo)
      this.todo=''
      this.isEditing= false
    },

    deleteToDo(index,todo){
      this.todos.splice(index,1)
    }
  }
})