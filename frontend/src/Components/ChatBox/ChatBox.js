import useMediaQuery from '@mui/material/useMediaQuery';
import SingleChat from "../SingleChat/SingleChat";
import { Box } from "@mui/material";

const Chatbox = ({ selectedChat, setSelectedChat, fetchAgain, setFetchAgain }) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                width: "69vw",
                height: "83vh",
                margin: "auto",
            }}
        >
            <SingleChat selectedChat={selectedChat} setSelectedChat={setSelectedChat} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>
    );
};

export default Chatbox;