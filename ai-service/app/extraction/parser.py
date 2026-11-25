"""Indian Utility Bill Parser and Regex/Pattern Field Extractor"""
import re
from datetime import datetime
from app.schemas.schemas import ExtractedBillData
from app.core.config import INDIAN_DISCOMS, DEFAULT_DOMESTIC_SLABS, calculate_slab_energy_charges

def extract_indian_bill_fields(text: str) -> ExtractedBillData:
    data = ExtractedBillData()
    cleaned = text.replace(",", "")
    
    # Provider detection
    for discom in INDIAN_DISCOMS:
        acronym = discom.split("(")[-1].replace(")", "") if "(" in discom else discom
        if acronym.lower() in cleaned.lower() or discom.split()[0].lower() in cleaned.lower():
            data.provider_name = discom
            break
    if not data.provider_name:
        if "delhi jal board" in cleaned.lower() or "water" in cleaned.lower() or "jal" in cleaned.lower():
            data.provider_name = "Delhi Jal Board"
            data.utility_type = "water"
        elif "broadband" in cleaned.lower() or "wifi" in cleaned.lower() or "airtel" in cleaned.lower() or "jio" in cleaned.lower():
            data.provider_name = "Broadband Provider"
            data.utility_type = "internet"
        else:
            data.provider_name = "Madhya Pradesh Vidyut Vitaran (MPMKVVCL)"

    # Consumer / CA number
    ca_match = re.search(r'(?:consumer\s*(?:no|number|id)|ca\s*no|account\s*no|k\s*no)[\s.:#-]+([0-9]{8,14})', cleaned, re.IGNORECASE)
    if ca_match:
        data.consumer_number = ca_match.group(1)
    else:
        alt_match = re.search(r'\b(10\d{8,10}|\d{10,12})\b', cleaned)
        if alt_match:
            data.consumer_number = alt_match.group(1)

    # Bill number
    bill_no = re.search(r'(?:bill\s*(?:no|number)|invoice\s*(?:no|#))[\s.:#-]+([A-Z0-9-]{6,16})', cleaned, re.IGNORECASE)
    if bill_no:
        data.bill_number = bill_no.group(1)

    # Meter number
    meter_no = re.search(r'(?:meter\s*(?:no|number|serial))[\s.:#-]+([A-Z0-9-]{5,14})', cleaned, re.IGNORECASE)
    if meter_no:
        data.meter_number = meter_no.group(1)

    # Units consumed
    units_match = re.search(r'(?:units\s*(?:consumed|billed)?|total\s*units|consumption|kwh\s*(?:consumed)?)[\s.:=-]+([0-9]+(?:\.[0-9]+)?)', cleaned, re.IGNORECASE)
    if units_match:
        data.units_consumed = float(units_match.group(1))

    # Net payable / Total amount
    amount_match = re.search(r'(?:net\s*(?:payable|amount)|total\s*(?:amount|payable|bill\s*amount)|amount\s*(?:payable)?|pay\s*by\s*due\s*date)[\s.:=₹Rs-]+([0-9]+(?:\.[0-9]+)?)', cleaned, re.IGNORECASE)
    if amount_match:
        data.net_payable_amount = float(amount_match.group(1))

    # Energy charges
    energy_match = re.search(r'(?:energy\s*charges?|ec)[\s.:=₹Rs-]+([0-9]+(?:\.[0-9]+)?)', cleaned, re.IGNORECASE)
    if energy_match:
        data.energy_charges = float(energy_match.group(1))

    # Fixed charges
    fixed_match = re.search(r'(?:fixed\s*charges?|demand\s*charges?|fc)[\s.:=₹Rs-]+([0-9]+(?:\.[0-9]+)?)', cleaned, re.IGNORECASE)
    if fixed_match:
        data.fixed_charges = float(fixed_match.group(1))

    # Due date
    due_match = re.search(r'(?:due\s*date|pay\s*before|payment\s*due)[\s.:-]+([0-3]?[0-9][/-][0-1]?[0-9][/-][12][0-9]{3})', cleaned, re.IGNORECASE)
    if due_match:
        data.due_date = due_match.group(1)

    # Bill date
    bill_date_match = re.search(r'(?:bill\s*date|date\s*of\s*issue|issue\s*date)[\s.:-]+([0-3]?[0-9][/-][0-1]?[0-9][/-][12][0-9]{3})', cleaned, re.IGNORECASE)
    if bill_date_match:
        data.bill_date = bill_date_match.group(1)
    else:
        data.bill_date = datetime.now().strftime("%d/%m/%Y")

    # Electricity duty / taxes
    tax_match = re.search(r'(?:electricity\s*duty|duty|gst|tax(?:es)?)[\s.:=₹Rs-]+([0-9]+(?:\.[0-9]+)?)', cleaned, re.IGNORECASE)
    if tax_match:
        data.taxes_and_duties = float(tax_match.group(1))

    # FPPCA / PPAC
    fppca_match = re.search(r'(?:fppca|ppac|fuel\s*(?:surcharge|adjustment))[\s.:=₹Rs-]+([0-9]+(?:\.[0-9]+)?)', cleaned, re.IGNORECASE)
    if fppca_match:
        data.fppca_charges = float(fppca_match.group(1))

    # Arrears
    arrears_match = re.search(r'(?:arrears?|previous\s*dues)[\s.:=₹Rs-]+([0-9]+(?:\.[0-9]+)?)', cleaned, re.IGNORECASE)
    if arrears_match:
        data.arrears = float(arrears_match.group(1))

    # Subsidies
    subsidy_match = re.search(r'(?:subsidy|govt\s*subsidy|rebate)[\s.:=₹Rs-]+([0-9]+(?:\.[0-9]+)?)', cleaned, re.IGNORECASE)
    if subsidy_match:
        data.subsidies = float(subsidy_match.group(1))

    # Defaults & cross calculations if missing
    if data.units_consumed and not data.energy_charges:
        data.energy_charges = calculate_slab_energy_charges(data.units_consumed, DEFAULT_DOMESTIC_SLABS)
    if not data.fixed_charges:
        data.fixed_charges = 85.0
    if not data.taxes_and_duties and data.energy_charges:
        data.taxes_and_duties = round(data.energy_charges * 0.09, 2)
    if not data.net_payable_amount and data.energy_charges:
        data.net_payable_amount = round(
            (data.energy_charges or 0.0) +
            (data.fixed_charges or 0.0) +
            (data.taxes_and_duties or 0.0) +
            (data.fppca_charges or 0.0) +
            (data.arrears or 0.0) -
            (data.subsidies or 0.0), 2
        )

    data.extracted_text_snippet = text[:400] + ("..." if len(text) > 400 else "")
    return data
