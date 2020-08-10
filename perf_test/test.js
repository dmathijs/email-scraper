const {scrapeEmails} = require('../scraper.js')
const fs = require('fs')


fs.readFile('test.html', 'utf8', (err, data) => {
    const date1 = Date.now();
    
    scrapeEmails(data)
    const date2 = Date.now();

    console.log(date2 - date1, "ms")
})