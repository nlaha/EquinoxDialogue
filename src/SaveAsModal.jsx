import * as React from "react";
import { Transition } from "react-transition-group";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Typography from "@mui/joy/Typography";
import { FormLabel, Grid, Input, Stack } from "@mui/joy";

export default function SaveAsModal(props) {
  return (
    <Transition in={props.open} timeout={100}>
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
            <Stack spacing={2}>
              <Typography
                id="fade-modal-dialog-title"
                component="h2"
                level="inherit"
                fontSize="1.25em"
                mb="0.25em"
              >
                Save As
              </Typography>
              <FormLabel for="filename">Filename:</FormLabel>
              <Input
                id="filename"
                value={props.filename.substring(0, props.filename.length - 8)}
                onChange={(e) => {
                  props.setFilename(e.target.value + ".dlg.src");
                }}
              ></Input>
              <Stack direction="row" spacing={2}>
                <Button color="warning" onClick={(e) => props.setOpen(false)}>
                  Rename
                </Button>
                <Button onClick={props.save}>Save</Button>
              </Stack>
            </Stack>
          </ModalDialog>
        </Modal>
      )}
    </Transition>
  );
}
