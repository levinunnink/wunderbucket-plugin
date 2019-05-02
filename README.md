# 🔌 Wunderbucket Plugins

Further documentation forthcoming.

# Hooks

## convert()

## processAsset()

## process()

# Plugins

Plugin | Hook | Description
------|--------|-----------
[wunderbucket-html-mimifier](/example-plugins/html-mimifier) | `process()` | Mimifies the processed HTML file for faster loading
[wunderbucket-open-graph-builder](/example-plugins/open-graph-builder) | `process()` | Adds open graph tags to the HTML and if they don't already exist
[wunderbucket-pdf2html](/example-plugins/pdf2html) | `convert()` | Converts PDF files to HTML to be processed by Wunderbucket
[wunderbucket-base64-image-encoder](/example-plugins/base64image-encoder) | `processAsset()` | Base64 encodes and embeds images into the HTML to improve performance