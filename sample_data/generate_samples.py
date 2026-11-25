"""
UrjaMitra Synthetic Indian Utility Bill Generator
Generates realistic Indian PDF and PNG sample bills for:
1. MP Madhya Kshetra Vidyut Vitaran Company (MPMKVVCL)
2. BSES Rajdhani Power Limited (BRPL Delhi)
3. Delhi Jal Board (Water)
4. Airtel Xstream Fiber Broadband (Internet)

All clearly marked: "Synthetic Demo Data – Not an Official Utility Bill"
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from PIL import Image, ImageDraw, ImageFont

SAMPLE_DIR = "/home/diksha/Desktop/UrjaMitra/sample_data"
os.makedirs(SAMPLE_DIR, exist_ok=True)

def generate_mp_electricity_pdf(filename="sample_mp_electricity_bill.pdf"):
    filepath = os.path.join(SAMPLE_DIR, filename)
    c = canvas.Canvas(filepath, pagesize=letter)
    width, height = letter

    # Header Box
    c.setFillColor(colors.HexColor("#14243A"))
    c.rect(40, height - 90, width - 80, 50, fill=1, stroke=0)
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(55, height - 65, "MP MADHYA KSHETRA VIDYUT VITARAN COMPANY (MPMKVVCL)")
    c.setFont("Helvetica", 9)
    c.drawString(55, height - 80, "GOVERNMENT OF MADHYA PRADESH UNDERTAKING | NISHTHA PARISAR, GOVINDPURA, BHOPAL")

    # Watermark / Notice
    c.setFillColor(colors.HexColor("#DC2626"))
    c.setFont("Helvetica-Bold", 10)
    c.drawString(45, height - 110, "Synthetic Demo Data – Not an Official Utility Bill (UrjaMitra Test Document)")

    # Consumer Details Table
    c.setStrokeColor(colors.HexColor("#CBD5E1"))
    c.rect(40, height - 230, width - 80, 110, fill=0, stroke=1)
    
    c.setFillColor(colors.HexColor("#1E293B"))
    c.setFont("Helvetica-Bold", 10)
    c.drawString(55, height - 135, "CONSUMER BILLING DETAILS")

    c.setFont("Helvetica", 9)
    c.drawString(55, height - 155, "Consumer No / CA No: 1029384756")
    c.drawString(55, height - 170, "Consumer Name: Shri Arjun Sharma")
    c.drawString(55, height - 185, "Billing Unit (BU): 1204 - Arera Colony")
    c.drawString(55, height - 200, "Sanctioned Load: 3.00 kW")
    c.drawString(55, height - 215, "Tariff / Category: LT-1 Domestic Single Phase")

    c.drawString(330, height - 155, "Bill No: MPM-2026-994821")
    c.drawString(330, height - 170, "Bill Date: 02/12/2026")
    c.drawString(330, height - 185, "Due Date: 17/12/2026")
    c.drawString(330, height - 200, "Billing Period: 01/11/2026 to 30/11/2026 (30 Days)")
    c.drawString(330, height - 215, "Meter No: MPM-994821")

    # Meter Reading Table
    c.rect(40, height - 310, width - 80, 70, fill=0, stroke=1)
    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(colors.HexColor("#0F172A"))
    c.drawString(55, height - 250, "METER READING & CONSUMPTION (kWh)")
    c.setFont("Helvetica", 9)
    c.drawString(55, height - 270, "Previous Reading: 4565.00 kWh")
    c.drawString(200, height - 270, "Current Reading: 4895.00 kWh")
    c.drawString(360, height - 270, "Units Consumed: 330.00 kWh")
    c.drawString(55, height - 295, "Meter Status: OK Normal")
    c.drawString(200, height - 295, "Power Factor: 0.98")
    c.drawString(360, height - 295, "Supply Voltage: 230V 50Hz Single Phase")

    # Assessment of Charges
    c.rect(40, height - 470, width - 80, 150, fill=0, stroke=1)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(55, height - 330, "PARTICULARS OF BILLING CHARGES")

    c.setFont("Helvetica", 9)
    items = [
        ("Energy Charges (Slab 1 to 4):", "Rs 1890.05"),
        ("Fixed Charges (Demand 3 kW):", "Rs 110.00"),
        ("Electricity Duty (Govt MP 9%):", "Rs 170.10"),
        ("FPPCA / PPAC Fuel Surcharge:", "Rs 82.50"),
        ("Meter Rent & Service Charges:", "Rs 15.00"),
        ("Arrears / Previous Dues:", "Rs 0.00"),
        ("Govt Subsidy / Rebate:", "- Rs 0.00"),
        ("Net Payable Amount:", "Rs 2267.65")
    ]
    y = height - 350
    for label, val in items:
        if label.startswith("Net"):
            c.setFont("Helvetica-Bold", 11)
            c.setFillColor(colors.HexColor("#1E3A8A"))
        else:
            c.setFont("Helvetica", 9)
            c.setFillColor(colors.HexColor("#1E293B"))
        c.drawString(55, y, label)
        c.drawRightString(width - 55, y, val)
        y -= 14

    # Footer instructions
    c.setFont("Helvetica-Oblique", 8)
    c.setFillColor(colors.HexColor("#64748B"))
    c.drawString(55, 60, "Important Note: Pay via MP Online or DISCOM portal by Due Date to avoid Late Payment Surcharge.")
    c.drawString(55, 45, "UrjaMitra Automated Sample Bill Verification Document - For test and validation purposes only.")

    c.save()
    print(f"Generated PDF: {filepath}")
    return filepath

def generate_mp_electricity_image(filename="sample_mp_electricity_bill.png"):
    filepath = os.path.join(SAMPLE_DIR, filename)
    img = Image.new("RGB", (800, 1000), color=(255, 255, 255))
    d = ImageDraw.Draw(img)

    # Header
    d.rectangle([20, 20, 780, 90], fill=(20, 36, 58))
    d.text((40, 35), "MP MADHYA KSHETRA VIDYUT VITARAN CO. LTD.", fill=(255, 255, 255))
    d.text((40, 60), "GOVERNMENT OF MP | ELECTRICITY BILL CUM NOTICE", fill=(200, 220, 240))

    d.text((40, 105), "Synthetic Demo Data - Not an Official Utility Bill", fill=(220, 38, 38))

    # Details Box
    d.rectangle([20, 130, 780, 260], outline=(150, 160, 175), width=2)
    d.text((40, 145), "Consumer No: 1029384756", fill=(0, 0, 0))
    d.text((40, 170), "Consumer Name: Arjun Sharma", fill=(0, 0, 0))
    d.text((40, 195), "Bill No: MPM-2026-994821", fill=(0, 0, 0))
    d.text((40, 220), "Due Date: 17/12/2026", fill=(0, 0, 0))

    d.text((420, 145), "Meter No: MPM-994821", fill=(0, 0, 0))
    d.text((420, 170), "Bill Date: 02/12/2026", fill=(0, 0, 0))
    d.text((420, 195), "Tariff: LT-Domestic 1 Phase", fill=(0, 0, 0))
    d.text((420, 220), "Sanctioned Load: 3.0 kW", fill=(0, 0, 0))

    # Consumption Box
    d.rectangle([20, 280, 780, 390], outline=(150, 160, 175), width=2)
    d.text((40, 295), "METER READING & CONSUMPTION", fill=(20, 36, 58))
    d.text((40, 325), "Previous Reading: 4565.0 kWh", fill=(0, 0, 0))
    d.text((40, 350), "Current Reading: 4895.0 kWh", fill=(0, 0, 0))
    d.text((420, 325), "Units Consumed: 330.0 kWh", fill=(0, 0, 0))
    d.text((420, 350), "Billing Days: 30 Days", fill=(0, 0, 0))

    # Charges Box
    d.rectangle([20, 410, 780, 680], outline=(150, 160, 175), width=2)
    d.text((40, 425), "CHARGE SUMMARY", fill=(20, 36, 58))
    d.text((40, 460), "Energy Charges: Rs 1890.05", fill=(0, 0, 0))
    d.text((40, 490), "Fixed Charges: Rs 110.00", fill=(0, 0, 0))
    d.text((40, 520), "Electricity Duty: Rs 170.10", fill=(0, 0, 0))
    d.text((40, 550), "FPPCA Surcharge: Rs 82.50", fill=(0, 0, 0))
    d.text((40, 580), "Meter Rent: Rs 15.00", fill=(0, 0, 0))
    d.text((40, 620), "Net Payable Amount: Rs 2267.65", fill=(30, 58, 138))

    img.save(filepath)
    print(f"Generated Image: {filepath}")
    return filepath

if __name__ == "__main__":
    generate_mp_electricity_pdf()
    generate_mp_electricity_image()
