export const cleanTextareas = (text) => {
    // Replace line-breaks with "\n"
    let output = text.replace(/(?:\r\n|\r|\n)/g, '\\n') 
    console.log('===> ', output)
    return output
};