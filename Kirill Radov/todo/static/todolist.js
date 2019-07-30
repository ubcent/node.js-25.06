new Vue({
    el: '#todolist',
    data() {
        return {
            apiUrl: 'http://localhost:8008/todo',
            data: '',
            newtasktext: '',
            newtaskname: '',
            error: '',
        }
    },
    methods: {
        todolist() {
            const id = $cookies.get('todo').substr(2).replace(/"/gm,'');
            this.newtaskname = '';
            this.newtasktext = '';
                axios.post(this.apiUrl,  {
                params: {
                    userId: id,
                }
            }).then(response => {
                if(response.data[0]) {
                    this.data = response.data.reverse();
                } else this.data = '';
            }).catch(error => (this.data = error))
        },

        newTask() {
            const date = Date();
            const test = this.newtaskname + this.newtasktext;
            const id = $cookies.get('todo').substr(2).replace(/"/gm,'');
            if(test.trim() === '') {
                this.error = 'yes';
                setTimeout( () => {
                     this.error = '';
                     this.newtasktext = '';
                     this.newtaskname = '';
                }, 1);
            } else {
                axios.post(`${this.apiUrl}/new`,  {
                    params: {
                        taskName: this.newtaskname,
                        taskData: this.newtasktext,
                        taskStatus: 'in progress',
                        taskDeleted: 'false',
                        taskCreatedTime: date,
                        userId: id,
                    }
                }).then(response => {
                    if(response.data === 'ok') {
                        this.todolist();
                    }}).catch(error => (this.data = error))
            }
        },

        delTask(taskId) {
            const id = $cookies.get('todo').substr(2).replace(/"/gm,'');
            axios.post(`${this.apiUrl}/delete`,  {
                params: {
                    userId: id,
                    taskId: taskId,
                    taskDeleted: true,
                }
            }).then(response => {
                if(response.data.ok) {
                    this.data.status = 'ok'
                }}).catch(error => (this.data.status = error))
        },

        doneTask(taskId) {
            const id = $cookies.get('todo').substr(2).replace(/"/gm,'');
            axios.post(`${this.apiUrl}/done`,  {
                params: {
                    userId: id,
                    taskId: taskId,
                    status: 'done',
                }
            }).then(response => {
                if(response.data.ok) {
                    this.data.taskStatus = 'done';
                    this.data.status = 'ok'
                }}).catch(error => (this.data.status = error))
        },
    },
    mounted() {
        this.todolist()
    },

});
if (!$cookies.get('todo')) {
    window.location.href = 'index.html';
};
