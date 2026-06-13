const axios = require('axios');
const fs = require('fs');

async function test() {
  const JOB_URL = "https://paddleocr.aistudio-app.com/api/v2/ocr/jobs";
  const TOKEN = "dd32c523f5a5e13831005165530fc7687e658bd9";
  const MODEL = "PaddleOCR-VL-1.6";

  // create a dummy base64 image (1x1 pixel)
  const dummyBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

  const payload = {
    file: dummyBase64,
    fileType: 1,
    model: MODEL,
    optionalPayload: {
      useDocOrientationClassify: false,
      useDocUnwarping: false,
      useChartRecognition: false,
    }
  };

  const headers = {
    "Authorization": `token ${TOKEN}`,
    "Content-Type": "application/json"
  };

  try {
    console.log("Submitting job...");
    const res = await axios.post(JOB_URL, payload, { headers });
    const jobId = res.data.data.jobId;
    console.log("Job ID:", jobId);

    let state = 'pending';
    let pollData;
    while (state === 'pending' || state === 'running') {
      await new Promise(r => setTimeout(r, 2000));
      const pollRes = await axios.get(`${JOB_URL}/${jobId}`, {
        headers: { "Authorization": `bearer ${TOKEN}` }
      });
      pollData = pollRes.data;
      state = pollData.data.state;
      console.log("State:", state);
    }
    console.log("Result URL object:", JSON.stringify(pollData.data.resultUrl, null, 2));
  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
  }
}

test();
