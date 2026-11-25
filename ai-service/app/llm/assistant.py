"""UrjaMitra AI Bilingual Conversational Advisor (English & Hindi)"""
from datetime import datetime
import re
from app.schemas.schemas import ChatRequest

def handle_assistant_chat(req: ChatRequest) -> dict:
    msg = req.message.lower().strip()
    lang = req.language.lower()
    bill = req.current_bill or {}

    units = bill.get("units_consumed") or bill.get("units") or 240
    amount = bill.get("net_payable_amount") or bill.get("amount") or 1650
    provider = bill.get("provider_name") or "Indian Power DISCOM"

    # Intent analysis
    hindi_keywords = ["kya", "kyu", "kaise", "bijli", "bachaye", "hindi"]
    is_hindi = lang == "hi" or any(re.search(r'\b' + re.escape(w) + r'\b', msg) for w in hindi_keywords)

    if "why" in msg and ("high" in msg or "increase" in msg or "jyada" in msg or "badha" in msg):
        if is_hindi:
            reply = (
                f"नमस्ते! UrjaMitra AI के विश्लेषण के अनुसार, आपका बिल ₹{amount} (उपभोग: {units} यूनिट्स) मुख्य रूप से इन कारणों से प्रभावित हो सकता है:\n"
                f"1. **स्लैब दर वृद्धि**: 150 और 300 यूनिट से ऊपर की बिजली उच्च दर (₹6.45 - ₹7.10/यूनिट) पर चार्ज होती है।\n"
                f"2. **FPPCA / ईंधन अधिभार**: यह डिस्कोम द्वारा हर तिमाही में ईंधन लागत समायोजन के रूप में लगाया जाता है।\n"
                f"3. **फिक्स्ड चार्ज**: स्वीकृत लोड (Sanctioned Load) के आधार पर तय शुल्क।\n"
                f"सुझाव: अपने बिल के 'Units Consumed' और 'Electricity Duty' को पूर्व बिलों से तुलना टैब में जांचें।"
            )
        else:
            reply = (
                f"Hello! UrjaMitra AI has analyzed your billing metrics for {provider} (Amount: ₹{amount}, Consumption: {units} kWh):\n"
                f"1. **Telescopic Slab Jumps**: Consumption past 150 and 300 units moves into higher Indian tariff slabs (₹6.45 to ₹7.10/unit).\n"
                f"2. **FPPCA / PPAC Charges**: Fuel and Power Purchase Adjustment charges vary every billing cycle based on DISCOM generation costs.\n"
                f"3. **Fixed & Demand Charges**: Incurred on your sanctioned connected load (kW) regardless of actual consumption.\n"
                f"Check the 'Bill Comparison' tab to view line-item percentage shifts against your previous cycle."
            )
    elif "fixed" in msg or "charge" in msg or "demand" in msg:
        if is_hindi:
            reply = (
                f"**फिक्स्ड चार्ज (Fixed Charges)** वह न्यूनतम शुल्क है जो बिजली बोर्ड (DISCOM) आपकी स्वीकृत क्षमता (Sanctioned Load, उदा. 2 kW) को ग्रिड से जोड़े रखने के लिए लेता है। "
                f"चाहे आप बिजली का उपयोग करें या न करें, यह शुल्क बिल में जोड़ा जाता है। यदि आपके घर का लोड बढ़ गया है, तो इसे ठीक कराने के लिए UrjaMitra विवाद पत्र जनरेट कर सकते हैं।"
            )
        else:
            reply = (
                f"**Fixed Charges (or Demand Charges)** represent the grid infrastructure reservation fee based on your sanctioned load (in kW/kVA). "
                f"Even with zero unit consumption, this fixed amount is levied under State Electricity Regulatory Commission (SERC) tariff orders. "
                f"If you notice an unexpected hike, your DISCOM may have upgraded your sanctioned load based on peak demand recordings."
            )
    elif "save" in msg or "reduce" in msg or "bachaye" in msg or "kam" in msg:
        if is_hindi:
            reply = (
                f"**ऊर्जा बचत के लिए UrjaMitra AI के शीर्ष सुझाव**:\n"
                f"• अपने मासिक उपभोग को 300 यूनिट से नीचे रखें ताकि उच्चतम स्लैब दर से बचा जा सके।\n"
                f"• एसी को 24°C से 26°C पर चलाने से प्रति डिग्री 6% बिजली की बचत होती है।\n"
                f"• 'पीएम सूर्य घर मुफ्त बिजली योजना' (PM Surya Ghar) के तहत सोलर रूफटॉप लगाकर मासिक बिल को 80% तक कम कर सकते हैं।\n"
                f"आप हमारे 'Savings Calculator' का उपयोग करके सटीक बचत गणना देख सकते हैं।"
            )
        else:
            reply = (
                f"**UrjaMitra AI Smart Savings Strategy**:\n"
                f"• Keep monthly consumption strictly below upper slab cutoffs (e.g. below 300 or 150 kWh) to avoid peak telescopic slab rates.\n"
                f"• Running Air Conditioners at 24°C-26°C saves ~6% electricity per degree compared to 18°C.\n"
                f"• Inspect standby loads and opt for 5-star BEE rated appliances.\n"
                f"• Check the 'Savings Calculator' in the sidebar to simulate potential savings for your specific DISCOM slab."
            )
    else:
        if is_hindi:
            reply = (
                f"UrjaMitra AI आपकी सेवा में तत्पर है! आप मुझसे अपने बिजली बिल, पानी बिल, इंटरनेट प्लान, टैरिफ स्लैब, फिक्स्ड चार्ज, या बिल में विसंगतियों (Anomalies) के बारे में पूछ सकते हैं।"
            )
        else:
            reply = (
                f"I am **UrjaMitra AI**, your Smart Utility Companion. You can ask me to explain unexpected charges, calculate savings, dissect tariff slabs for {provider}, or draft formal consumer dispute letters."
            )

    return {
        "reply": reply,
        "language": "hi" if is_hindi else "en",
        "assistant": "UrjaMitra AI",
        "timestamp": datetime.now().isoformat()
    }
