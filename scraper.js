const { Buffer } = require('buffer')

const HIDDEN_AT_SYM = ["(at)", "[at]", "(@)", "[@]"]
const HIDDEN_DOT_SYM = ["(dot)", "[dot]", "(.)", "[.]"]

// Exclusion seesm better than inclusion of all tlds'..
const FORBIDDEN_TYPES = [".jpg",".png",".tiff",".gif",".jpg2000"]

escapeSym = (sym) => {
    return sym.replace("(", "\\(").replace(")", "\\)").replace("[", "\\[").replace("]", "\\]");
}

const AT_REGEXES = HIDDEN_AT_SYM.map((item) => {
    return new RegExp(`\\s?${escapeSym(item)}\\s?`, 'g')
})

const DOT_REGEXES = HIDDEN_DOT_SYM.map((item) => {
    return new RegExp(`\\s?${escapeSym(item)}\\s?`, 'g')
})  

const EMAIL_REGEX = /\b([A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6})\b/g

extractEmails = (html) => {
    
    if(html == null || html == undefined){
        return []
    }
    
    AT_REGEXES.forEach((item) => {
        html = html.replace(item, "@")
    });

    DOT_REGEXES.forEach((item) => {
        html = html.replace(item, ".")
    });

    const matches = [...html.matchAll(EMAIL_REGEX)]

    if(matches && matches.length > 0){
        return matches.filter(item => {
            // Exlude if forbidden
            for(var i = 0; i < FORBIDDEN_TYPES.length; i++){
                if(item[1].endsWith(FORBIDDEN_TYPES[i]))
                    return false;
            }
            return true;
        }).map((item) => {
            return item[1]
        })
    }

    return []
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