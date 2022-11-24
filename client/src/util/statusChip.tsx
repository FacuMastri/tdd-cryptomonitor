import { Chip } from "@mui/material";
import { MarketStatus } from "./fetch";

const COLORS = {
    "ALZA": "success",
    "ESTABLE": "primary",
    "BAJA": "error",
} as const;

type Props = {
    status: MarketStatus;
    className?: string;
}

const MarketStatusChip = (props: Props) => {
    return (
        <Chip
            label={props.status}
            color={COLORS[props.status]}
            size="small"
            style={{width: "80px"}}
            className={props.className}
        />
    )
}
export default MarketStatusChip;