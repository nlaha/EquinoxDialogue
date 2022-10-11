import { FlumeConfig, Colors, Controls } from "flume";

import GameplayEventsSelector from "./GameplayEventsSelector";

export default function create_ports(config) {
  return (
    config
      .addPortType({
        type: "string",
        name: "string",
        label: "Text",
        color: Colors.green,
        controls: [
          Controls.text({
            name: "string",
            label: "Text",
          }),
        ],
      })
      // add number port
      .addPortType({
        type: "number",
        name: "number",
        label: "Number",
        color: Colors.blue,
        controls: [
          Controls.number({
            name: "number",
            label: "Number",
          }),
        ],
      })
      // add flow port
      .addPortType({
        type: "flow",
        name: "flow",
        label: "Flow",
        color: Colors.pink,
        controls: [],
      })
      // add gameplay event control
      .addPortType({
        type: "gameplay_event",
        name: "gameplay_event",
        label: "Gameplay Event",
        color: Colors.yellow,
        controls: [
          // select
          Controls.custom({
            name: "gameplay_event",
            label: "Gameplay Event",
            render: (data, onChange) => {
              return <GameplayEventsSelector data={data} onChange={onChange} />;
            },
          }),
        ],
      })
  );
}
