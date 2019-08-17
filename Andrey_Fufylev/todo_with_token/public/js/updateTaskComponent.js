Vue.component('TaskUpdate', {
  data() {
    return {
      id: null,
      updatedTaskTitle: null,
      updatedTaskDescription: null,
      updatedTaskStatus: null,
    };
  },
  methods: {
    showUpdateForm(id, title, description, status) {
      this.swapVisibility();
      this.id = id;
      this.updatedTaskTitle = title;
      this.updatedTaskDescription = description;
      this.updatedTaskStatus = status;
    },
    toUpdate() {
      const data = {
        id: this.id,
        title: this.updatedTaskTitle,
        description: this.updatedTaskDescription,
        status: this.updatedTaskStatus,
      };
      socket.emit('updateTask', data);
      socket.on('updateTask', (data) => {
        if (data.result === 'success') {
          this.$parent.$refs.AllTasks.getAll();
          this.$parent.showTasks = true;
          this.$parent.showUpdateForm = false;
        }
      });
    },
    swapVisibility() {
      this.$parent.showTasks = !this.$parent.showTasks;
      this.$parent.showUpdateForm = !this.$parent.showUpdateForm;
    },
  },
  template: `
            <div class="task-update">
                <h3 class="clearfix my-3">Update Form</h3>
                <div class="row mt-3">
                    <span class="col-2 text-center border"> Title </span>
                    <span class="col-4 text-center border"> Description </span>
                    <span class="col-2 text-center border"> Status </span>

                </div>
                <div class="row mb-3">
                    <textarea class="col-2 border" name="textarea" v-model="updatedTaskTitle"></textarea>
                    <textarea class="col-4 border" name="textarea" v-model="updatedTaskDescription"></textarea>
                    <select class="col-2 text-center border" name="source" v-model="updatedTaskStatus">
                        <option value="Not started">Not started</option>
                        <option value="In progress">In progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <button type="button" class="btn btn-success mb-3" @click="toUpdate()">Update</button>
                <button type="button" class="btn btn-blue-grey mb-3" @click="swapVisibility()">Cancel</button>
            </div>
  `,
});
