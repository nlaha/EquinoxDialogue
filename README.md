![logo_dialogue_rounded](https://user-images.githubusercontent.com/10292944/194968131-6b2f5ad0-f653-450c-9f19-a643aeb3158b.png)

Equinox dialogue is a web-based dialogue tree builder for EquinoxEngine. It is built using React, please read the instructions below if you are a contributor.

What is "Equinox Engine"? It's something I'm working on that isn't quite ready to be open sourced yet!

# Screenshots

![image](https://user-images.githubusercontent.com/10292944/194968612-27b5dcdd-5b97-456a-8f1e-b8d3cdb524f5.png)

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
