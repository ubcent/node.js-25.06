new Vue({
    el: '#login',
    data() {
        return {
            apiUrl: 'http://localhost:8008/login',
            username: '',
            data: '',
            password: '',
        }
    },
    methods: {

        login() {
            axios.post(this.apiUrl,  {
                    login: this.username.toLowerCase(),
                    password: this.password,
            }).then(response => {
                if(response.data.result === 'success') {
                    localStorage.setItem('token', response.data.token);
                    window.location.href = '/todolist.html';
            } else if(response.data.result === 'failure') {
                    this.username = '';
                    this.password = '';
                    this.data = response.data.message;
                } else this.data = response.data}).catch(error => (this.data = error))
        }
    },
    mounted() {
        localStorage.removeItem('token');
    },

});

