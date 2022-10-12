import * as React from "react";
import { Box, Card, Divider, Grid } from "@mui/joy";
import Typography from "@mui/joy/Typography";
import NodePaletteContext from "./Providers";
// list
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
// drag and drop icon
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ReactFlow, { ReactFlowProvider, useReactFlow } from "reactflow";

export default function NodePalette(props) {
  const nodeTypes = React.useContext(NodePaletteContext);
  const reactFlowInstance = useReactFlow();

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const formatNodeType = (nodeType) => {
    // capitalize each word and remove underscores
    return nodeType
      .replace(/_/g, " ")
      .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));
  };

  return (
    <Card sx={{ float: "right", width: "100%", m: 1 }}>
      <Typography level="h2" fontSize="md" sx={{ mb: 0.5 }}>
        Node Palette
      </Typography>
      <List>
        {Object.keys(nodeTypes.node_types).map((nodeType, index) => {
          return (
            <ListItem
              className="node_palette_item"
              key={nodeType}
              onDragStart={(event) => onDragStart(event, nodeType)}
              draggable
            >
              <ListItemDecorator>
                <DragIndicatorIcon />
              </ListItemDecorator>
              {formatNodeType(nodeType)}
            </ListItem>
          );
        })}
      </List>
    </Card>
  );
}
