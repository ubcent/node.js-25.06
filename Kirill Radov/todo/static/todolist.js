new Vue({
    el: '#todolist',
    data() {
        return {
            apiUrl: 'http://localhost:8008/todo/',
            data: '',
            newtasktext: '',
            newtaskname: '',
            error: '',
            id: '',
        }
    },
    methods: {
        todolist() {
             const token = localStorage.getItem('token');
                axios.get(`${this.apiUrl}`, { headers: { Authorization: `Bearer ${token}` } })
                    .then(response => {
                if(response.data[0]) {
                    this.data = response.data.reverse();
                } else this.data = '';
            }).catch(error => (this.data = error))
        },

        newTask() {
            const token = localStorage.getItem('token');
            const date = Date();
            const test = this.newtaskname + this.newtasktext;
            if(test.trim() === '') {
                this.error = 'yes';
                setTimeout( () => {
                     this.error = '';
                     this.newtasktext = '';
                     this.newtaskname = '';
                }, 1);
            } else {
                axios.post(`${this.apiUrl}`,  {
                    params: {
                        taskName: this.newtaskname,
                        taskData: this.newtasktext,
                        taskStatus: 'in progress',
                        taskDeleted: 'false',
                        taskCreatedTime: date,
                    }
                },{ headers: { Authorization: `Bearer ${token}` } }).then(response => {
                    if(response.data.status === 'ok') {
                        this.newtasktext = '';
                        this.newtaskname = '';
                        this.todolist();
                    }}).catch(error => (this.data = error))
            }
        },

        delTask(taskId) {
            const token = localStorage.getItem('token');
            const id = localStorage.getItem('id');
            axios.delete(`${this.apiUrl}${taskId}`, { headers: { Authorization: `Bearer ${token}` } })
                .then(response => {
                if(response.data.status === 'ok') {
                    this.data.status = 'ok'
                }}).catch(error => (this.data.status = error))
        },

        doneTask(taskId) {
            const token = localStorage.getItem('token');
            const id = localStorage.getItem('id');
            axios.patch(`${this.apiUrl}${taskId}`, {taskStatus: 'done'}, { headers: { Authorization: `Bearer ${token}` } }).then(response => {
                if(response.data.ok) {
                    this.data.taskStatus = 'done';
                    this.data.status = 'ok'
                }}).catch(error => (this.data.status = error))
        },
        removedata() {
            localStorage.removeItem("token");
        },
    },
    mounted() {
        this.todolist()
    },

});

