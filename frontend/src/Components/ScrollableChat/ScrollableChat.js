import { Avatar, Tooltip } from "@mui/material";
import { useSelector } from "react-redux";
import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser, } from "../../config/ChatLogics";

const ScrollableChat = ({ messages }) => {
    const { user, loading: userLoading } = useSelector((state) => state.user)

    return (
        <ScrollableFeed>
            {messages &&
                messages.map((m, i) => (
                    <div style={{ display: "flex" }} key={m._id}>
                        {(isSameSender(messages, m, i, user._id) ||
                            isLastMessage(messages, i, user._id)) && (
                                <Tooltip title={m.sender.name} placement="bottom-start">
                                    <Avatar
                                        sx={{
                                            marginTop: "7px",
                                            marginRight: 0.7,
                                            cursor: "pointer",
                                            width: "30px",
                                            height: "30px"
                                        }}
                                        // mt="7px"
                                        // mr={1}
                                        // size="sm"
                                        name={m.sender.name}
                                        src={m.sender.avatar.url}
                                    />
                                </Tooltip>
                            )}
                        <span
                            style={{
                                backgroundColor: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"}`,
                                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                                borderRadius: "20px",
                                padding: "5px 15px",
                                maxWidth: "75%",
                            }}
                        >
                            {m.content}
                        </span>
                    </div>
                ))}
        </ScrollableFeed>
    );
};
export default ScrollableChat;