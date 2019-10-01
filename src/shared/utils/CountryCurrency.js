export default class CountryCurrency {
    getCurrency = (country) => {
        return new Promise((resolve, reject) => {
            let currency = '';
            let countryTwoLetter = '';

            const domain = 'https://restcountries.eu/rest/v2/name/' + country;

            fetch(domain)
                .then((response) => {
                    if (response.ok) {
                        const contentType = response.headers.get('content-type');
                        if (contentType && contentType.includes('application/json')) {
                            response
                                .json()
                                .then((data) => {
                                    currency = data[0].currencies[0].code;
                                    countryTwoLetter = data[0].alpha2Code;
                                    resolve({ currency, countryTwoLetter });
                                })
                                .catch((error) => {
                                    reject('JSON could not be parsed');
                                });
                        } else {
                            reject('Response not JSON');
                        }
                    } else {
                        response.json().then((result) => {
                            reject(result);
                        });
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };
}
