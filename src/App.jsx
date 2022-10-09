import React from "react";
import { NodeEditor } from "flume";
import config from "./config";
import Button from "@mui/joy/Button";
// import container
import Container from "@mui/joy/Container";
import { CssVarsProvider } from "@mui/joy/styles";
import Typography from "@mui/joy/Typography";
import Alert from "@mui/joy/Alert";
import IconButton from "@mui/joy/IconButton";
import WarningIcon from "@mui/icons-material/Warning";
import CloseIcon from "@mui/icons-material/Close";

// use effect import
import { useEffect, useRef, useState } from "react";

const App = () => {
  const nodeEditor = React.useRef();
  // json
  const [json, setJson] = React.useState(null);
  const [nodes, setNodes] = React.useState();
  const [nodesInEditor, setNodesInEditor] = useState();
  const [showNodeEditor, setShowNodeEditor] = useState(true);
  const [filename, setFilename] = useState("untitled.dlg.src");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // re render editor
  useEffect(() => {
    if (nodes !== undefined) {
      setShowNodeEditor(false);
      setTimeout(() => {
        setShowNodeEditor(true);
      }, 1);
    }
  }, [nodes]);

  const handleChange = (e) => {
    const fileReader = new FileReader();
    // get file name
    setFilename(e.target.files[0].name);
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      loadNodes(e.target.result);
    };
    fileReader.onerror = (e) => {
      console.log(e);
      // show alert
      setAlertMessage("Error loading file");
      setShowAlert(true);
    };
    fileReader.onabort = (e) => {
      console.log(e);
      // show alert
      setAlertMessage("File loading aborted");
      setShowAlert(true);
    };
  };

  const recurse_get_node = (id, nodes) => {
    const get_responses = (node, nodes) => {
      let responses = [];
      // find keys in node.inputData that contain player_response_
      if (node.type == "dialogue_event") {
        for (let key in node.inputData) {
          if (key.includes("player_response_")) {
            let output_key = key.replace("player_response_", "player_pick_");

            if (node.connections.outputs[output_key] !== undefined) {
              responses.push({
                type: "choice_response",
                text: node.inputData[key].string,
                next_node: recurse_get_node(
                  node.connections.outputs[output_key][0].nodeId,
                  nodes
                ),
              });
            } else {
              responses.push({
                type: "end_response",
                text: node.inputData[key].string,
              });
            }
          }
        }
      } else if (node.type == "dialogue_event_yes_no") {
        responses.push({
          type: "choice_response",
          text: "No",
          next_node: recurse_get_node(
            node.connections.outputs.player_pick_0[0].nodeId,
            nodes
          ),
        });
        responses.push({
          type: "choice_response",
          text: "Yes",
          next_node: recurse_get_node(
            node.connections.outputs.player_pick_1[0].nodeId,
            nodes
          ),
        });
      }

      if (responses.length === 0) {
        responses.push({
          type: "end_response",
          text: "Exit",
        });
      }

      return responses;
    };

    let node = nodes[id];
    if (node === undefined) {
      return "undefined";
    } else {
      return {
        id: node.id,
        type: "root",
        npc_text: node.inputData.npc_text.string,
        responses: get_responses(node, nodes),
      };
    }
  };

  const exportNodes = () => {
    const nodes = nodeEditor.current.getNodes();

    let node_tree = {};

    // iterate key and value
    for (const [key, value] of Object.entries(nodes)) {
      if (value.root == true) {
        node_tree = {
          id: value.id,
          npc_name: value.inputData.npc_name.string,
          type: value.type,
          responses: [
            {
              type: "none",
              next: recurse_get_node(
                value.connections.outputs.flow[0].nodeId,
                nodes
              ),
            },
          ],
        };
      }
    }

    // serialize tree
    const json = JSON.stringify(node_tree, null, 2);

    // save json to file
    const element = document.createElement("a");
    const file = new Blob([json], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename.replace(".dlg.src", ".dlg");
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const saveNodes = () => {
    const nodes = nodeEditor.current.getNodes();

    // serialize nodes as JSON
    const json = JSON.stringify(nodes, null, 2);

    // set json
    setJson(json);

    // save json to file
    const element = document.createElement("a");
    const file = new Blob([json], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const newNodes = () => {
    // show confirm dialog
    if (window.confirm("Are you sure you want to create a new file?")) {
      // set nodes to empty array
      setNodes([]);
      // set filename to untitled
      setFilename("untitled.dlg.src");

      // clear file upload
      document.getElementById("load-file").value = "";
    }
  };

  const loadNodes = (file) => {
    // parse
    let nodes_new = [];
    try {
      nodes_new = JSON.parse(file);
    } catch (e) {
      // show alert
      setAlertMessage("Error loading file! Invalid DLG file data");
      setShowAlert(true);
      return;
    }

    console.log("loading nodes");

    // load nodes
    setNodes(nodes_new);

    // clear file upload
    document.getElementById("load-file").value = "";
  };

  const openFileDialog = () => {
    document.getElementById("load-file").click();
  };

  return (
    <div style={{ height: "100%" }}>
      <div
        style={{
          zIndex: 100,
          position: "absolute",
          bottom: 15,
          right: 15,
          opacity: 0.8,
        }}
      >
        {
          // show alert
          showAlert && (
            <Alert
              startDecorator={<WarningIcon sx={{ mx: 0.5 }} />}
              variant="solid"
              color="danger"
              endDecorator={
                <IconButton
                  sx={{ ml: 1 }}
                  variant="soft"
                  size="sm"
                  color="danger"
                  onClick={() => {
                    setShowAlert(false);
                  }}
                >
                  <CloseIcon />
                </IconButton>
              }
            >
              <Typography sx={{ color: "white" }} fontWeight="md">
                {alertMessage}
              </Typography>
            </Alert>
          )
        }
      </div>
      {showNodeEditor && (
        <NodeEditor
          ref={nodeEditor}
          portTypes={config.portTypes}
          nodeTypes={config.nodeTypes}
          initialComments={[]}
          nodes={nodes}
          onChange={setNodesInEditor}
          defaultNodes={[
            {
              type: "dialogue_entry",
              x: 0,
              y: 0,
            },
          ]}
        />
      )}
      <div className="header">
        <CssVarsProvider>
          <Container sx={{ position: "fixed", top: 0 }} maxWidth="false">
            <Button
              sx={{ m: 1, float: "right" }}
              variant="solid"
              color="danger"
              onClick={newNodes}
            >
              New
            </Button>
            <Button
              sx={{ m: 1 }}
              variant="solid"
              color="success"
              onClick={saveNodes}
            >
              Save
            </Button>
            <Button
              sx={{ m: 1 }}
              variant="solid"
              color="primary"
              onClick={exportNodes}
            >
              Export
            </Button>
            <Button
              sx={{ m: 1 }}
              variant="solid"
              color="warning"
              onClick={openFileDialog}
            >
              Load
              <input
                id="load-file"
                style={{ display: "none" }}
                type="file"
                onChange={handleChange}
                accept=".dlg.src"
              />
            </Button>
            <Typography sx={{ color: "white", fontSize: 24 }}>
              Equinox Dialogue
            </Typography>
            <Typography sx={{ color: "white", fontSize: 16 }}>
              Editing {filename}
            </Typography>
          </Container>
        </CssVarsProvider>
      </div>
      <Typography
        sx={{
          color: "white",
          fontSize: 16,
          position: "absolute",
          bottom: 15,
          left: 15,
        }}
      >
        Created by{" "}
        <a target="_blank" rel="noopener noreferrer" href="https://nlaha.com">
          Nathan Laha
        </a>
      </Typography>
    </div>
  );
};

export default App;
