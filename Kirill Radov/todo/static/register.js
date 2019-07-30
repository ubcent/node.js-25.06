new Vue({
    el: '#register',
    data() {
        return {
            apiUrl: 'http://localhost:8008/register',
            username: '',
            data: '',
            password: '',
            email: '',
            firstname: '',
            lastname: '',
        }
    },
    methods: {
        register() {
            axios.post(this.apiUrl,  {
                params: {
                    login: this.username.toLocaleLowerCase(),
                    password: this.password,
                    firstName: this.firstname,
                    lastName: this.lastname,
                    email: this.email,
                }
            }).then(response => {
                if(response.data === 'ok') {
                    this.data = 'Успешная регистрация!';
                } else this.data = 'Заполните поля правильно!';
            }).catch(error => (this.data = error))
        }
    },
});

