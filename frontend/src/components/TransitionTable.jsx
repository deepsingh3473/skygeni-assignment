import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

const TransitionTable = ({ data, isACV = false }) => {
  if (!data || data.length === 0) {
    return <Typography>No data available</Typography>;
  }

  const totalLost = data.reduce(
    (sum, stage) => sum + ((isACV ? stage.acvLost : stage.lost) || 0),
    0
  );

  const formatValue = (value, isPercentage = false) => {
    if (value == null) return "-";
    if (isPercentage) return `${value}%`;
    return isACV ? Math.round(value).toLocaleString() : value.toLocaleString();
  };

  return (
    <TableContainer
      component={Paper}
      elevation={3}
      sx={{
        width: "100%",
        overflowX: "auto",
        mb: 2,
        "& .MuiTableCell-root": {
          whiteSpace: "nowrap",
          borderRight: "1px solid rgba(224, 224, 224, 1)",
          "&:last-child": {
            borderRight: "none",
          },
        },
      }}
    >
      <Table size="small" sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ height: "60px" }}>
            <TableCell
              sx={{
                fontWeight: "bold",
                borderRight: "1px solid rgba(224, 224, 224, 1)",
              }}
            >
              Stage
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                borderRight: "1px solid rgba(224, 224, 224, 1)",
              }}
              align="center"
            >
              Came to Stage
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                backgroundColor: "#f44336",
                color: "#fff",
                borderRight: "1px solid rgba(224, 224, 224, 1)",
              }}
              align="center"
            >
              Lost / Disqualified <br />
              from Stage
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                backgroundColor: "#4caf50",
                color: "#fff",
                borderRight: "1px solid rgba(224, 224, 224, 1)",
              }}
              align="center"
            >
              Moved to next <br /> Stage
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="center">
              Win Rate %
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((stage) => (
            <TableRow key={stage.label}>
              <TableCell>{stage.label}</TableCell>
              <TableCell
                align="right"
                sx={{
                  backgroundColor:
                    stage.label === "Won" ? "#4caf50" : "inherit",
                  color: stage.label === "Won" ? "#fff" : "inherit",
                }}
              >
                {formatValue(isACV ? stage.acv : stage.count)}
              </TableCell>
              <TableCell align="right">
                {formatValue(isACV ? stage.acvLost : stage.lost)}
              </TableCell>
              <TableCell align="right">
                {formatValue(
                  isACV ? stage.acvMovedForward : stage.movedForward
                )}
              </TableCell>
              <TableCell align="right">
                {formatValue(isACV ? stage.acvWinRate : stage.winRate, true)}
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
            <TableCell align="right">-</TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              {formatValue(totalLost)}
            </TableCell>
            <TableCell align="right">-</TableCell>
            <TableCell align="right">-</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TransitionTable;
