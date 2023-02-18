import * as React from "react";
import FileOpen from "@mui/icons-material/FileOpen";
import Save from "@mui/icons-material/Save";
import SaveAs from "@mui/icons-material/SaveAs";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { Box, Card, Divider, Grid } from "@mui/joy";
import Button from "@mui/joy/Button";
// import container
import Container from "@mui/joy/Container";
import Typography from "@mui/joy/Typography";
import Tooltip from "@mui/material/Tooltip";
import EventsModal from "./EventsModal";
import SaveAsModal from "./SaveAsModal";
import { useColorScheme } from "@mui/joy/styles";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import NodePalette from "./NodePalette";
import { GlobalDataContext } from "./Providers";

export default function AppHeader(props) {
  const [openEventModal, setOpenEventModal] = React.useState(false);
  const [openSaveAsModal, setOpenSaveAsModal] = React.useState(false);
  const { mode, setMode } = useColorScheme();
  const globalData = React.useContext(GlobalDataContext);

  // run once
  React.useEffect(() => {
    // set mode
    setMode("dark");
    // set class to dark-theme on root
    document.documentElement.classList.add("dark-theme");
  }, []);

  return (
    <div className="header">
      <EventsModal
        open={openEventModal}
        setOpen={setOpenEventModal}
        events={globalData.gameplay_events}
        onEventsChange={props.onEventsChange}
      />
      <SaveAsModal
        open={openSaveAsModal}
        setOpen={setOpenSaveAsModal}
        filename={props.filename}
        setFilename={props.setFilename}
        save={props.saveNodes}
      />
      <Container className="app-header-container" maxWidth="false">
        <Grid container spacing={2} justifyContent="flex-start" flexWrap="wrap">
          <Grid xs={8} item container>
            <Grid item>
              <Button
                className="margin-one"
                variant="solid"
                color="danger"
                onClick={props.newNodes}
              >
                <NoteAddIcon />
              </Button>
              <Button
                className="margin-one"
                variant="solid"
                color="success"
                onClick={props.saveNodes}
              >
                <Save />
              </Button>
              <Button
                className="margin-one"
                variant="solid"
                color="info"
                onClick={() => setOpenSaveAsModal(true)}
              >
                <SaveAs />
              </Button>
              <Button
                className="margin-one"
                variant="solid"
                color="warning"
                onClick={props.openFileDialog}
              >
                <FileOpen />
                <input
                  id="load-file"
                  style={{ display: "none" }}
                  type="file"
                  onChange={props.onFileChange}
                  accept=".dlg.src"
                />
              </Button>
              <Typography sx={{ fontSize: 24 }}>Equinox Dialogue</Typography>
              <Typography sx={{ fontSize: 16 }}>
                Editing {props.filename}
              </Typography>
            </Grid>
            <Grid xs item>
              <Button
                className="margin-one"
                variant="solid"
                color="primary"
                onClick={props.exportNodes}
              >
                Export
              </Button>
              |
              <Button
                className="margin-one"
                variant="soft"
                color="neutral"
                onClick={() => setOpenEventModal(true)}
              >
                Gameplay Events
              </Button>
            </Grid>
          </Grid>
          <Grid xs item>
            <NodePalette />
            <Button
              className="margin-one float-right"
              variant="soft"
              color="neutral"
              onClick={() => {
                // add .dark-theme to root element
                document.documentElement.classList.toggle("dark-theme");
                setMode(mode === "dark" ? "light" : "dark");
              }}
            >
              {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </Button>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
