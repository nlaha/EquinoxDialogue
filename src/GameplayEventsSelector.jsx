import { globalGameplayEvents } from "./App";
import { Option, Select } from "@mui/joy";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
// use state
import { useState } from "react";

const GameplayEventsSelector = ({ data, onChange }) => {
  const [selectedEvent, setSelectedEvent] = useState("");

  const handleChange = (event) => {
    console.log(event.target.value);
    setSelectedEvent(event.target.value);
  };

  return (
    <Box>
      <Typography variant="label">Gameplay Event</Typography>
      <Select value={selectedEvent} onChange={handleChange}>
        {globalGameplayEvents.map((gameplayEvent) => {
          return <Option value={gameplayEvent}>{gameplayEvent}</Option>;
        })}
      </Select>
    </Box>
  );
};

export default GameplayEventsSelector;
