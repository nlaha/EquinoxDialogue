import { Box, Typography, List, ListItem, Button, Textarea } from "@mui/joy";
import CopyNodeIdButton from "./CopyNodeIdButton";
import Grid from "@mui/joy/Grid";
import * as React from "react";

import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown"

export default function NodeHeader(props) {
  const [collapseMeta, setCollapseMeta] = React.useState(false);


  return (
    <Box>
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
                onClick={() => setCollapseMeta((bool) => !bool)}
                startDecorator={
                  <KeyboardArrowDown
                    sx={{
                      transform: collapseMeta
                        ? "initial"
                        : "rotate(-90deg)",
                    }}
                  />
                }
              >
                <Typography level="h3" fontSize="md">
                  Metadata
                </Typography>
              </Button>
            </Box>
          }
        />
        {collapseMeta ?
          <ListItem>
            <Textarea
                className="margin-one"
                placeholder="Metadata..."
                variant="soft"
              />
          </ListItem>
          :
          <></>
        }
      </List>
    </Box>
  );
}
