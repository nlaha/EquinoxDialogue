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
// text area
import Textarea from "@mui/joy/Textarea";
import { Box, CardContent, IconButton, List, ListItem } from "@mui/joy";
import { Add, Delete, MessageRounded } from "@mui/icons-material";
import Button from "@mui/joy/Button";
import Grid from "@mui/joy/Grid";
import { KeyboardArrowDown } from "@mui/icons-material";
import { useUpdateNodeInternals } from "reactflow";
import NodeHeader from "./Util/NodeHeader";

export default function DialogueEventNode({ data }) {
  // state for npc text
  const [npcText, setNpcText] = React.useState(data.npc_text || "");
  const [responses, setResponses] = React.useState(
    data.responses === undefined ? ["Yes", "No"] : data.responses
  );
  const [collapseResponses, setCollapseResponses] = React.useState(false);
  const updateNodeInternals = useUpdateNodeInternals();

  // run on create
  React.useEffect(() => {
    data.responses = responses;
  }, []);

  // on change for npc text
  const onChangeNpcText = (evt) => {
    setNpcText(evt.target.value);
    data.npc_text = evt.target.value;
  };

  const addResponse = () => {
    setResponses([...responses, ""]);
    data.responses = responses;
    updateNodeInternals(data.id);
  };

  const deleteResponse = (index) => {
    let array = [...responses];
    array.splice(index, 1);
    setResponses(array);
    data.responses.splice(index, 1);
    updateNodeInternals(data.id);
  };

  const onChangeResponse = (evt, index) => {
    let newResponses = [...responses];
    let newResponse = { ...newResponses[index] };
    newResponse = evt.target.value;
    newResponses[index] = newResponse;
    setResponses(newResponses);
    data.responses[index] = newResponse;
  };

  const getResponse = (index) => {
    return responses[index];
  };

  return (
    <>
      <Handle
        className="handle-z-lift"
        type="target"
        position={Position.Top}
        id="flow"
      />
      <Card className="dialogue-event">
        <NodeHeader nodeName="Dialogue Event" id={data.id} />
        <CardContent>
          <FormLabel htmlFor="npc_text">NPC Text:</FormLabel>
          <Textarea
            className="margin-bottom-one"
            minRows={3}
            placeholder="Enter NPC text here..."
            variant="soft"
            id="npc_text"
            name="npc_text"
            onChange={onChangeNpcText}
            value={npcText}
          />
          <List>
            <ListItem
              key="root"
              nested
              startAction={
                <Box>
                  <Button
                    variant="plain"
                    size="sm"
                    color="neutral"
                    onClick={() => setCollapseResponses((bool) => !bool)}
                    startDecorator={
                      <KeyboardArrowDown
                        sx={{
                          transform: collapseResponses
                            ? "initial"
                            : "rotate(-90deg)",
                        }}
                      />
                    }
                  >
                    <Typography level="h3" fontSize="md">
                      Player Responses
                    </Typography>
                  </Button>
                </Box>
              }
            />

            {collapseResponses && (
              <>
                {responses.map((response, index) => (
                  <ListItem key={index}>
                    <IconButton
                      color="danger"
                      onClick={() => deleteResponse(index)}
                    >
                      <Delete />
                    </IconButton>
                    <Textarea
                      className="margin-one"
                      placeholder="Response text..."
                      variant="soft"
                      id={`response_${index}`}
                      name={`response_${index}`}
                      onChange={(evt) => onChangeResponse(evt, index)}
                      value={getResponse(index)}
                    />
                  </ListItem>
                ))}
                <Button
                  onClick={addResponse}
                  color="primary"
                  variant="soft"
                  endDecorator={<Add />}
                >
                  Add Response
                </Button>
              </>
            )}
          </List>
        </CardContent>
        <Box className="response-handle-margin"></Box>
        <Grid container className="response_handle_container">
          {responses.map((response, index) => (
            <Grid item xs>
              <Typography textAlign="center">{response}</Typography>
              <Handle
                type="source"
                className="response-handle"
                position={Position.Bottom}
                id={`response_${index}`}
              />
            </Grid>
          ))}
        </Grid>
      </Card>
    </>
  );
}
