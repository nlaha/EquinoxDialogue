import { useCallback } from "react";
import { Handle, Position } from "reactflow";
import * as React from "react";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
// text field
import TextField from "@mui/joy/TextField";
// label
import FormLabel from "@mui/joy/FormLabel";
import AddHomeIcon from "@mui/icons-material/AddHome";

import NodeHeader from "./Util/NodeHeader";

export default function DialogueEntryNode({ data }) {
  // state for npc name
  const [npcName, setNpcName] = React.useState(data.npc_name || "");

  const onChange = (evt) => {
    // value
    setNpcName(evt.target.value);
    // data
    data.npc_name = evt.target.value;
  };

  return (
    <>
      <Card>
        <NodeHeader
          id={data.id}
          nodeName="Dialogue Entry"
          nodeDecorators={
            <>
              <AddHomeIcon sx={{ color: "#00ff00" }} />
            </>
          }
        />
        <FormLabel htmlFor="npc_name">NPC Name:</FormLabel>
        <TextField
          variant="soft"
          id="npc_name"
          name="npc_name"
          placeholder="NPC Name..."
          onChange={onChange}
          value={npcName}
        />
      </Card>
      <Handle type="source" position={Position.Bottom} id="flow" />
    </>
  );
}
