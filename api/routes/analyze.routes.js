{/* ⭐ RESULT UI — V4 PRO */}
{result && (
  <div className="space-y-3 mb-6">

    {/* สายพันธุ์ */}
    <div className="border rounded-xl p-4 bg-indigo-50">
      🐟 <b>สายพันธุ์:</b> {speciesTH} ({speciesEN})
    </div>

    {/* กลุ่มการเลี้ยง (เปลี่ยนชื่อแล้ว) */}
    <div className="border rounded-xl p-4">
      🧬 <b>คาดว่าน่าจะเป็นสายพันธุ์:</b>{" "}
      {categoryTH} ({categoryEN})
    </div>

    {/* หาง */}
    <div className="border rounded-xl p-4">
      🪶 <b>รูปทรงหาง:</b>{" "}
      {result?.tail_type_en || "-"} ({result?.tail_type_th || "-"})
    </div>

    {/* Trait */}
    <div className="border rounded-xl p-4">
      🧠 <b>ลักษณะพิเศษ:</b> {result?.special_trait || "-"}
    </div>

    {/* สี */}
    <div className="border rounded-xl p-4">
      🎨 <b>ลักษณะทางสัณฐาน:</b> {color}
    </div>

    {/* เกรด */}
    <div className="border rounded-xl p-4">
      ⭐ <b>ระดับคุณภาพ (Grade):</b> {grade}
      <div className="text-xs text-gray-500 mt-1">
        A = โครงสร้างดีมาก | B = ดี | C = ทั่วไป
      </div>
    </div>

    {/* Confidence */}
    <div className="border rounded-xl p-4">
      🔥 <b>ความมั่นใจของโมเดล:</b> {confidence}%
      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
        <div
          className="bg-indigo-600 h-2 rounded-full"
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
