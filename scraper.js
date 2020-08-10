const { Buffer } = require('buffer')
const tlds_set = require('tlds')

const local = "A-Za-z0-9!#$%&\\'*+\\-\\/=?^_`{|}~"
const domain = 'A-Za-z0-9\\-'
const tlds = tlds_set.join('|')


const HIDDEN_AT_SYM = ["(at)", "[at]", "(@)", "[@]"]
const HIDDEN_DOT_SYM = ["(dot)", "[dot]", "(.)", "[.]"]

escapeSym = (sym) => {
    return sym.replace("(", "\\(").replace(")", "\\)").replace("[", "\\[").replace("]", "\\]");
}

const AT_REGEXES = HIDDEN_AT_SYM.map((item) => {
    return new RegExp(`(\\s)?${escapeSym(item)}(\\s)?`, 'g')
})

const DOT_REGEXES = HIDDEN_DOT_SYM.map((item) => {
    return new RegExp(`(\\s)?${escapeSym(item)}(\\s)?`, 'g')
})  

extractEmails = (html) => {
  

    if(html == null || html == undefined){
        return []
    }
    
    // Define Regex in local scope as regex is statefull and thus can not be shared
    const EMAIL_REGEX = new RegExp(`([${local}][${local}.]+[${local}s]@[${domain}.]+\\.(?:${tlds}))(?:[^${domain}]|$)`,'g')
    
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
    
    if(html == null || html == undefined){
        return undefined
    }

    const ATOB_REGEX = /atob\([\'"]([A-Za-z0-9+\/]+)[\'"]\)/gm;

    replaceAtob = (match, p1, p2, p3, offset, string) => {
        return Buffer.from(p1, 'base64').toString('binary')
    }

    // Undertake steps to clean html
    // 1. Remove images
    let cleanedHtml = html.replace(/<img[^>]*>/g,"");

    // Escape the html
    let unescapedHtml = unescape(cleanedHtml);
    // Replace the encoded tags
    unescapedHtml = unescapedHtml.replace(ATOB_REGEX, replaceAtob)

    return unescapedHtml
}

scrapeEmails = (html) => {
    return extractEmails(deobfuscateHtml(html));
}

scrapeEmailsPromise = async (html) => {
    return extractEmails(deobfuscateHtml(html));
}


module.exports.scrapeEmails = scrapeEmails;
module.exports.scrapeEmailsPromise = scrapeEmailsPromise;