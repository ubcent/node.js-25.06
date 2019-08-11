Vue.component('AllTasks', {
  data() {
    return {
      tasks: null,
    };
  },
  mounted() {
    this.getAll();
  },
  methods: {
    getAll() {
      if (localStorage.getItem('userKey')) {
        fetch(`/tasks`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('userKey'),
          },
        })
            .then((result) => result.json())
            .then((data) => {
              this.tasks = data;
            // console.log(data);
            })
            .catch((error) => console.log(error));
      }
    },
    remove(id) {
      fetch(`/tasks/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('userKey'),
        },
        body: JSON.stringify({id}),
      })
          .then((result) => result.json())
          .then((data) => {
            // console.log(data);
            this.getAll();
          })
          .catch((error) => console.log(error));
    },
  },
  template: `
            <div class="all-tasks">
                <h3 class="clearfix my-3">All currents tasks</h3>
                <div class="row mb-2">

                    <span class="col-2 text-center border"> Title </span>
                    <span class="col-4 text-center border"> Description </span>
                    <span class="col-2 text-center border"> Status </span>
                    <span class="col-2 text-center border text-wrap">
                <i class="far fa-calendar-alt mr-2"></i> Created / Updated </span>
                </div>
                <div v-for="task of tasks" :key="task.id">
                    <div class="row mb-2">

                        <span class="col-2 border"> {{task.title}} </span>
                        <span class="col-4 border"> {{ task.description }} </span>
                        <span class="col-2 text-center border"> {{ task.status }} </span>
                        <span class="col-2 text-center border text-wrap"> {{ task.update }} </span>
                        <span class="col-1">
                            <i class="far fa-trash-alt" @click="remove(task._id)"></i><span class="mr-3"></span>
                            <i class="fas fa-pen"
                                @click="$parent.$refs.TaskUpdate.showUpdateForm(task._id, task.title, task.description, task.status)"></i>
                    </span>
                    </div>
                </div>
            </div>
  `,
});
