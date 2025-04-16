const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const PORT = 5001;

app.use(cors());

app.get("/api/data", (req, res) => {
  const rawData = JSON.parse(fs.readFileSync("data.json", "utf8"));
  const wonStage = rawData.find((stage) => stage.label === "Won");

  const updatedData = rawData.map((stage, index, array) => {
    const updatedStage = { ...stage };

    // Opportunity calculations (count-based)
    updatedStage.winRate = parseFloat(
      ((wonStage.count / stage.count) * 100).toFixed(0)
    );
    updatedStage.conversion =
      index < array.length - 1
        ? parseFloat(((array[index + 1].count / stage.count) * 100).toFixed(0))
        : null;

    // ACV calculations (value-based)
    updatedStage.acvWinRate = parseFloat(
      ((wonStage.acv / stage.acv) * 100).toFixed(0)
    );
    updatedStage.acvConversionRate =
      index < array.length - 1
        ? parseFloat(((array[index + 1].acv / stage.acv) * 100).toFixed(0))
        : null;

    // Stage transition metrics
    if (index < array.length - 1) {
      const nextStage = array[index + 1];
      updatedStage.movedForward = nextStage.count;
      updatedStage.lost = stage.count - nextStage.count;
      updatedStage.acvMovedForward = nextStage.acv;
      updatedStage.acvLost = stage.acv - nextStage.acv;
    } else {
      updatedStage.movedForward = null;
      updatedStage.lost = null;
      updatedStage.acvMovedForward = null;
      updatedStage.acvLost = null;
    }

    return updatedStage;
  });

  res.json(updatedData);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
