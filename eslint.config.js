const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
    js.configs.recommended,
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: 12,
            sourceType: "commonjs",
            globals: {
                ...globals.node,
                ...globals.jest,
                ...globals.browser
            }
        },
        rules: {
            "no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_", "caughtErrorsIgnorePattern": "^_" }],
            "no-console": "off"
        }
    },
    {
        ignores: ["coverage/", "dist/"]
    }
];
