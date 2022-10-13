import React from "react";
import { CssVarsProvider } from "@mui/joy/styles";

import Typography from "@mui/joy/Typography";
import Alert from "@mui/joy/Alert";
import IconButton from "@mui/joy/IconButton";
import WarningIcon from "@mui/icons-material/Warning";
import CloseIcon from "@mui/icons-material/Close";
import AppHeader from "./AppHeader";
import Box from "@mui/joy/Box";
// use memo
import { useMemo } from "react";

// import nodes
import DialogueEntryNode from "./Nodes/DialogueEntry";
import DialogueEventNode from "./Nodes/DialogueEvent";
import GameplayEventNode from "./Nodes/GameplayEvent";
import JumpNode from "./Nodes/JumpNode";

// providers
import { NodePaletteProvider } from "./Providers";
import { GlobalDataProvider } from "./Providers";

// use effect import
import { useEffect, useRef, useState } from "react";
import { Chip, Divider } from "@mui/joy";

// react flow imports
import { useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";
// 👇 you need to import the reactflow styles
import "reactflow/dist/style.css";

const initialEdges = [];

const initialNodes = [];

// create global contexts
export const NodePaletteContext = React.createContext({ node_types: {} });

const App = () => {
  // json
  const [json, setJson] = React.useState(null);
  const [nodesInEditor, setNodesInEditor] = useState();
  const [showNodeEditor, setShowNodeEditor] = useState(true);
  const [filename, setFilename] = useState("untitled.dlg.src");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [gameplayEvents, setGameplayEvents] = useState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { setViewport } = useReactFlow();

  const getId = (node_count) => {
    // increment id
    console.log("incrementing id: " + node_count);
    return `node_${node_count}`;
  };

  // define node types
  const nodeTypes = useMemo(
    () => ({
      dialogue_entry: DialogueEntryNode,
      dialogue_event: DialogueEventNode,
      gameplay_event: GameplayEventNode,
      jump_node: JumpNode,
    }),
    []
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const id = getId(reactFlowInstance.getNodes().length);
      const newNode = {
        id: id,
        type,
        position,
        data: { id: id },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const onGameplayEventsChange = (events) => {
    setGameplayEvents(events);
  };

  const onFileChange = (e) => {
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

  const recurseTree = (id, node_obj) => {
    const get_responses = (root_id, node_obj) => {
      // get node
      const root_node = node_obj["nodes"].find((node) => node.id === root_id);
      let responses = [];

      if (root_node.type === "dialogue_event") {
        let index = 0;
        root_node.data.responses.forEach((response) => {
          // get edge that connects to this response
          const edge = node_obj["edges"].find(
            (edge) =>
              edge.sourceHandle === `response_${index}` &&
              edge.source === root_id
          );

          if (edge !== undefined) {
            // get node that the edge connects to
            const target_node = node_obj["nodes"].find(
              (node) => node.id === edge.target
            );

            if (target_node !== undefined) {
              responses.push({
                type: "choice_response",
                text: response,
                next_node: recurseTree(target_node.id, node_obj),
              });
            } else {
              responses.push({
                type: "end_response",
                text: response,
              });
            }
          } else {
            responses.push({
              type: "end_response",
              text: response,
            });
          }

          index++;
        });
      } else if (root_node.type === "gameplay_event") {
        // get the output edge
        const edge = node_obj["edges"].find(
          (edge) => edge.source === root_node.id
        );

        if (edge !== undefined) {
          const next_node_id = edge.target;

          responses.push({
            type: "pass",
            next_node: recurseTree(next_node_id, node_obj),
          });
        } else {
          responses.push({
            type: "end_response",
            text: "Exit",
          });
        }
      }

      if (responses.length === 0) {
        responses.push({
          type: "end_response",
          text: "Exit",
        });
      }

      return responses;
    };

    const root_node = node_obj["nodes"].find((node) => node.id === id);
    if (root_node === undefined) {
      return "undefined";
    } else {
      let new_node = {
        id: root_node.id,
        type: root_node.type,
        responses: get_responses(root_node.id, node_obj),
      };

      if (new_node.type === "dialogue_event") {
        new_node.npc_text = root_node.data.npc_text;
      }
      if (new_node.type === "gameplay_event") {
        new_node.event = root_node.data.event;
      }
      if (new_node.type === "jump_node") {
        new_node.jump_to = root_node.data.jump;
      }

      return new_node;
    }
  };

  const findOutputs = (id, node_obj) => {
    let outputs = [];
    node_obj["edges"].forEach((edge) => {
      if (edge.source === id) {
        outputs.push(edge.target);
      }
    });
    return outputs;
  };

  const exportNodes = () => {
    let node_obj = reactFlowInstance.toObject();
    let node_tree = {};
    // iterate key and value
    for (const [key, value] of Object.entries(node_obj["nodes"])) {
      if (value.type == "dialogue_entry") {
        node_tree = {
          id: value.id,
          npc_name: value.data.npc_name,
          type: value.type,
          responses: [
            {
              type: "none",
              next: recurseTree(findOutputs(value.id, node_obj)[0], node_obj),
            },
          ],
        };
      }
    }

    node_tree["gameplay_events"] = gameplayEvents;

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
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();

      flow["gameplay_events"] = gameplayEvents;

      // serialize nodes as JSON
      const json = JSON.stringify(flow, null, 2);
      // set json
      setJson(json);
      // save json to file
      const element = document.createElement("a");
      const file = new Blob([json], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = filename;
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
    }
  };

  const loadNodes = (json) => {
    const restoreFlow = async () => {
      const flow = JSON.parse(json);

      // clear nodes
      setNodes([]);
      setEdges([]);

      if (flow) {
        // check if gameplay events are present
        if (flow["gameplay_events"] !== undefined) {
          onGameplayEventsChange(flow.gameplay_events);
        }

        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };

    restoreFlow();
    document.getElementById("load-file").value = "";
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

  const openFileDialog = () => {
    document.getElementById("load-file").click();
  };

  return (
    <CssVarsProvider>
      <GlobalDataProvider value={{ gameplay_events: gameplayEvents }}>
        <NodePaletteProvider value={{ node_types: nodeTypes }}>
          <div style={{ height: "100%" }} ref={reactFlowWrapper}>
            <div
              style={{
                pointerEvents: "auto",
                zIndex: 200,
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
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                zoomOnDoubleClick={false}
                deleteKeyCode="Delete"
                fitView
              >
                <Controls />
                <Background />
              </ReactFlow>
            )}
            <AppHeader
              newNodes={newNodes}
              saveNodes={saveNodes}
              openFileDialog={openFileDialog}
              exportNodes={exportNodes}
              onFileChange={onFileChange}
              filename={filename}
              onEventsChange={onGameplayEventsChange}
            />
            <Typography
              className="footer"
              sx={{
                fontSize: 16,
                position: "absolute",
                bottom: 15,
                left: 65,
              }}
            >
              Created by{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://nlaha.com"
              >
                Nathan Laha
              </a>
            </Typography>
          </div>
        </NodePaletteProvider>
      </GlobalDataProvider>
    </CssVarsProvider>
  );
};

export default App;
