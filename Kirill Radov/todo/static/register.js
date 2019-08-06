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
            error: '',
        }
    },
    methods: {
        register() {
              if(this.username.trim() === '' || this.password.trim() === ''  || !this.username || !this.password) {
                this.error = 'yes';
                this.username = '';
                this.password = '';
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
                        firstName: this.firstname,
                        lastName: this.lastname,
                        email: this.email,
                    }
                }).then(response => {
                    if(response.data.url) {
                        alert(response.data.msg);
                        window.location.href = response.data.url;
                    } else this.data = response.data;
                }).catch(error => (this.data = error))
            }

        }
    },
});

