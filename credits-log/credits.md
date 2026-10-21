# Credits meowa.ai — dự án Đời Việt / Phố Đêm Trở Về

| Ngày | Job ID | Template | Cost (cr) | Số dư sau | Kết quả |
|---|---|---|---|---|---|
| 2026-10-21 | job_637bf414fcb944eda6b84e119e2943e1 | xlarge_4_3 | 25 | ~555 | PA A — hẻm Sài Gòn, có chữ biển vô nghĩa → loại |
| 2026-10-21 | job_25a86fa8025f4c6886e8854d7385c644 | xlarge_4_3 | 25 | ~530 | PA B — dãy mặt tiền phố, ít chiều sâu → dự phòng |
| 2026-10-21 | job_61fb9e75c253460da5f1a991aa02880c | xlarge_4_3 | 25 | ~505 | PA C — ngõ cụt, bị remove-bg ăn 96% → loại |
| 2026-10-21 | job_6bc305759ee94d00aa867f62c76912af | xlarge_4_3 | 25 | ~480 | PA D — hẻm Việt rõ, nhưng mảng tối tiền cảnh to → dự phòng |
| 2026-10-21 | job_0ebc22ce2f9243508c7566c74344f026 | xlarge_4_3 | 25 | 480 | **PA E — CHỌN**: phố đêm, sân trống rộng, biển hiệu trống, không chữ |

Tổng: 125 credit (5 job × 25). Số dư còn: **480**.

Ghi chú API (21/10/2026):
- Poll trả về **object top-level** (`status`, `output.final_sprite_paths[]`), KHÔNG phải `jobs[0]` như skill cũ ghi.
- `remove_bg_method` bị server ép về `standard` dù client gửi `none` → ảnh cảnh dễ bị ăn mất vùng trời trong suốt; phải composite lại trên nền trời đêm.
- Ảnh trả về ~510x380 (không phải 2048): phải resize về 320x240 rồi mới snap palette, nếu không sẽ lẫn anti-alias.
| 2026-10-21 tối | job_240d49d467f74fedb5cf33decbec1985 | xlarge_4_3 | 25 | ~405 | Phòng trọ Meowa — CHỌN, 8.5/10 |
| 2026-10-21 tối | job_4c2795cbf1e94948ae95755012537847 | xlarge_4_3 | 25 | ~380 | Quán phở Meowa — CHỌN, 8.5/10 |
| 2026-10-21 tối | job_9efb244df2ca4cd2b97826e2e1b60f0b | xlarge_4_3 | 25 | ~355 | Văn phòng Meowa — CHỌN, 8.5/10 |
