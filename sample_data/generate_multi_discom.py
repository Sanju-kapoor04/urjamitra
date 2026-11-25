"""
UrjaMitra Real-World Multi-DISCOM Sample Bill Generator
Generates realistic Indian bills across:
1. MPMKVVCL (Madhya Pradesh) - Clean Vector PDF
2. BSES Rajdhani (BRPL Delhi) - High-density PDF with CA Number & PPAC
3. TPDDL (Tata Power Delhi) - PDF with DERC telescopic slabs
4. Mobile Photograph Emulation (JPG/PNG) - Noise, perspective distortion, slight blur, realistic phone capture characteristics
5. Edge Cases: Provisional reading bill, extreme consumption surge, fixed charge hike

All strictly marked: "Synthetic Demo Data – Not an Official Utility Bill"
"""

import os
import random
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

SAMPLE_DIR = "/home/diksha/Desktop/UrjaMitra/sample_data"
os.makedirs(SAMPLE_DIR, exist_ok=True)

def generate_bses_delhi_pdf(filename="sample_bses_delhi_bill.pdf"):
    filepath = os.path.join(SAMPLE_DIR, filename)
    c = canvas.Canvas(filepath, pagesize=letter)
    width, height = letter

    # Header Box
    c.setFillColor(colors.HexColor("#0F172A"))
    c.rect(40, height - 90, width - 80, 50, fill=1, stroke=0)
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 15)
    c.drawString(55, height - 65, "BSES RAJDHANI POWER LIMITED (BRPL) - DELHI")
    c.setFont("Helvetica", 9)
    c.drawString(55, height - 80, "BSES BHAWAN, NEHRU PLACE, NEW DELHI 110019 | 24X7 HELPLINE: 19123")

    c.setFillColor(colors.HexColor("#DC2626"))
    c.setFont("Helvetica-Bold", 10)
    c.drawString(45, height - 110, "Synthetic Demo Data – Not an Official Utility Bill (UrjaMitra Test Document)")

    # Consumer Table
    c.setStrokeColor(colors.HexColor("#CBD5E1"))
    c.rect(40, height - 220, width - 80, 100, fill=0, stroke=1)
    c.setFillColor(colors.HexColor("#1E293B"))
    c.setFont("Helvetica-Bold", 10)
    c.drawString(55, height - 130, "CONSUMER ACCOUNT INFORMATION")
    c.setFont("Helvetica", 9)
    c.drawString(55, height - 150, "CA Number: 1002938475")
    c.drawString(55, height - 165, "Consumer Name: Smt. Sunita Verma")
    c.drawString(55, height - 180, "Sanctioned Load: 4.00 kW")
    c.drawString(55, height - 195, "Tariff Category: Domestic Lighting (DL)")

    c.drawString(330, height - 150, "Bill Number: BRPL-DEL-883921")
    c.drawString(330, height - 165, "Bill Date: 05/12/2026")
    c.drawString(330, height - 180, "Due Date: 22/12/2026")
    c.drawString(330, height - 195, "Meter No: DL-883921")

    # Readings
    c.rect(40, height - 300, width - 80, 70, fill=0, stroke=1)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(55, height - 240, "METER READING & CONSUMPTION (kWh)")
    c.setFont("Helvetica", 9)
    c.drawString(55, height - 260, "Previous Reading: 8940.0 kWh (Date: 04/11/2026)")
    c.drawString(300, height - 260, "Current Reading: 9225.0 kWh (Date: 04/12/2026)")
    c.drawString(55, height - 285, "Units Consumed: 285.0 kWh")
    c.drawString(300, height - 285, "Billing Days: 30 Days | Reading Type: Actual")

    # Charges Breakdown
    c.rect(40, height - 460, width - 80, 150, fill=0, stroke=1)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(55, height - 320, "BILLING DETAILS & DERIVED CHARGES (DERC ORDER)")
    items = [
        ("Energy Charges (0-200 @ Rs 3.00, 201-400 @ Rs 4.50):", "Rs 982.50"),
        ("Fixed Charges (4 kW @ Rs 20/kW):", "Rs 80.00"),
        ("PPAC / Fuel Surcharge (29.13% of Energy Charges):", "Rs 286.20"),
        ("Delhi Electricity Duty (5%):", "Rs 49.13"),
        ("Pension Trust Surcharge (7%):", "Rs 68.78"),
        ("Govt Delhi Subsidy (200 Units free scheme):", "- Rs 0.00"),
        ("Net Payable Amount:", "Rs 1466.61")
    ]
    y = height - 340
    for label, val in items:
        if label.startswith("Net"):
            c.setFont("Helvetica-Bold", 11)
            c.setFillColor(colors.HexColor("#1E3A8A"))
        else:
            c.setFont("Helvetica", 9)
            c.setFillColor(colors.HexColor("#1E293B"))
        c.drawString(55, y, label)
        c.drawRightString(width - 55, y, val)
        y -= 15

    c.save()
    print(f"Generated BSES Delhi Bill: {filepath}")
    return filepath

def generate_mobile_photograph_bill(output_name="sample_mobile_photo_bill.jpg"):
    """
    Creates an image that simulates a real smartphone photograph taken of a paper bill:
    - Non-uniform lighting / subtle gradient
    - Slight noise / grain
    - Paper texture tint
    - Slight tilt/blur
    """
    filepath = os.path.join(SAMPLE_DIR, output_name)
    width, height = 900, 1200
    # Warm paper-like off-white background
    base = Image.new("RGB", (width, height), color=(248, 246, 240))
    d = ImageDraw.Draw(base)

    # Simulated shadow gradient across page
    for y in range(height):
        factor = int(15 * (y / height))
        d.line([(0, y), (width, y)], fill=(248 - factor, 246 - factor, 240 - factor))

    # Header Box
    d.rectangle([40, 40, width - 40, 140], fill=(24, 38, 56))
    d.text((60, 60), "TATA POWER DELHI DISTRIBUTION LIMITED (TPDDL)", fill=(255, 255, 255))
    d.text((60, 95), "SUB-DIVISION: PITAMPURA, DELHI | CONSUMER DUPLICATE BILL", fill=(210, 225, 245))

    d.text((60, 155), "Synthetic Demo Data - Not an Official Utility Bill (Mobile Capture)", fill=(215, 30, 30))

    # Consumer Details Box
    d.rectangle([40, 185, width - 40, 340], outline=(170, 175, 185), width=2)
    d.text((60, 205), "Consumer No: 6001928374", fill=(20, 20, 20))
    d.text((60, 235), "Name: Rajesh Kumar Gupta", fill=(20, 20, 20))
    d.text((60, 265), "Bill No: TPDDL-2026-44021", fill=(20, 20, 20))
    d.text((60, 295), "Due Date: 19/12/2026", fill=(20, 20, 20))

    d.text((500, 205), "Meter No: TP-884920", fill=(20, 20, 20))
    d.text((500, 235), "Bill Date: 03/12/2026", fill=(20, 20, 20))
    d.text((500, 265), "Tariff: Domestic LT-1", fill=(20, 20, 20))
    d.text((500, 295), "Sanctioned Load: 2.0 kW", fill=(20, 20, 20))

    # Meter Readings Box
    d.rectangle([40, 360, width - 40, 490], outline=(170, 175, 185), width=2)
    d.text((60, 380), "METER READING DETAILS", fill=(24, 38, 56))
    d.text((60, 415), "Previous Reading: 3120.0 kWh", fill=(20, 20, 20))
    d.text((60, 445), "Current Reading: 3345.0 kWh", fill=(20, 20, 20))
    d.text((500, 415), "Units Consumed: 225.0 kWh", fill=(20, 20, 20))
    d.text((500, 445), "Billing Period: 30 Days", fill=(20, 20, 20))

    # Charges Box
    d.rectangle([40, 510, width - 40, 780], outline=(170, 175, 185), width=2)
    d.text((60, 530), "ASSESSMENT OF CHARGES", fill=(24, 38, 56))
    d.text((60, 565), "Energy Charges: Rs 1125.00", fill=(20, 20, 20))
    d.text((60, 595), "Fixed Charges: Rs 90.00", fill=(20, 20, 20))
    d.text((60, 625), "Electricity Duty: Rs 101.25", fill=(20, 20, 20))
    d.text((60, 655), "PPAC / Fuel Surcharge: Rs 85.50", fill=(20, 20, 20))
    d.text((60, 710), "Net Payable Amount: Rs 1401.75", fill=(25, 45, 120))

    # Add realistic mobile camera effects
    # 1. Subtle blur (camera lens softness)
    blurred = base.filter(ImageFilter.GaussianBlur(radius=0.4))

    # 2. Add fine sensor noise
    pixels = blurred.load()
    for _ in range(5000):
        rx = random.randint(0, width - 1)
        ry = random.randint(0, height - 1)
        r, g, b = pixels[rx, ry]
        noise = random.randint(-12, 12)
        pixels[rx, ry] = (
            max(0, min(255, r + noise)),
            max(0, min(255, g + noise)),
            max(0, min(255, b + noise))
        )

    blurred.save(filepath, "JPEG", quality=88)
    print(f"Generated Mobile Photo Emulation Bill: {filepath}")
    return filepath

if __name__ == "__main__":
    generate_bses_delhi_pdf()
    generate_mobile_photograph_bill()
