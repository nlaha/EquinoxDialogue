import { Button } from "@mui/joy";
import { FlumeConfig, Colors, Controls } from "flume";
// import nodes and ports
import create_nodes from "./nodes";
import create_ports from "./ports";

let config = new FlumeConfig();
config = create_ports(config); // create ports
config = create_nodes(config); // create nodes

export default config;
