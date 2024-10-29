<!-- markdownlint-disable MD033 -->
<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/open-feature/community/0e23508c163a6a1ac8c0ced3e4bd78faafe627c7/assets/logo/horizontal/white/openfeature-horizontal-white.svg">
    <img align="center" alt="OpenFeature Logo" src="https://raw.githubusercontent.com/open-feature/community/0e23508c163a6a1ac8c0ced3e4bd78faafe627c7/assets/logo/horizontal/black/openfeature-horizontal-black.svg" />
  </picture>
</p>

<h2 align="center">OpenSocket JavaScript SDKs</h2>

[![Known Vulnerabilities](https://snyk.io/test/github/open-socket/js-sdk/badge.svg)](https://snyk.io/test/github/open-socket/js-sdk)
[![codecov](https://codecov.io/gh/open-socket/js-sdk/branch/main/graph/badge.svg?token=3DC5XOEHMY)](https://codecov.io/gh/open-socket/js-sdk)
[![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/6594/badge)](https://bestpractices.coreinfrastructure.org/projects/6594)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fopen-socket%2Fjs-sdk.svg?type=shield&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2Fopen-socket%2Fjs-sdk?ref=badge_shield&issueType=license)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fopen-socket%2Fjs-sdk.svg?type=shield&issueType=security)](https://app.fossa.com/projects/git%2Bgithub.com%2Fopen-socket%2Fjs-sdk?ref=badge_shield&issueType=security)
## 👋 Hey there! Thanks for checking out the OpenSocket JavaScript SDKs

### What is OpenSocket?

The **OpenSocket JS SDK** is a monorepo that provides JavaScript-based SDKs for building real-time, socket-based applications across multiple JavaScript frameworks and environments. With vendor-agnostic APIs, you can switch between socket providers (like Ably, Socket.IO, and Pusher) effortlessly while maintaining a consistent API.

## Overview

The `js-sdk` repository includes the following packages:

- **core**: The foundational package for OpenSocket, providing a vendor-agnostic API.
- **react**: The SDK for React applications, providing easy-to-use hooks and components.
- **next**: The SDK for Next.js applications, designed for server-side and client-side usage.
- **vanilla**: The SDK for plain JavaScript applications, allowing integration without any specific framework.
- **angular**: The SDK for Angular applications, featuring services and dependency injection for real-time communication.

## 🔧 Repository Structure

```plaintext
js-sdk/
├── packages/
│   ├── core/          # Provides the core API and Provider Interface
│   ├── react/         # SDK for React
│   ├── next/          # SDK for Next.js
│   ├── vanilla/       # SDK for Vanilla JavaScript
│   └── angular/       # SDK for Angular
```

## Installation

### Core SDK installation
```npm install @opensocket/core-js```

### React SDK installation
```npm install @opensocket/react-sdk```

### Next.js SDK installation
```npm install @opensocket/next-sdk```

### Vanilla JavaScript SDK installation
```npm install @opensocket/vanilla-sdk```

### Angular SDK installation
```npm install @opensocket/angular-sdk```

## 🤝 Contributing

Interested in contributing? Great, we'd love your help! To get started, take a look at the [CONTRIBUTING](CONTRIBUTING.md) guide.

### Thanks to everyone that has already contributed

<a href="https://github.com/open-socket/js-sdk/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=open-socket/js-sdk" />
</a>

Made with ❤

## 📜 License

[Apache License 2.0](LICENSE)

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fopen-socket%2Fjs-sdk.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fopen-socket%2Fjs-sdk?ref=badge_large)

[openfeature-website]: https://github.com/open-socket/js-sdk
