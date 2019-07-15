new Vue({
    el: '#app',
    data() {
        return {
            apiKey: 'trnsl.1.1.20190715T222644Z.22d479b4590e609f.cafb43dfb84faf96f18aef07ba49a001ab39b2e1',
            text: "",
            data: "",
        }
    },
    methods: {

        translate() {
            axios.get('https://translate.yandex.net/api/v1.5/tr.json/translate', {
                params: {
                    key: this.apiKey,
                    text: this.text,
                    lang: 'en-ru',
                }
            }).then(response => (this.data = response.data.text[0]))
                .catch(error => (this.info = error))
        }
    },

});

