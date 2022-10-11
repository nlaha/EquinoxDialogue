import { FlumeConfig, Colors, Controls } from "flume";

export default function create_nodes(config) {
  return (
    config
      .addRootNodeType({
        type: "dialogue_entry",
        label: "Dialogue Entry",
        initialWidth: 170,
        inputs: (ports) => [
          ports.string({
            name: "npc_name",
            label: "NPC Name",
          }),
        ],
        outputs: (ports) => [
          ports.flow({
            name: "flow",
            label: "Flow",
          }),
        ],
      })
      // gameplay event node
      .addNodeType({
        type: "gameplay_event",
        label: "Gameplay Event",
        initialWidth: 170,
        inputs: (ports) => [
          ports.gameplay_event({
            name: "gameplay_event",
            label: "Gameplay Event",
          }),
          ports.flow({
            name: "flow",
            label: "Flow",
          }),
        ],
        outputs: (ports) => [
          ports.flow({
            name: "flow",
            label: "Flow",
          }),
        ],
      })
      .addNodeType({
        type: "metadata",
        label: "Metadata",
        description:
          "Tags a flow with metadata. This can be used in an engine for a variety of things.",
        inputs: (ports) => [
          ports.flow({
            name: "flow",
            label: "Flow",
          }),
          ports.string({
            name: "key",
            label: "Key",
          }),
          ports.string({
            name: "value",
            label: "Value",
          }),
        ],
        outputs: (ports) => [
          ports.flow({
            name: "flow",
            label: "Flow",
          }),
        ],
      })
      .addNodeType({
        type: "deep_learning",
        label: "Deep Learning",
        description:
          "Initializes a conversation with the BERT deep learning model.",
        inputs: (ports) => [
          ports.flow({
            name: "flow",
            label: "Flow",
          }),
          ports.string({
            name: "dl_initial_prompt",
            label: "Initial Prompt",
          }),
          ports.number({
            name: "num_dl_conversation_steps",
            label: "Number of AI conversation steps",
          }),
        ],
        outputs: (ports) => [
          ports.flow({
            name: "flow",
            label: "Flow",
          }),
        ],
      })
      .addNodeType({
        type: "dialogue_event_yes_no",
        label: "Dialogue Event (Yes/No)",
        description: "Represents a dialogue event with a yes/no response.",
        initialWidth: 160,
        inputs: (ports) => [
          ports.flow({
            name: "flow",
            label: "Flow",
          }),
          ports.string({
            name: "npc_text",
            label: "NPC Text",
          }),
        ],
        outputs: (ports) => [
          ports.flow({
            name: "player_pick_0",
            label: "No",
          }),
          ports.flow({
            name: "player_pick_1",
            label: "Yes",
          }),
        ],
      })
      .addNodeType({
        type: "dialogue_event",
        label: "Dialogue Event",
        description:
          "Represents a dialogue event with a number of options and NPC text",
        initialWidth: 160,
        inputs: (ports) => (data) => {
          let player_response_inputs = [];

          if (data.num_player_responses) {
            let num_player_responses = data.num_player_responses.number;

            // make player respose inputs using the number of player responses
            for (let i = 0; i < num_player_responses; i++) {
              player_response_inputs.push(
                ports.string({
                  name: `player_response_${i}`,
                  label: `Player Response ${i}`,
                })
              );
            }
          }

          return [
            ports.flow({
              name: "flow",
              label: "Flow",
            }),
            ports.string({
              name: "npc_text",
              label: "NPC Text",
            }),
            ports.number({
              name: "num_player_responses",
              label: "Number of Player Responses",
            }),
            ...player_response_inputs,
          ];
        },
        outputs: (ports) => (data, connections) => {
          let player_response_outputs = [
            ports.flow({
              name: `player_pick_none`,
              label: `Flow`,
            }),
          ];

          if (
            data.num_player_responses &&
            data.num_player_responses.number > 0
          ) {
            let num_player_responses = data.num_player_responses.number;

            player_response_outputs = [];
            // make player response outputs using the number of player responses
            for (let i = 0; i < num_player_responses; i++) {
              player_response_outputs.push(
                ports.flow({
                  name: `player_pick_${i}`,
                  label: `"${
                    (data[`player_response_${i}`] || { string: "" }).string
                  }"`,
                })
              );
            }
          }
          return [...player_response_outputs];
        },
      })
  );
}
