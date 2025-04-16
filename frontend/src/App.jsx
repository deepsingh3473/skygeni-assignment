import React, { useState, useEffect } from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import axios from "axios";
import PipelineVisualization from "./components/PipelineVisualization";
import TransitionTable from "./components/TransitionTable";

const App = () => {
  const [pipelineData, setPipelineData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/data");
        setPipelineData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Skygeni Assignment
      </Typography>

      {/* Visualizations Row */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "24px",
          width: "100%",
        }}
      >
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <PipelineVisualization
            data={pipelineData}
            metricType="count"
            isLoading={loading}
            error={error}
          />
        </Box>
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <PipelineVisualization
            data={pipelineData}
            metricType="acv"
            isLoading={loading}
            error={error}
          />
        </Box>
      </Box>

      {/* Tables Row */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "24px",
          width: "100%",
        }}
      >
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <TransitionTable data={pipelineData} isACV={false} />
        </Box>
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <TransitionTable data={pipelineData} isACV={true} />
        </Box>
      </Box>
    </Box>
  );
};

export default App;
