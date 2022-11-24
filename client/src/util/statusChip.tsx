import { Chip } from "@mui/material";
import { MarketStatus } from "./fetch";

const COLORS = {
    "ALZA": "success",
    "ESTABLE": "primary",
    "BAJA": "error",
} as const;

const MarketStatusChip = ({ status }: { status: MarketStatus }) => {
    return (
        <Chip
            label={status}
            color={COLORS[status]}
            size="small"
            style={{width: "80px"}}
        />
    )
}
export default MarketStatusChip;