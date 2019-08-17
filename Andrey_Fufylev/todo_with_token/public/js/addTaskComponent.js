Vue.component('new_task', {
  data() {
    return {
      newTaskTitle: null,
      newTaskDescription: null,
      error: '',
    };
  },
  methods: {
    add() {
      if ( !this.newTaskTitle || !this.newTaskDescription ) {
        this.error = 'Not all fields are filled';
        return;
      }
      this.error = null;
      const data = {
        title: this.newTaskTitle,
        description: this.newTaskDescription,
      };
      socket.emit('addTask', data);
    },
  },
  template: `
            <div class="task">
                <h3 class="clearfix my-3">Add new tasks</h3>
                <div class="row mb-2">
                    <div class="col-3">
                        <label for="title">Title</label><br>
                        <textarea name="textarea" rows="2" cols="25" id="title" v-model="newTaskTitle">
                    </textarea>
                    </div>
                    <div class="col-6">
                        <label for="description">Description</label><br>
                        <textarea name="textarea" rows="2" cols="60" id="description"
                                  v-model="newTaskDescription"></textarea>
                    </div>
                </div>
                <h3 v-show="error">{{ error }}</h3>
                <button type="button" class="btn btn-primary mb-3" @click="add()">Add task</button>
            </div>
  `,
});
