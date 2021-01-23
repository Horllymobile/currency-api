const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const baseUrl = 'https://api.exchangeratesapi.io/latest';

app.get('/api/rates', async(req, res) => {

    const base = req.query.base;
    let currency = req.query.currency;

    if(!base && !currency) {
        //console.log(base);
        axios.get(`${baseUrl}`, {method: 'GET'})
        .then(response => {
           if(response) return res.status(200).json({
                results: {
                    base: response.data.base,
                    date: response.data.date,
                    rate: response.data.rates
            }});
            console.log('res',response)
        }).catch(err => {
            return res.status(500).json({error: 'Something went wrong'});
        });
    }
    if(base && !(base && currency)) {
        //console.log(base);
        axios.get(`${baseUrl}?base=${base.toUpperCase()}`, {method: 'GET'})
        .then(response => {
           // console.log(data.data);
           if(response) return res.status(200).json({
                results: {
                    base: response.data.base,
                    date: response.data.date,
                    rate: response.data.rates
            }});
            console.log('res',response)
        }).catch(err => {
            return res.status(404).json({error: 'Data with the base ' + base + ' is not found'});
        });
    }

    if(base && currency) {
        axios.get(`${baseUrl}?base=${base.toUpperCase()}`, {method: 'GET'})
        .then(response => {
            currency = currency.split(',');
            const rates = Object.keys(response.data.rates)
            .filter(key => currency.includes(key))
            .reduce((obj, key) => {
               obj[key] = response.data.rates[key];
                return obj;
            }, {});
            
            return res.status(200).json({
                
                results: {
                    base: response.data.base,
                    date: response.data.date,
                    rates
                }
            });
            }
        ).catch(err => {
            return res.status(404).json({error: 'currency of base  '+ base +'base is not found'});
        })
    }

});

const port = process.env.PORT || 3000

app.listen(port, console.log('Server running on Port http://localhost:3000'));