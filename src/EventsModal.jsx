import * as React from "react";
import { Transition } from "react-transition-group";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Typography from "@mui/joy/Typography";
// delete icon
import DeleteIcon from "@mui/icons-material/Delete";
// list
import List from "@mui/joy/List";
// list item
import ListItem from "@mui/joy/ListItem";
import { Grid, TextField } from "@mui/joy";

export default function EventsModal(props) {
  // events storage
  const [events, setEvents] = React.useState(props.events);
  const [event, setEvent] = React.useState("");

  // set events when props.events changes
  React.useEffect(() => {
    setEvents(props.events);
  }, [props.events]);

  function handleChange(event) {
    // track input field's state
    setEvent(event.target.value);
  }

  function handleAdd() {
    if (event !== "") {
      // add item
      setEvents([...events, event]);
      // clear input field
      setEvent("");

      props.onEventsChange([...events, event]);
    }
  }

  function handleDelete(index) {
    // delete item
    const newEvents = events.filter((item, i) => i !== index);
    setEvents(newEvents);

    props.onEventsChange(events);
  }

  return (
    <Transition in={props.open} timeout={400}>
      {(state) => (
        <Modal
          keepMounted
          open={!["exited", "exiting"].includes(state)}
          onClose={() => props.setOpen(false)}
          componentsProps={{
            backdrop: {
              sx: {
                opacity: 0,
                backdropFilter: "none",
                transition: `opacity 400ms, backdrop-filter 400ms`,
                ...{
                  entering: { opacity: 1 },
                  entered: { opacity: 1 },
                }[state],
              },
            },
          }}
          sx={{
            visibility: state === "exited" ? "hidden" : "visible",
          }}
        >
          <ModalDialog
            aria-labelledby="fade-modal-dialog-title"
            aria-describedby="fade-modal-dialog-description"
            sx={{
              opacity: 0,
              transition: `opacity 300ms`,
              ...{
                entering: { opacity: 1 },
                entered: { opacity: 1 },
              }[state],
            }}
          >
            <Typography
              id="fade-modal-dialog-title"
              component="h2"
              level="inherit"
              fontSize="1.25em"
              mb="0.25em"
            >
              Gameplay Events
            </Typography>
            <Typography
              id="fade-modal-dialog-description"
              textColor="text.tertiary"
            >
              Define events here, these can be used to trigger actions in the
              game based on the player's responses.
            </Typography>
            <List>
              {events.map((event, index) => (
                <ListItem
                  className="margin-one"
                  key={index}
                  endAction={
                    <Button
                      color="danger"
                      variant="soft"
                      onClick={() => {
                        handleDelete(index);
                      }}
                    >
                      <DeleteIcon />
                    </Button>
                  }
                >
                  {event}
                </ListItem>
              ))}
            </List>
            <Grid container spacing={2}>
              <Grid item xs>
                <TextField
                  placeholder="Event name..."
                  onChange={handleChange}
                  value={event}
                  onKeyPress={(ev) => {
                    if (ev.key === "Enter") {
                      handleAdd();
                      ev.preventDefault();
                    }
                  }}
                ></TextField>
              </Grid>
              <Grid item xs>
                <Button onClick={handleAdd}>Add Event</Button>
              </Grid>
            </Grid>
          </ModalDialog>
        </Modal>
      )}
    </Transition>
  );
}
