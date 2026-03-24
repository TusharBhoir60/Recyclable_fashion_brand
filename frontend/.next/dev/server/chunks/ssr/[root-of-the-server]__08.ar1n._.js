module.exports = [
"[externals]/node:fs [external] (node:fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs", () => require("node:fs"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[externals]/react-dom [external] (react-dom, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react-dom", () => require("react-dom"));

module.exports = mod;
}),
"[project]/OneDrive/Desktop/RFA/Recyclable_fashion_brand/frontend/pages/[[...slug]].tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LegacyPage,
    "getServerSideProps",
    ()=>getServerSideProps
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs [external] (node:fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$RFA$2f$Recyclable_fashion_brand$2f$frontend$2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/RFA/Recyclable_fashion_brand/frontend/node_modules/next/head.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$RFA$2f$Recyclable_fashion_brand$2f$frontend$2f$node_modules$2f$next$2f$script$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/RFA/Recyclable_fashion_brand/frontend/node_modules/next/script.js [ssr] (ecmascript)");
;
;
;
;
;
const routeToHtmlFile = {
    "": "index.html",
    login: "login.html",
    signup: "signup.html",
    dashboard: "dashboard.html",
    shop: "shop.html",
    sell: "sell.html",
    orders: "orders.html",
    profile: "profile.html",
    cart: "cart.html",
    checkout: "checkout.html",
    "seller-dashboard": "seller-dashboard.html",
    "product-detail": "product-detail.html",
    "admin/dashboard": "admin/dashboard.html",
    "admin/manage-users": "admin/manage-users.html",
    "admin/manage-products": "admin/manage-products.html",
    "admin/manage-orders": "admin/manage-orders.html",
    "admin/earnings": "admin/earnings.html",
    "admin/reviews": "admin/reviews.html"
};
function parseLegacyHtml(fullHtml) {
    const titleMatch = fullHtml.match(/<title>([\s\S]*?)<\/title>/i);
    const bodyMatch = fullHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const body = bodyMatch ? bodyMatch[1] : fullHtml;
    const inlineScripts = [];
    const bodyWithoutScripts = body.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, (_match, scriptContent)=>{
        if (scriptContent && scriptContent.trim()) {
            inlineScripts.push(scriptContent);
        }
        return "";
    });
    return {
        title: titleMatch ? titleMatch[1].trim() : "GreenThreads",
        bodyHtml: bodyWithoutScripts,
        inlineScripts
    };
}
const getServerSideProps = async (context)=>{
    const slugParts = context.params?.slug ?? [];
    const routeKey = slugParts.join("/");
    const htmlFile = routeToHtmlFile[routeKey];
    if (!htmlFile) {
        return {
            notFound: true
        };
    }
    const htmlPath = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(process.cwd(), htmlFile);
    const fileContents = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].readFileSync(htmlPath, "utf-8");
    return {
        props: parseLegacyHtml(fileContents)
    };
};
function LegacyPage({ title, bodyHtml, inlineScripts }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$RFA$2f$Recyclable_fashion_brand$2f$frontend$2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("title", {
                    children: title
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/RFA/Recyclable_fashion_brand/frontend/pages/[[...slug]].tsx",
                    lineNumber: 82,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/RFA/Recyclable_fashion_brand/frontend/pages/[[...slug]].tsx",
                lineNumber: 81,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("main", {
                dangerouslySetInnerHTML: {
                    __html: bodyHtml
                }
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/RFA/Recyclable_fashion_brand/frontend/pages/[[...slug]].tsx",
                lineNumber: 84,
                columnNumber: 7
            }, this),
            inlineScripts.map((scriptText, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$RFA$2f$Recyclable_fashion_brand$2f$frontend$2f$node_modules$2f$next$2f$script$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                    id: `legacy-inline-${index}`,
                    strategy: "afterInteractive",
                    dangerouslySetInnerHTML: {
                        __html: scriptText
                    }
                }, `legacy-inline-${index}`, false, {
                    fileName: "[project]/OneDrive/Desktop/RFA/Recyclable_fashion_brand/frontend/pages/[[...slug]].tsx",
                    lineNumber: 86,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__08.ar1n._.js.map