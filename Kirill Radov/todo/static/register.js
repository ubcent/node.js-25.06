new Vue({
    el: '#register',
    data() {
        return {
            apiUrl: 'http://localhost:8008/register',
            username: '',
            data: '',
            password: '',
            password2: '',
            email: '',
            firstname: '',
            lastname: '',
            error: '',
            ok: '',
        }
    },
    methods: {
        register() {
              if(this.username.trim() === '' || this.password.trim() === ''  || !this.username || !this.password) {
                this.error = 'yes';
                this.username = '';
                this.password = '';
                this.password2 = '';
                setTimeout( () => {
                    this.error = '';
                    this.newtasktext = '';
                    this.newtaskname = '';
                    this.data = '';
                }, 1);
            } else {
                axios.post(this.apiUrl,  {
                    params: {
                        login: this.username.toLocaleLowerCase(),
                        password: this.password,
                        password2: this.password2,
                        firstName: this.firstname,
                        lastName: this.lastname,
                        email: this.email,
                    }
                }).then(response => {
                    if(response.data.msg) {
                        this.data = response.data.msg;
                        this.username = '';
                        this.password = '';
                        this.password2 = '';
                        this.email = '';
                        this.firstname = '';
                        this.lastname = '';
                    } else this.data = response.data;
                }).catch(error => (this.data = error))
            }

        }
    },
});

