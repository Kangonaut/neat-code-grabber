import { type ManifestV3Export } from '@crxjs/vite-plugin'

export const manifest: ManifestV3Export = {
    manifest_version: 3,
    name: "NeatCode Grabber",
    description: "",
    version: "1.0",
    action: {
        default_popup: "index.html",
    },
    options_page: "src/options/index.html",
    icons: {
        16: "images/16x16.png",
        32: "images/32x32.png",
        64: "images/64x64.png",
        128: "images/128x128.png"
    },
    permissions: [
        "scripting",
        "tabs",
        "activeTab",
        "storage"
    ],
    content_scripts: [
        {
            js: ["src/content/main.ts"],
            matches: ["https://leetcode.com/*"],
        },
    ],
    host_permissions: [
        "https://*/*",
        "http://*/*"
    ],
}