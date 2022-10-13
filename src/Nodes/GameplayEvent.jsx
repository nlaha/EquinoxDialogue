import { useCallback } from "react";
import { Handle, Position } from "reactflow";
import * as React from "react";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
// text field
import TextField from "@mui/joy/TextField";
// label
import FormLabel from "@mui/joy/FormLabel";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import { Option, Select } from "@mui/joy";

import { GlobalDataContext } from "../Providers";

import NodeHeader from "./Util/NodeHeader";

export default function DialogueEntryNode({ data }) {
  const [event, setEvent] = React.useState(data.event || "");
  const globalData = React.useContext(GlobalDataContext);

  const onChange = useCallback((evt) => {
    console.log(evt.target.innerText);
    setEvent(evt.target.innerText);
    data.event = evt.target.innerText;
  }, []);

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        id="flow"
        className="handle-z-lift"
      />
      <Card sx={{ minWidth: "200px" }}>
        <NodeHeader
          id={data.id}
          nodeName="Trigger Gameplay Event"
          nodeDecorators={
            <>
              <DirectionsRunIcon sx={{ color: "#ff0646" }} />
            </>
          }
        />
        <FormLabel htmlFor="select_event">Event:</FormLabel>
        <Select
          id="select_event"
          value={event}
          onChange={onChange}
          placeholder="Select an event..."
        >
          {globalData.gameplay_events.map((event, index) => (
            <Option key={index} value={event}>
              {event}
            </Option>
          ))}
        </Select>
      </Card>
      <Handle type="source" position={Position.Bottom} id="flow" />
    </>
  );
}
