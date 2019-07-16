new Vue({
    el: '#app',
    data() {
        return {
            apiKey: 'trnsl.1.1.20190715T222644Z.22d479b4590e609f.cafb43dfb84faf96f18aef07ba49a001ab39b2e1',
            apiUrl: 'http://localhost:8008',
            text: "",
            data: "",
        }
    },
    methods: {
        translate() {
            axios.get(this.apiUrl,  {
                    params: {
                    text: this.text,
                }
            }).then(response => {this.data = response.data[0]}).catch(error => (this.data = error))
        }
    },

});

