// next-sitemap.config.js

/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: "https://gasskeuntopup.com",
    generateRobotsTxt: true,
    exclude: ["/server-sitemap.xml", "/admin", "/admin/*"], // <= exclude here
    robotsTxtOptions: {
        additionalSitemaps: [
            "https://gasskeuntopup.com/server-sitemap.xml", // <==== Add here
        ],
    },
};
