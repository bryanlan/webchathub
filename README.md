# simple-chat-hub

> Fork notice: This repository is a fork of https://github.com/jackyr/simple-chat-hub-extension and is not affiliated with the upstream author.

## Fork changes (this repo)
- Removes non-chatbot API calls from the extension and blocks requests to non-allowlisted hosts.
- Handles the Claude embedded sidebar issue by opening Claude in a separate tab and showing a live preview stream in the panel (desktopCapture).
- Keeps the rest of the upstream UI/features where possible; see upstream README below for general usage details.

## Upstream
Upstream project: https://github.com/jackyr/simple-chat-hub-extension

[中文Readme](https://github.com/jackyr/simple-chat-hub-extension/blob/main/README_CN.md)

### [Homepage](https://chathub.aipilot.cc/)

A browser extension aggregating numerous mainstream AI chat model platforms, supporting synchronous multi-platform chat. 

**Screenshot**
![Simple Chat Hub](https://raw.githubusercontent.com/jackyr/simple-chat-hub-extension/main/screenshots/screenshot_en.png)

**Screenshot**
![Simple Chat Hub](https://raw.githubusercontent.com/jackyr/simple-chat-hub-extension/main/screenshots/screenshot2_en.png)

### Features:
- One-click message sending to multiple platforms and synchronous receipt of replies, facilitating cross-referencing and comparison between platforms.
- Supports a wide range of popular AI model chat platforms, and also supports for customization.
- Integrates platform official websites, no need to provide API Key.
- Customizable number and order of platform windows displayed on the screen.
- Can independently operate chat sessions in each platform window.
- Custom prompt library, retrieve prompts with one click.
- Supports prompt intelligent optimization.
- Screenshot sharing, supports long screenshots.
- Supports light/dark theme switching. Supports international language switching.
- The extension does not require registration and is free to use.

### Install
- [Recommended] Install from [Chrome Web Store](https://chromewebstore.google.com/detail/dpfkgaedamhcmkkgeiajeggihmfjhhlj) / [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/simple-chat-hub/plaobjkecadfmaglmhdaolohmckjgnom)
- Download install
  1. Download the project ZIP file to your local computer and extract it to obtain the CRX file
  2. Open the Extensions page and enable "Developer mode".
    - Chrome (chrome://extensions/)
    - Edge (edge://extensions/)
  3. Drag the CRX file to the Chrome Extensions page to complete the installation

### Instructions for Use
- Please ensure that your network can access the official websites of AI model chat platforms normally.
- For platforms that require login, please complete the login operation first before opening them from the extension.

### Supported platform
ChatGPT / Copilot / Gemini / Meta / Mistral / Grok / Poe / Perplexity / You.com / Liner / Phind / Qwen / ChatGLM / DouBao / YuanBao / DeepSeek / Kimi / Ernie Bot / MetaSo ...

[Custom Config Example](https://github.com/jackyr/simple-chat-hub-extension/blob/main/CUSTOM_CONFIG_EXAMPLE.md)

### Privacy Statement
This extension will not collect or leak any of your privacy data. Chat session services are provided by platform official websites.

### Note
Due to personal time and cost limitations, not all versions of the models have been thoroughly tested. Your valuable feedback and suggestions are welcome!
