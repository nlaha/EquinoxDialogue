import { FlumeConfig, Colors, Controls } from "flume";

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
  );
}
