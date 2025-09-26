export function checkheading(str){
    return /^(\*)(\*)(.*)\*$/.test(str)
}
    {/* //  piyush  */}
export function replacecheckheadingstarts(str){
    return  str.replace(/^(\*)(\*)(.*)\*$/g,'')
}