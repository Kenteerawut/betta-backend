{/* ⭐ RESULT UI — ACADEMIC MODE */}
{result && (
  <div className="space-y-3 mb-6">

    {/* การประเมินสายพันธุ์ */}
    <div className="border rounded-xl p-4 bg-indigo-50">
      🐟 <b>การประเมินสายพันธุ์:</b> {speciesTH} ({speciesEN})
      <div className="text-xs text-gray-500 mt-1">
        * ประเมินจากลักษณะภายนอกของปลา (Morphology) ไม่ใช่การยืนยันทางพันธุกรรม
      </div>
    </div>

    {/* กลุ่มการเลี้ยง */}
    <div className="border rounded-xl p-4">
      🧬 <b>กลุ่มการเลี้ยง:</b> {categoryTH} ({categoryEN})
    </div>

    {/* หาง */}
    <div className="border rounded-xl p-4">
      🪶 <b>รูปทรงหาง:</b>{" "}
      {result?.tail_type_en || "-"}{" "}
      ({result?.tail_type_th || "-"})
    </div>

    {/* ลักษณะ */}
    <div className="border rounded-xl p-4">
      🎨 <b>ลักษณะทางสัณฐาน:</b> {color}
    </div>

    {/* เกรด */}
    <div className="border rounded-xl p-4">
      ⭐ <b>ระดับคุณภาพ (Grade):</b> {grade}
      <div className="text-xs text-gray-500 mt-1">
        High Grade = โครงสร้างสมดุล ครีบสมบูรณ์ สีสม่ำเสมอ
      </div>
    </div>

    {/* Confidence */}
    <div className="border rounded-xl p-4">
      🔥 <b>ความมั่นใจของโมเดล:</b> {confidence}%

      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
        <div
          className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${confidence}%` }}
        />
      </div>
    </div>

    {/* วิเคราะห์ */}
    <div className="border rounded-xl p-4 text-sm leading-relaxed">
      {analysis}
    </div>

  </div>
)}
