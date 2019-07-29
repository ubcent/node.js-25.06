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
                params: {
                    login: this.username.toLowerCase(),
                    password: this.password,
                }
            }).then(response => {
                if(response.data.url) {
                    window.location.href = '/todolist.html';
                } else this.data = response.data}).catch(error => (this.data = error))
        }
    },
});

