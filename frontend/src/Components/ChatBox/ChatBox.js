import SingleChat from "../SingleChat/SingleChat";
import { Box } from "@mui/material";

const Chatbox = ({ selectedChat, fetchAgain, setFetchAgain }) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                width: "69vw",
                height: "83vh",
                margin: "auto"
            }}
        >
            <SingleChat selectedChat={selectedChat} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>
    );
};

export default Chatbox;