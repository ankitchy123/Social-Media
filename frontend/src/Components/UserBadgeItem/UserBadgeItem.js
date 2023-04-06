// import { CloseIcon } from "@chakra-ui/icons";
import CloseIcon from '@mui/icons-material/Close';
import { Badge, Box } from "@mui/material";

const UserBadgeItem = ({ user, handleFunction }) => {
    return (
        <Badge
            sx={{ backgroundColor: "#805ad5", color: "white", margin: "0 3px", borderRadius: "5px", fontWeight: "500" }}
            onClick={handleFunction}
        >
            <div style={{ display: "flex", alignItems: "center", padding: "2px 5px" }}>
                {user.name}
                {/* {admin === user._id && <span> (Admin)</span>} */}
                <CloseIcon pl={1} sx={{ cursor: "pointer" }} />
            </div>
        </Badge>
    );
};

export default UserBadgeItem;