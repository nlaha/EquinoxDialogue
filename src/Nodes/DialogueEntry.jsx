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

const handleStyle = { left: 10 };

export default function DialogueEntryNode({ data }) {
  // state for npc name
  const [npcName, setNpcName] = React.useState(data.npc_name || "");

  const onChange = useCallback((evt) => {
    setNpcName(evt.target.value);
    data.npc_name = evt.target.value;
  }, []);

  return (
    <>
      <Card>
        <Typography level="h2" fontSize="md" sx={{ mb: 0.5 }}>
          Dialogue Entry
        </Typography>
        <AddHomeIcon
          sx={{
            position: "absolute",
            top: "0.5rem",
            right: "0.5rem",
            color: "#00ff00",
          }}
        />
        <FormLabel htmlFor="npc_name">NPC Name:</FormLabel>
        <TextField
          variant="soft"
          id="npc_name"
          name="npc_name"
          onChange={onChange}
          value={npcName}
        />
      </Card>
      <Handle type="source" position={Position.Bottom} id="flow" />
    </>
  );
}
