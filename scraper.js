const { Buffer } = require('buffer')
const tlds_set = require('tlds')

const local = "A-Za-z0-9!#$%&\\'*+\\-\\/=?^_`{|}~"
const domain = 'A-Za-z0-9\\-'
const tlds = tlds_set.join('|')

EMAIL_REGEX = new RegExp(`([${local}][${local}.]+[${local}s]@[${domain}.]+\\.(?:${tlds}))(?:[^${domain}]|$)`,'gm')

const HIDDEN_AT_SYM = ["(at)", "[at]", "(@)", "[@]"]
const HIDDEN_DOT_SYM = ["(dot)", "[dot]", "(.)", "[.]"]

extractEmails = (html) => {
    
    escapeSym = (sym) => {
        return sym.replace("(", "\\(").replace(")", "\\)").replace("[", "\\[").replace("]", "\\]");
    }

    HIDDEN_AT_SYM.forEach((item) => {
        html = html.replace(new RegExp(`(\\s)*${escapeSym(item)}(\\s)*`, 'g'), "@")
    });

    HIDDEN_DOT_SYM.forEach((item) => {
        html = html.replace(new RegExp(`(\\s)*${escapeSym(item)}(\\s)*`, 'g'), ".")
    });

    // return [html.match(EMAIL_REGEX)].map((item => item[0]))
    return html.match(EMAIL_REGEX)
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