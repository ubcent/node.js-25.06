<template>
  <div class="my-5">
    <div class="add-task">
      <h3 class="clearfix my-3">Add new tasks</h3>
      <div class="row mb-2">
        <div class="col-3">
          <label for="title">Title</label><br>
          <textarea name="textarea" rows="3" cols="25" id="title" v-model="newTaskTitle">
                    </textarea>
        </div>
        <div class="col-6">
          <label for="description">Description</label><br>
          <textarea name="textarea" rows="3" cols="60" id="description" v-model="newTaskDescription"></textarea>
        </div>
      </div>
      <h3 v-show="error">{{ error }}</h3>
      <button type="button" class="btn btn-primary mb-3" @click="add()">Add task</button>
    </div>
    <div class="all-tasks">
      <h3 class="clearfix my-3">All currents tasks</h3>
      <div class="row mb-2">

        <span class="col-4 text-center border"> Title : Description </span>
        <span class="col-4 text-center border"> Status </span>
        <span class="col-2 text-center border text-wrap">
          <i class="far fa-calendar-alt mr-2"></i> Created / Updated </span>
      </div>
      <div v-for="task of tasks" :key="task.id">
        <div class="row mb-2">
          <div class="col-4 border"><span class="text text-primary font-weight-bold">{{task.title}}:</span> {{
            task.description }} </div>
          <div class="col-2 border text-center px-0"><span class="">{{ task.status }}</span></div>
          <div class="col-2 border ">
            <small>Click to mark as:</small>
            <div class="mb-2 text text-success" @click="update(task._id, 'Completed')">
              <i class="fas fa-check"></i><small class="task_status">&ensp;Completed</small>
            </div>
            <div class="mb-2 text text-warning" @click="update(task._id, 'In progress')">
              <i class="fas fa-tasks"></i><small class="task_status">&ensp;In Progress</small>
            </div>
          </div>
          <small :id="task._id" class="col-2 text-center border text-wrap"> {{ task.update }} </small>
          <span class="col-1">
            <i class="far fa-trash-alt fa-2x" @click="remove(task._id)"></i><span class="mr-3"></span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import VueSocketio from 'vue-socket.io-extended';
  import io from 'socket.io-client';

  // make connection with server on port 3000
  Vue.use(VueSocketio, io('http://localhost:3000', {
    query: {
      token: localStorage.getItem('userKey'), // send Token to server for authentication
    },
  }));

  export default {
    name: 'PageHome',
    data() {
      return {
        tasks: null,
        newTaskTitle: null,
        newTaskDescription: null,
        error: '',
      };
    },
    sockets: { // use listeners for socket.io
      connect() {
        console.log('socket connected');
      },
      authentication(data) { // listener for authentication
        if (data === 'success') {
          this.getAll();
        } else { // redirect user back `/auth`
          localStorage.removeItem('userKey');
          localStorage.removeItem('userName');
          window.location.href = '/auth';
        }
      },
      anyChangeTaskOnSuccess(data) { // listener for any change above task (add, remove, update)
        if (data.result === 'success') {
          this.getAll();
        }
      },
      getAllTasks(data) { // listener for getting all tasks
        this.tasks = data;
      }
    },
    mounted() {
      if (!localStorage.getItem('userKey')) { // double check
        window.location.href = '/auth';
      }
    },
    methods: {
      getAll() {
        this.$socket.emit('getAllTasks');
      },
      update(id, status) {
        this.$socket.emit('updateTask', {id, status});
      },
      remove(id) {
        this.$socket.emit('removeTask', id);
      },
      add() {
        if (!this.newTaskTitle || !this.newTaskDescription) {
          this.error = 'Not all fields are filled';
          return;
        }
        this.error = null;
        const data = {
          title: this.newTaskTitle,
          description: this.newTaskDescription,
        };
        this.$socket.emit('addTask', data);
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/main.scss';
  .task_status {
    cursor: pointer;
  }
</style>
