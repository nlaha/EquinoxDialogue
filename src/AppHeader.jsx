import * as React from "react";
import FileOpen from "@mui/icons-material/FileOpen";
import Save from "@mui/icons-material/Save";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { Box, Divider, Grid } from "@mui/joy";
import Button from "@mui/joy/Button";
// import container
import Container from "@mui/joy/Container";
import Typography from "@mui/joy/Typography";
import Tooltip from "@mui/material/Tooltip";
import EventsModal from "./EventsModal";
import { useColorScheme } from "@mui/joy/styles";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export default function AppHeader(props) {
  const [openEventModal, setOpenEventModal] = React.useState(false);
  const { mode, setMode } = useColorScheme();

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
        onEventsChange={props.onEventsChange}
      />
      <Container sx={{ position: "fixed", top: 0 }} maxWidth="false">
        <Grid container spacing={2}>
          <Grid xs={2.5}>
            <Button
              sx={{ m: 1 }}
              variant="solid"
              color="danger"
              onClick={props.newNodes}
            >
              <NoteAddIcon />
            </Button>
            <Button
              sx={{ m: 1 }}
              variant="solid"
              color="success"
              onClick={props.saveNodes}
            >
              <Save />
            </Button>
            <Button
              sx={{ m: 1 }}
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
          </Grid>
          <Grid xs>
            <Button
              sx={{ m: 1 }}
              variant="solid"
              color="primary"
              onClick={props.exportNodes}
            >
              Export
            </Button>
            |
            <Button
              sx={{ m: 1 }}
              variant="soft"
              color="primary"
              onClick={() => setOpenEventModal(true)}
            >
              Gameplay Events
            </Button>
          </Grid>
          <Grid sx={{ float: "right" }}>
            <Button
              sx={{ m: 1 }}
              variant="soft"
              color="primary"
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
        <Typography sx={{ fontSize: 24 }}>Equinox Dialogue</Typography>
        <Typography sx={{ fontSize: 16 }}>Editing {props.filename}</Typography>
      </Container>
    </div>
  );
}