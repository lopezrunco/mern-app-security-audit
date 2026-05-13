const Joi = require('joi');

const youtubeUrlSchema = Joi
    .string()
    .optional()
    .allow('', null)
    .custom((value, helpers) => {
        if (value === '' || value === null) return value;
        
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?v%3D|watch%3Fv%3D|watch\/\S+\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})(\S+)?$/;

        if (!youtubeRegex.test(value)) {
            // Check for additional YouTube URL patterns.
            const additionalPatterns = [
                /https:\/\/www\.youtube\.com\/live\/([^"?]+)/, // Live stream URL
                /https:\/\/www\.youtube\.com\/watch\?v=([^"&?/]+)&t=\d+S/, // Live stream URL with timestamp
                /https:\/\/m\.youtube\.com\/live\/([^"?]+)/, // Mobile live stream URL
                /https:\/\/www\.youtube\.com\/embed\/([^"?]+)/, // Embed URL
                /https:\/\/www\.youtube\.com\/watch\?v=([^"&?/]+)/, // Long URL
                /https:\/\/m\.youtube\.com\/watch\?v=([^"&?/]+)/, // Mobile URL
                /https:\/\/youtu\.be\/([^"&?/]+)/ // Short URL
            ];

            for (const pattern of additionalPatterns) {
                if (pattern.test(value)) {
                    return value; // Valid URL found
                }
            }

            return helpers.error('any.invalid'); // No valid pattern found
        }

        return value;
    }, 'Youtube url validation.');

module.exports = youtubeUrlSchema;