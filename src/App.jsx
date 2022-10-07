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
  const [filename, setFilename] = useState("untitled.dlg");
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
      setFilename("untitled.dlg");

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
              color="warning"
              onClick={openFileDialog}
            >
              Load
              <input
                id="load-file"
                style={{ display: "none" }}
                type="file"
                onChange={handleChange}
                accept=".dlg"
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
