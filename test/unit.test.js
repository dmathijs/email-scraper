const { assert } = require('console')
const { scrapeEmaills, scrapeEmailsPromise } = require('../scraper')


describe('Simple email parsing test', () => {
    it('should find 3 emails', () => {
        // Arrange
        htmlSnippet = `... this is random text steve(dot)carrell(at)email[dot]harvard(dot)edu. \
        it also supports multi-line html as so: <span class='test'>John.Krasinksi@gmail.com</span> \
        it also supports nested obfuscated html like this <body class='c-body'><span id='random-span@'>Rain (dot) Wilson@dal.ca</div>`
        // Act
        const emails = scrapeEmails(htmlSnippet)
        // Assert
        assert(emails.length, 3)
        assert(emails[0],'steve.carrell@email.harvard.edu')
        assert(emails[1],'John.Krasinksi@gmail.com')
        assert(emails[2],'Rain.Wilson@dal.ca')
    })

    it('should find 1 email in obfuscated html using async', async () => {
        // Arrange & Act
        const emails = await scrapeEmailsPromise('<a href="javascript:window.location.href=atob(\'bWFpbHRvOmVtYWlsQGV4YW1wbGUuY29t\')">E-Mail</a>')
        // Assert
        assert(emails.length, 1)
    })  
})