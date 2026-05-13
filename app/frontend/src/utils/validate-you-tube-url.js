export const validateYoutubeUrl = (url) => {
    // Makes sure that the URL is a string.
    const stringifiedUrl = String(url).trim()

    if (stringifiedUrl === '' || stringifiedUrl === null) {
        return stringifiedUrl
    }

    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|live\/|v\/|shorts\/)|youtu\.be\/)([\w-]{11})(\?.*)?$/;

    if (youtubeRegex.test(stringifiedUrl)) {
        return stringifiedUrl
    } else {
        return new Error('The url provided is not valid.')
    }
}