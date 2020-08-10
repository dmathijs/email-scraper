## Scrape (obfuscated) emails using Javascript

This library makes it possible to parse all emails out of html, even the obfuscated ones. 
To get started:

    const { scrapeEmails } = require('html-email-scraper')

After that call the scrapeEmails function with your html (-string)  to fetch all emails.

    const html = `<div>test (at) gmail.com</div>`
    const emails = scrapeEmails(html)
    >>> ['test@gmail.com']

For async functionality:

    const { scrapeEmailsPromise } = require('html-email-scraper')
    const html = `<div>Jeremy.Clarkson (at) gmail(dot)com</div>`
    const emails = await scrapeEmailsPromise(html)
    >>> ['Jeremy.Clarkson@gmail.com']

Feel free to submit pull requests for improvements.
