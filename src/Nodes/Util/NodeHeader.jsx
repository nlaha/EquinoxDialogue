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
        <Typography level="h2" fontSize="md" sx={{ mb: 0.5 }}>
          {props.nodeName}
        </Typography>
        <CopyNodeIdButton id={props.id} />
      </Grid>
      <Grid
        item
        sx={{
          ml: 5,
          float: "right",
        }}
      >
        {props.nodeDecorators}
      </Grid>
    </Grid>
  );
}
