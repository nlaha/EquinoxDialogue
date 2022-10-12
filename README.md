![logo_dialogue_rounded](https://user-images.githubusercontent.com/10292944/195273482-5c61364c-3f46-4435-8977-0027c2cad988.png)

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/nlaha/EquinoxDialogue/Node.js%20CI?label=Node.js%20CI)
![GitHub issues](https://img.shields.io/github/issues/nlaha/EquinoxDialogue)
![GitHub pull requests](https://img.shields.io/github/issues-pr/nlaha/EquinoxDialogue)


Equinox dialogue is a web-based dialogue tree builder for EquinoxEngine. It is built using React, please read the instructions below if you are a contributor.

What is "Equinox Engine"? It's something I'm working on that isn't quite ready to be open sourced yet!

# Screenshots

![Web capture_11-10-2022_21449_localhost](https://user-images.githubusercontent.com/10292944/195253359-f405b6f5-ea84-4045-8246-00c09984dca4.jpeg)
![Web capture_11-10-2022_214326_localhost](https://user-images.githubusercontent.com/10292944/195253374-25d80153-0e6b-4e5c-b33f-8a7d3fe599a8.jpeg)

# Usage

Build dialogue trees, when done click save or export. Save will serialize the entire tree + metadata whereas export will only export data needed by a game engine. This is tool is designed to work on a one NPC per tree system, so for each NPC you'll have a dedicated `.dlg` file. It does not currently support multiple NPCs in a single conversation.

# Roadmap
- Support for metadata conditionals (if quest completed -> unlocks dialogue subtree)
- Support for metadata
- Support for multiple NPCs in one conversation
- Autosaving
- Electron app
- Exit node
- Jump node and visible node IDs

# Building from source

I recommend using yarn but `npm run` works as well

To start a development server run...
```
yarn start
```

To build static files for production use run...
```
yarn build
```
