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
                if(response.data.url) {
                window.location.href = response.data.url;
            } else if(!response.data.url) {
                    this.username = '';
                    this.password = '';
                    this.data = 'Неправильное имя пользователя или пароль';
                } else this.data = response.data}).catch(error => (this.data = error))
        }
    },

});

