const { Buffer } = require('buffer')
const tlds_set = require('tlds')

const local = "A-Za-z0-9!#$%&\\'*+\\-\\/=?^_`{|}~"
const domain = 'A-Za-z0-9\\-'
const tlds = tlds_set.join('|')

EMAIL_REGEX = new RegExp(`([${local}][${local}.]+[${local}s]@[${domain}.]+\\.(?:${tlds}))(?:[^${domain}]|$)`,'gm')

const HIDDEN_AT_SYM = ["(at)", "[at]", "(@)", "[@]"]
const HIDDEN_DOT_SYM = ["(dot)", "[dot]", "(.)", "[.]"]

escapeSym = (sym) => {
    return sym.replace("(", "\\(").replace(")", "\\)").replace("[", "\\[").replace("]", "\\]");
}

const AT_REGEXES = HIDDEN_AT_SYM.map((item) => {
    return new RegExp(`(\\s)*${escapeSym(item)}(\\s)*`, 'g')
})

const DOT_REGEXES = HIDDEN_DOT_SYM.map((item) => {
    return new RegExp(`(\\s)*${escapeSym(item)}(\\s)*`, 'g')
})

extractEmails = (html) => {
    


    AT_REGEXES.forEach((item) => {
        html = html.replace(item, "@")
    });

    DOT_REGEXES.forEach((item) => {
        html = html.replace(item, ".")
    });

    const matches = []
    // return [html.match(EMAIL_REGEX)].map((item => item[0]))
    let match = EMAIL_REGEX.exec(html)
    while(match!= null){
        if(match.length >= 2){
            matches.push(match[1])
        }
        match = EMAIL_REGEX.exec(html)
    }

    return matches
}

deobfuscateHtml = (html) => {

    replaceAtob = (match, p1, p2, p3, offset, string) => {
        return Buffer.from(p1, 'base64').toString('binary')
    }

    // Escape the html
    let unescapedHtml = unescape(html);
    // Replace the encoded tags
    unescapedHtml = unescapedHtml.replace(/atob\([\'"]([A-Za-z0-9+\/]+)[\'"]\)/gm, replaceAtob)

    return unescapedHtml
}

scrapeEmails = (html) => {
    return extractEmails(deobfuscateHtml(html));
}


module.exports.scrapeEmails = scrapeEmails;