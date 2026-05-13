export const getYoutubeId = (code) => {
    // check if code is an URL or an iFrame
    if (code.startsWith("http")) {
        return getYoutubeUrlId(code);
    } else if (code.startsWith("<iframe")) {
        return getYoutubeIframe(code);
    } else {
        console.error("The code is neither a Youtube URL or iFrame or is empty.");
        return undefined;
    }

    function getYoutubeUrlId(url) {
        const regExp =
            /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : undefined;
    }
    function getYoutubeIframe(iframeCode) {
        const regex = /embed\/([A-Za-z0-9_-]+)/;
        const match = regex.exec(iframeCode);
        return match && match[1] ? match[1] : undefined
    }
};