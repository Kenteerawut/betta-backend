router.post("/", authRequired, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "no_file" });
    }

    const base64Image = req.file.buffer.toString("base64");

    console.log("🔥 analyze start");

    const ai = await analyzeBettaImage({
      imageBase64: base64Image,
      question: req.body.question || "",
    });

    console.log("🔥 AI RESULT:", ai);

    if (!ai || ai.status !== "success") {
      return res.status(200).json({
        ok: true,
        result: {
          fishName: ai?.breed_estimate || "-",
          type: ai?.betta_group || "-",
          color: ai?.morphology || "-",
          answer: ai?.short_reason || "ไม่สามารถวิเคราะห์ได้",
          confidence: ai?.confidence || 0,
        },
      });
    }

    /**
     * 🔥 MAP ใหม่ให้ตรง FRONTEND
     */
    const result = {
      fishName: ai.breed_estimate || "-",
      type: ai.betta_group || "-",
      color: ai.morphology || "-",
      answer: ai.short_reason || "-",
      confidence: ai.confidence || 0,
    };

    const doc = await FishRecord.create({
      userId: req.user.userId,
      fishName: result.fishName,
      type: result.type,
      color: result.color,
      note: result.answer,
      imageName: req.file.originalname,
      imageUrl: "",
    });

    res.json({
      ok: true,
      result,
      recordId: doc._id,
    });

  } catch (err) {
    console.error("🔥 ANALYZE ERROR:", err);

    res.status(500).json({
      error: "analyze_failed",
      message: String(err),
    });
  }
});