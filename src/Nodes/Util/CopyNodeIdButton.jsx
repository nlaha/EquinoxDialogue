import { IconButton } from "@mui/joy";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";

export default function CopyNodeIdButton(props) {
  // copy node id to clipboard
  const copyNodeId = () => {
    navigator.clipboard.writeText(props.id);
  };

  return (
    <Button
      aria-label="Copy ID"
      variant="plain"
      size="sm"
      onClick={copyNodeId}
      endDecorator={<ContentCopyIcon />}
    >
      <Typography
        level="subtitle1"
        fontStyle="italic"
        fontSize="sm"
        sx={{ mb: 0.5 }}
      >
        ID: {props.id}
      </Typography>
    </Button>
  );
}
