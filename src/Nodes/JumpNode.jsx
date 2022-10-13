import { useCallback } from "react";
import { Handle, Position } from "reactflow";
import * as React from "react";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
// text field
import TextField from "@mui/joy/TextField";
// label
import FormLabel from "@mui/joy/FormLabel";
import MoveUpIcon from "@mui/icons-material/MoveUp";
import { Option, Select } from "@mui/joy";
import NodeHeader from "./Util/NodeHeader";
import Box from "@mui/joy/Box";

export default function JumpNode({ data }) {
  const [jump, setJump] = React.useState(data.jump || "");

  const onChange = useCallback((evt) => {
    // value
    setJump(evt.target.value);
    // data
    data.jump = evt.target.value;
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
          nodeName="Jump to Node"
          nodeDecorators={
            <>
              <MoveUpIcon sx={{ color: "#ff7000" }} />
            </>
          }
        />
        <FormLabel htmlFor="jump">Node ID:</FormLabel>
        <TextField
          variant="soft"
          id="jump"
          name="jump"
          placeholder="Node ID..."
          onChange={onChange}
          value={jump}
        />
      </Card>
    </>
  );
}
