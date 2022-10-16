![logo_dialogue_rounded](https://user-images.githubusercontent.com/10292944/195273482-5c61364c-3f46-4435-8977-0027c2cad988.png)

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/nlaha/EquinoxDialogue/Node.js%20CI?label=Node.js%20CI)
![GitHub issues](https://img.shields.io/github/issues/nlaha/EquinoxDialogue)
![GitHub pull requests](https://img.shields.io/github/issues-pr/nlaha/EquinoxDialogue)
![LGTM Alerts](https://img.shields.io/lgtm/alerts/github/nlaha/EquinoxDialogue)

Try it here! https://nlaha.github.io/EquinoxDialogue/

Equinox dialogue is a web-based dialogue tree builder for EquinoxEngine. It is built using React, please read the instructions below if you are a contributor.

What is "Equinox Engine"? It's something I'm working on that isn't quite ready to be open sourced yet!

# Screenshots

![Web capture_16-10-2022_142823_localhost (1)](https://user-images.githubusercontent.com/10292944/196059186-0f869758-32ab-421d-91f6-38a7b8f50e93.jpeg)
![Web capture_16-10-2022_142814_localhost](https://user-images.githubusercontent.com/10292944/196059181-70289c62-ca0b-4d7d-8f54-c8378b151e38.jpeg)

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

To build static files for production run...
```
yarn build
```

# Electron

To start the electron app in development mode run...
```
yarn electron:start
```

To package the electron app as an executable run...
```
yarn electron:package:<mac,win,linux>
```
Replacing `<mac,win,linux>` with your OS

# Sample Output
The following is sample JSON from an exported dialogue tree

```json
{
  "id": "node_0",
  "npc_name": "AI Character",
  "type": "dialogue_entry",
  "responses": [
    {
      "type": "none",
      "next": {
        "id": "node_1",
        "type": "gameplay_event",
        "responses": [
          {
            "type": "pass",
            "next_node": {
              "id": "node_2",
              "type": "dialogue_event",
              "responses": [
                {
                  "type": "end_response",
                  "text": "Yes"
                },
                {
                  "type": "choice_response",
                  "text": "No",
                  "next_node": {
                    "id": "node_3",
                    "type": "jump_node",
                    "responses": [
                      {
                        "type": "end_response",
                        "text": "Exit"
                      }
                    ],
                    "jump_to": "node_1"
                  }
                },
                {
                  "type": "choice_response",
                  "text": "Other Response",
                  "next_node": {
                    "id": "node_4",
                    "type": "gameplay_event",
                    "responses": [
                      {
                        "type": "end_response",
                        "text": "Exit"
                      }
                    ],
                    "event": "test_gameplay_event_2"
                  }
                }
              ],
              "npc_text": "This is a test dialogue node"
            }
          }
        ],
        "event": "test_gameplay_event_1"
      }
    }
  ],
  "gameplay_events": [
    "test_gameplay_event_1",
    "test_gameplay_event_2"
  ]
}
```
