module.exports.removeEmojis = string => {
    return string.replace(/(\<([a-zA-Z0-9\#\~\'\&\/\`\"\(\@\)\[\]\{\°\}\\\^\$\|\?\*\+\:\.\-\=\!\_\*\$\£\¤\µ\¨\%\?\!\;\,\§]*)\>)/g, '');
}