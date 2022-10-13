import { Box, Typography } from "@mui/joy";
import CopyNodeIdButton from "./CopyNodeIdButton";
import Grid from "@mui/joy/Grid";

export default function NodeHeader(props) {
  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
    >
      <Grid item xs>
        <Typography level="h2" fontSize="md" className="margin-bottom-half">
          {props.nodeName}
        </Typography>
        <CopyNodeIdButton id={props.id} />
      </Grid>
      <Grid item className="node-decorator-container">
        {props.nodeDecorators}
      </Grid>
    </Grid>
  );
}
