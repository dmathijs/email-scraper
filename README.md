## Scrape (obfuscated) emails using Javascript

This library makes it possible to parse all emails out of html, even the obfuscated ones. 
To get started:

    const { scrapeEmails } = require('scrape-emails')

After that call the scrapeEmails function with your html (-string)  to fetch all emails.

    const html = `<div>test (at) gmail.com</div>`
    const emails = scrapeEmails(html)
    >>> ['test@gmail.com']

Feel free to submit pull requests for improvements.
