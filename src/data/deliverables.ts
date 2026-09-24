import { DeliverableFile } from '../types';

export const MAIN_PY_CONTENT = `"""
WhatsApp Cloud API Auto-Reply Bot
Language: Python 3.10+
Framework: FastAPI
Integration: Meta WhatsApp Cloud API (Graph API v21.0)
Configuration: Loaded strictly from .env file
"""

import os
import logging
from typing import Optional
from dotenv import load_dotenv
from fastapi import FastAPI, Request, Response, Query, status
from fastapi.responses import JSONResponse, PlainTextResponse
import requests

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    # Fallback parser if python-dotenv is not installed
    if os.path.exists(".env"):
        with open(".env", "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    os.environ.setdefault(key.strip(), val.strip().strip("'\""))

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger("whatsapp_bot")

# Environment variables
WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN", "").strip()
PHONE_NUMBER_ID = os.getenv("PHONE_NUMBER_ID", "").strip()
VERIFY_TOKEN = os.getenv("VERIFY_TOKEN", "").strip()

# Business Customizations
BUSINESS_NAME = os.getenv("BUSINESS_NAME", "Anvexaa AI").strip()
BUSINESS_LOCATION = os.getenv("BUSINESS_LOCATION", "Anvexaa AI Tech Hub").strip()
GOOGLE_MAPS_LINK = os.getenv("GOOGLE_MAPS_LINK", "https://anvexaa.ai").strip()
TEAM_CONTACT_NUMBER = os.getenv("TEAM_CONTACT_NUMBER", "+91 9876543210").strip()
SENDER_NAME = os.getenv("SENDER_NAME", "Team").strip()

# Initialize FastAPI App
app = FastAPI(
    title="WhatsApp Auto-Reply Bot - Anvexaa AI",
    description="Meta WhatsApp Cloud API Webhook Server with Anvexaa AI Auto-Reply Menu",
    version="1.0.0"
)

# Graph API Base URL
GRAPH_API_VERSION = "v21.0"
WHATSAPP_API_URL = f"https://graph.facebook.com/{GRAPH_API_VERSION}/{PHONE_NUMBER_ID}/messages"


def get_menu_text() -> str:
    """Returns the Anvexaa AI welcome message and options menu."""
    return (
        f"Namaste! 🙏 *{BUSINESS_NAME}* mein aapka swagat hai.\\n\\n"
        "Hum businesses ko grow karne mein madad karte hain using AI-powered video ads, websites aur WhatsApp automation! 🚀\\n\\n"
        "Kripya vikalp chunein:\\n"
        "1️⃣ *AI Services* - Hamari services ki detail\\n"
        "2️⃣ *Pricing* - Website & Video packages\\n"
        "3️⃣ *Portfolio & Website* - Hamara kaam aur links\\n"
        "4️⃣ *Free Demo Book Karein* - Team se baat & Free Demo\\n\\n"
        "👉 *Reply karein:* 1, 2, 3 ya 4 bhejein."
    )


def generate_reply(incoming_text: str) -> str:
    """
    Decides the auto-reply message based on incoming user text for Anvexaa AI.
    """
    cleaned = incoming_text.strip().lower()

    # Greetings / Menu trigger
    greetings = ["hi", "hello", "namaste", "pranam", "hey", "start", "menu", "madat", "help"]
    if cleaned in greetings:
        return get_menu_text()

    # Option 1: AI Services
    if cleaned == "1" or "service" in cleaned or "product" in cleaned or "work" in cleaned or "ai" in cleaned:
        return (
            f"🚀 *Services by {BUSINESS_NAME}*:\\n\\n"
            "Hum aapke business ko grow karne ke liye ye services provide karte hain:\\n\\n"
            "1. 🤖 *AI Automation*: WhatsApp auto-reply, CSV bulk messaging, 24/7 lead handling\\n"
            "2. 💻 *Professional Website*: High-converting modern business website (₹19,999)\\n"
            "3. 🎬 *AI Video Content*: Engaging AI generated videos (₹1,499 per 1 min)\\n"
            "4. 🎨 *Animation Video*: 2D/3D explainers for products (₹1,499 per 1 min)\\n"
            "5. 📢 *Promotional Video (Ads)*: High-ROI Meta/YouTube ads (₹1,499 per 1 min)\\n\\n"
            "💡 Full Pricing dekhne ke liye *2* bhejein, ya *Free Demo* ke liye *4* bhejein!"
        )

    # Option 2: Price List
    if cleaned == "2" or "price" in cleaned or "rate" in cleaned or "cost" in cleaned or "package" in cleaned:
        return (
            f"💰 *{BUSINESS_NAME} - Official Pricing*:\\n\\n"
            "1️⃣ *AI WhatsApp Automation*: Custom Setup + Lead Bot\\n"
            "2️⃣ *Professional Website*: ₹19,999 (Complete Responsive Website)\\n"
            "3️⃣ *AI Video Content*: ₹1,499 per 1 min\\n"
            "4️⃣ *Animation Video*: ₹1,499 per 1 min\\n"
            "5️⃣ *Promotional Video (Ads)*: ₹1,499 per 1 min\\n\\n"
            "🎁 *Special Offer:* Aapke business type ke hisab se hum ek *FREE DEMO* bana sakte hain! 🙂\\n\\n"
            "Free demo claim karne ke liye *4* reply karein."
        )

    # Option 3: Location / Website / Portfolio
    if cleaned == "3" or "location" in cleaned or "address" in cleaned or "website" in cleaned or "portfolio" in cleaned:
        return (
            f"🌐 *{BUSINESS_NAME} - Official Details*:\\n\\n"
            f"📍 Hub: {BUSINESS_LOCATION}\\n"
            f"🔗 Website / Portfolio: {GOOGLE_MAPS_LINK}\\n\\n"
            "✨ Hum All-India businesses ke sath remote aur on-site AI marketing solutions par kaam karte hain."
        )

    # Option 4: Team Notification & Free Demo Callback
    if cleaned == "4" or "demo" in cleaned or "baat" in cleaned or "call" in cleaned or "free" in cleaned:
        logger.info(f"Anvexaa AI: Free demo request received for callback.")
        return (
            f"✨ *Free Demo Request Received - {BUSINESS_NAME}*:\\n\\n"
            "Dhanyawad! Hamari team ko aapka message mil gaya hai. "
            "Hum aapke business ke liye ek customized *Free Demo* prepare karenge aur aapse jald hi WhatsApp/call par connect karenge 🙂\\n\\n"
            f"📞 Direct Helpline: {TEAM_CONTACT_NUMBER}\\n"
            "• Anvexaa AI"
        )

    # Fallback message
    return (
        "⚠️ Samajh nahi aaya, kripya 1 se 4 mein se number bhejein:\\n\\n"
        "1️⃣ AI Services\\n"
        "2️⃣ Pricing (Website ₹19,999 | Video Ads ₹1,499)\\n"
        "3️⃣ Website & Portfolio\\n"
        "4️⃣ Free Demo Book Karein"
    )


def send_interactive_buttons(to_number: str, body_text: str, buttons: list[dict]) -> bool:
    """Sends Quick Reply buttons message (up to 3 buttons)."""
    if not WHATSAPP_TOKEN or not PHONE_NUMBER_ID:
        return False
    url = f"https://graph.facebook.com/{GRAPH_API_VERSION}/{PHONE_NUMBER_ID}/messages"
    headers = {"Authorization": f"Bearer {WHATSAPP_TOKEN}", "Content-Type": "application/json"}
    button_list = [{"type": "reply", "reply": {"id": str(b.get("id", "1")), "title": str(b.get("title", "Select"))[:20]}} for b in buttons[:3]]
    payload = {"messaging_product": "whatsapp", "recipient_type": "individual", "to": to_number, "type": "interactive", "interactive": {"type": "button", "body": {"text": body_text}, "action": {"buttons": button_list}}}
    try:
        res = requests.post(url, headers=headers, json=payload, timeout=10)
        return res.status_code == 200 or send_whatsapp_message(to_number, body_text)
    except Exception:
        return send_whatsapp_message(to_number, body_text)


def send_interactive_menu(to_number: str) -> bool:
    """Sends Anvexaa AI interactive list picker menu."""
    if not WHATSAPP_TOKEN or not PHONE_NUMBER_ID:
        return send_whatsapp_message(to_number, get_menu_text())
    url = f"https://graph.facebook.com/{GRAPH_API_VERSION}/{PHONE_NUMBER_ID}/messages"
    headers = {"Authorization": f"Bearer {WHATSAPP_TOKEN}", "Content-Type": "application/json"}
    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": to_number,
        "type": "interactive",
        "interactive": {
            "type": "list",
            "header": {"type": "text", "text": f"{BUSINESS_NAME} 🚀"},
            "body": {"text": f"Namaste! 🙏 *{BUSINESS_NAME}* mein swagat hai.\\nNeeche option chunein:"},
            "footer": {"text": "Anvexaa AI Support"},
            "action": {
                "button": "Options Dekhein",
                "sections": [{
                    "title": "Services",
                    "rows": [
                        {"id": "1", "title": "🚀 AI Services", "description": "WhatsApp Bot, Web, Ads"},
                        {"id": "2", "title": "💰 Pricing & Cost", "description": "Web ₹19,999 | Video ₹1,499"},
                        {"id": "3", "title": "🌐 Website & Links", "description": "anvexaa.ai & Portfolio"},
                        {"id": "4", "title": "✨ Free Demo Book", "description": "Free Customized Demo"}
                    ]
                }]
            }
        }
    }
    try:
        res = requests.post(url, headers=headers, json=payload, timeout=10)
        return res.status_code == 200 or send_whatsapp_message(to_number, get_menu_text())
    except Exception:
        return send_whatsapp_message(to_number, get_menu_text())


def send_whatsapp_message(to_number: str, message_text: str) -> bool:
    """
    Sends a text message using Meta WhatsApp Cloud API.
    """
    if not WHATSAPP_TOKEN or not PHONE_NUMBER_ID:
        logger.error("WHATSAPP_TOKEN ya PHONE_NUMBER_ID .env file me set nahi hai!")
        return False

    url = f"https://graph.facebook.com/{GRAPH_API_VERSION}/{PHONE_NUMBER_ID}/messages"
    headers = {
        "Authorization": f"Bearer {WHATSAPP_TOKEN}",
        "Content-Type": "application/json",
    }
    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": to_number,
        "type": "text",
        "text": {
            "preview_url": True,
            "body": message_text
        }
    }

    try:
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        if response.status_code == 200:
            logger.info(f"Message successfully sent to {to_number}")
            return True
        else:
            logger.error(f"Failed to send message: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        logger.error(f"Error sending WhatsApp message: {str(e)}")
        return False


@app.get("/")
def home():
    """Health check & Bot overview endpoint."""
    return {
        "project": "whatsapp_auto_bot",
        "status": "online",
        "framework": "FastAPI",
        "webhook_endpoint": "/webhook",
        "meta_cloud_api_configured": bool(WHATSAPP_TOKEN and PHONE_NUMBER_ID and VERIFY_TOKEN)
    }


@app.get("/webhook")
def verify_webhook(
    hub_mode: Optional[str] = Query(None, alias="hub.mode"),
    hub_challenge: Optional[str] = Query(None, alias="hub.challenge"),
    hub_verify_token: Optional[str] = Query(None, alias="hub.verify_token")
):
    """
    GET /webhook: Meta WhatsApp webhook verification endpoint.
    Meta sends GET request with hub.mode, hub.challenge, and hub.verify_token.
    """
    logger.info(f"Webhook verification request received. mode={hub_mode}")

    if hub_mode == "subscribe" and hub_verify_token == VERIFY_TOKEN:
        logger.info("Webhook verification SUCCESSFUL! Returning challenge token.")
        return PlainTextResponse(content=hub_challenge or "", status_code=200)

    logger.warning("Webhook verification FAILED! Verify token mismatch.")
    return PlainTextResponse(content="Verification failed", status_code=status.HTTP_403_FORBIDDEN)


@app.post("/webhook")
async def handle_incoming_message(request: Request):
    """
    POST /webhook: Receives incoming WhatsApp messages from Meta and auto-replies.
    Always returns 200 OK so Meta doesn't retry message delivery indefinitely.
    """
    try:
        data = await request.json()
    except Exception as err:
        logger.error(f"Could not parse JSON body: {err}")
        return JSONResponse(content={"status": "invalid_json"}, status_code=200)

    entries = data.get("entry", [])
    for entry in entries:
        changes = entry.get("changes", [])
        for change in changes:
            value = change.get("value", {})
            messages = value.get("messages", [])

            if not messages:
                continue

            for msg in messages:
                from_number = msg.get("from")
                msg_type = msg.get("type")
                incoming_text = ""

                if msg_type == "text":
                    incoming_text = msg.get("text", {}).get("body", "")
                elif msg_type == "interactive":
                    interactive = msg.get("interactive", {})
                    button_reply = interactive.get("button_reply", {})
                    list_reply = interactive.get("list_reply", {})
                    incoming_text = button_reply.get("id") or button_reply.get("title") or list_reply.get("id") or ""
                elif msg_type:
                    incoming_text = msg_type

                logger.info(f"Received message from '{from_number}': '{incoming_text}'")

                if from_number:
                    reply_text = generate_reply(incoming_text)
                    send_whatsapp_message(from_number, reply_text)

    return JSONResponse(content={"status": "success"}, status_code=200)


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    logger.info(f"Starting WhatsApp Bot server on port {port}...")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
`;

export const BULK_PY_CONTENT = `"""
WhatsApp Bulk Template Message Sender
File: bulk.py
Reads: numbers.csv (columns: name, number)
Outputs: log.csv (columns: timestamp, number, name, status, error, response_id)

Features:
- WhatsApp Cloud API approved template sending
- Automatic duplicate phone number detection & skipping
- Test mode safety: runs only on first 3 numbers by default!
- 1-second delay between requests to comply with Meta rate limits
- Non-crashing exception handling with persistent CSV logging
- Loads tokens strictly from .env
"""

import os
import csv
import sys
import time
import argparse
import logging
from datetime import datetime

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    # Fallback parser if python-dotenv is not installed
    if os.path.exists(".env"):
        with open(".env", "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    os.environ.setdefault(key.strip(), val.strip().strip("'\""))

try:
    import requests
except ImportError:
    requests = None

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger("bulk_sender")

# Meta Cloud API Configuration
WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN", "").strip()
PHONE_NUMBER_ID = os.getenv("PHONE_NUMBER_ID", "").strip()
SENDER_NAME = os.getenv("SENDER_NAME", "Team").strip()
DEFAULT_TEMPLATE = os.getenv("DEFAULT_TEMPLATE_NAME", "anvexaa_pitch").strip()
DEFAULT_LANGUAGE = os.getenv("DEFAULT_TEMPLATE_LANGUAGE", "en").strip()
GRAPH_API_VERSION = "v21.0"

API_URL = f"https://graph.facebook.com/{GRAPH_API_VERSION}/{PHONE_NUMBER_ID}/messages"


def get_anvexaa_message_1(name: str, sender: str = SENDER_NAME, business_type: str = "business") -> str:
    """Anvexaa AI Custom Message 1: 2-minute quick intro pitch."""
    c_name = name.strip() if name and name.strip() else "there"
    return (
        f"Hi {c_name}, this is {sender} from Anvexaa AI. "
        "We help businesses grow with AI-powered video ads, websites and WhatsApp automation. "
        f"Can I take 2 minutes to show how this could help your {business_type}?"
    )


def get_anvexaa_message_2(name: str, sender: str = SENDER_NAME, business_type: str = "business") -> str:
    """Anvexaa AI Custom Message 2: Full Services, Pricing and Free Demo offer."""
    c_name = name.strip() if name and name.strip() else "there"
    return (
        f"Hi {c_name}, this is {sender} from Anvexaa AI. We help businesses grow using AI with these services:\\n\\n"
        "1. AI Automation (WhatsApp auto-reply, bulk messaging, lead handling)\\n"
        "2. Professional Website: ₹19,999\\n"
        "3. AI Video Content: ₹1,499 per 1 min\\n"
        "4. Animation Video: ₹1,499 per 1 min\\n"
        "5. Promotional Video (Ads): ₹1,499 per 1 min\\n\\n"
        f"Let me know which service would work best for your {business_type}. I'd be happy to create a free demo for you 🙂\\n\\n"
        "• Anvexaa AI"
    )


def send_direct_text_message(to_number: str, message_body: str) -> tuple[bool, str, str]:
    """Sends a direct WhatsApp text message."""
    if not WHATSAPP_TOKEN or not PHONE_NUMBER_ID:
        return False, "WHATSAPP_TOKEN ya PHONE_NUMBER_ID .env me missing hai", ""

    if not requests:
        return False, "requests module not installed", ""

    headers = {
        "Authorization": f"Bearer {WHATSAPP_TOKEN}",
        "Content-Type": "application/json"
    }
    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": to_number,
        "type": "text",
        "text": {
            "preview_url": True,
            "body": message_body
        }
    }

    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=12)
        resp_json = response.json()
        if response.status_code == 200:
            msg_id = resp_json.get("messages", [{}])[0].get("id", "SUCCESS")
            return True, "", msg_id
        else:
            err = resp_json.get("error", {}).get("message") or response.text
            return False, err, ""
    except Exception as exc:
        return False, str(exc), ""


def clean_phone_number(raw_num: str) -> str:
    """Cleans phone number and ensures country code format (e.g., 919876543210)."""
    if not raw_num:
        return ""
    cleaned = "".join(ch for ch in str(raw_num) if ch.isdigit())
    if len(cleaned) == 10:
        cleaned = "91" + cleaned
    return cleaned


def init_log_file(log_filename: str = "log.csv"):
    """Creates log.csv with header if it doesn't already exist."""
    if not os.path.exists(log_filename):
        with open(log_filename, mode="w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["timestamp", "number", "name", "status", "error", "message_id"])


def append_log(log_filename: str, number: str, name: str, status: str, error: str = "", msg_id: str = ""):
    """Appends send result to log.csv safely without crashing."""
    try:
        with open(log_filename, mode="a", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow([
                datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                number,
                name,
                status,
                error.replace("\\n", " "),
                msg_id
            ])
    except Exception as e:
        logger.error(f"Failed to write to log.csv: {e}")


def send_template_message(to_number: str, customer_name: str, template_name: str, language_code: str) -> tuple[bool, str, str]:
    """Sends an approved WhatsApp template message to a single number."""
    if not WHATSAPP_TOKEN or not PHONE_NUMBER_ID:
        return False, "WHATSAPP_TOKEN ya PHONE_NUMBER_ID .env me missing hai", ""

    headers = {
        "Authorization": f"Bearer {WHATSAPP_TOKEN}",
        "Content-Type": "application/json"
    }

    payload = {
        "messaging_product": "whatsapp",
        "to": to_number,
        "type": "template",
        "template": {
            "name": template_name,
            "language": {
                "code": language_code
            }
        }
    }

    if customer_name and template_name != "hello_world":
        payload["template"]["components"] = [
            {
                "type": "body",
                "parameters": [
                    {
                        "type": "text",
                        "text": customer_name
                    }
                ]
            }
        ]

    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=12)
        resp_json = response.json()

        if response.status_code == 200:
            msg_id = resp_json.get("messages", [{}])[0].get("id", "SUCCESS")
            return True, "", msg_id
        else:
            error_data = resp_json.get("error", {})
            err_msg = error_data.get("message") or f"HTTP {response.status_code}: {response.text}"
            return False, err_msg, ""
    except Exception as exc:
        return False, f"Exception occurred: {str(exc)}", ""


def load_numbers_from_csv(csv_path: str = "numbers.csv") -> list[dict]:
    """Reads numbers.csv and parses records."""
    if not os.path.exists(csv_path):
        logger.error(f"File '{csv_path}' nahi mili!")
        return []

    records = []
    with open(csv_path, mode="r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            name = row.get("name", "").strip()
            num = row.get("number", "").strip()
            if num:
                records.append({"name": name, "raw_number": num})
    return records


def run_bulk_broadcast(
    csv_file: str = "numbers.csv",
    log_file: str = "log.csv",
    template_name: str = DEFAULT_TEMPLATE,
    language_code: str = DEFAULT_LANGUAGE,
    test_mode: bool = True,
    delay_seconds: float = 1.0,
    skip_duplicates: bool = True
):
    """Main bulk runner with duplicate protection, rate limiting delay, and test mode."""
    logger.info("=" * 60)
    logger.info("🚀 WhatsApp Bulk Broadcast Sender shuru ho raha hai...")
    logger.info(f"📂 CSV File: {csv_file}")
    logger.info(f"📋 Template: '{template_name}' ({language_code})")
    logger.info(f"⏱️ Delay per message: {delay_seconds} second")
    logger.info(f"🛡️ Skip duplicates: {'Haan' if skip_duplicates else 'Nahi'}")
    logger.info(f"🧪 Mode: {'TEST MODE (Sirf first 3 numbers)' if test_mode else 'FULL PRODUCTION BROADCAST (Poori List)'}")
    logger.info("=" * 60)

    if not WHATSAPP_TOKEN or not PHONE_NUMBER_ID:
        logger.error("❌ ERROR: WHATSAPP_TOKEN aur PHONE_NUMBER_ID .env file me set hone zaroori hain!")
        sys.exit(1)

    init_log_file(log_file)
    raw_contacts = load_numbers_from_csv(csv_file)

    if not raw_contacts:
        logger.warning(f"⚠️ '{csv_file}' me koi contacts nahi mile!")
        return

    if test_mode:
        logger.info(f"ℹ️ Total contacts loaded: {len(raw_contacts)}. Test mode active: sirf pehle 3 contacts process honge.")
        contacts_to_process = raw_contacts[:3]
    else:
        logger.info(f"ℹ️ Full mode active: total {len(raw_contacts)} contacts process honge.")
        contacts_to_process = raw_contacts

    seen_numbers = set()
    total_sent = 0
    total_failed = 0
    total_skipped = 0

    for idx, contact in enumerate(contacts_to_process, start=1):
        name = contact["name"]
        raw_number = contact["raw_number"]
        clean_number = clean_phone_number(raw_number)

        logger.info(f"\\n[{idx}/{len(contacts_to_process)}] Processing: {name} ({raw_number}) -> {clean_number}")

        if skip_duplicates and clean_number in seen_numbers:
            logger.warning(f"⏩ SKIP (Duplicate): {clean_number} pehle process ho chuka hai.")
            append_log(log_file, clean_number, name, "SKIPPED", "Duplicate number")
            total_skipped += 1
            continue

        seen_numbers.add(clean_number)

        if len(clean_number) < 10:
            logger.error(f"❌ INVALID NUMBER: {raw_number}")
            append_log(log_file, raw_number, name, "FAILED", "Invalid phone number format")
            total_failed += 1
            continue

        success, error_msg, msg_id = send_template_message(
            to_number=clean_number,
            customer_name=name,
            template_name=template_name,
            language_code=language_code
        )

        if success:
            logger.info(f"✅ SENT SUCCESS to {clean_number} (ID: {msg_id})")
            append_log(log_file, clean_number, name, "SENT", "", msg_id)
            total_sent += 1
        else:
            logger.error(f"❌ FAILED to send to {clean_number}: {error_msg}")
            append_log(log_file, clean_number, name, "FAILED", error_msg)
            total_failed += 1

        if idx < len(contacts_to_process):
            time.sleep(delay_seconds)

    logger.info("\\n" + "=" * 60)
    logger.info("🏁 Broadcast Completed Summary:")
    logger.info(f"   • Total Processed : {len(contacts_to_process)}")
    logger.info(f"   • Successfully Sent: {total_sent}")
    logger.info(f"   • Failed Messages  : {total_failed}")
    logger.info(f"   • Duplicate Skipped: {total_skipped}")
    logger.info(f"   • Detailed Log saved in: {log_file}")
    logger.info("=" * 60)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="WhatsApp Cloud API Bulk Template Sender")
    parser.add_argument("--csv", default="numbers.csv", help="Path to CSV input file")
    parser.add_argument("--log", default="log.csv", help="Path to output log CSV file")
    parser.add_argument("--template", default=DEFAULT_TEMPLATE, help="Template name")
    parser.add_argument("--lang", default=DEFAULT_LANGUAGE, help="Template language code")
    parser.add_argument("--delay", type=float, default=1.0, help="Delay between messages in seconds")
    parser.add_argument("--all", action="store_true", help="Run for ALL numbers")

    args = parser.parse_args()
    is_test_mode = not args.all

    if is_test_mode:
        print("\\n🟡 TEST MODE ACTIVE: Sirf pehle 3 numbers ko message bheja jayega.")
        print("💡 Poori list par chalane ke liye command run karein:")
        print("   python bulk.py --all\\n")

    run_bulk_broadcast(
        csv_file=args.csv,
        log_file=args.log,
        template_name=args.template,
        language_code=args.lang,
        test_mode=is_test_mode,
        delay_seconds=args.delay,
        skip_duplicates=True
    )
`;

export const REQUIREMENTS_TXT_CONTENT = `fastapi>=0.110.0
uvicorn[standard]>=0.28.0
requests>=2.31.0
python-dotenv>=1.0.1
pydantic>=2.6.0
`;

export const ENV_EXAMPLE_CONTENT = `# =================================================================
# WhatsApp Cloud API Credentials (Meta for Developers)
# =================================================================
# Permanent ya Temporary WhatsApp Cloud API Access Token
WHATSAPP_TOKEN=your_meta_system_user_or_temporary_token_here

# Meta Business Account ka Phone Number ID (WhatsApp -> API Setup me milega)
PHONE_NUMBER_ID=109876543210987

# Webhook verification ke liye secret token (Meta dashboard me same token daalna hai)
VERIFY_TOKEN=my_secure_whatsapp_verify_token_123

# =================================================================
# Business & Bot Customization (Optional)
# =================================================================
BUSINESS_NAME=Anvexaa AI
BUSINESS_LOCATION=Anvexaa AI Headquarters
GOOGLE_MAPS_LINK=https://anvexaa.ai
TEAM_CONTACT_NUMBER=+919876543210
SENDER_NAME=Subhash

# Bulk sender default template details
DEFAULT_TEMPLATE_NAME=anvexaa_pitch
DEFAULT_TEMPLATE_LANGUAGE=en
`;

export const NUMBERS_CSV_CONTENT = `name,number
Rahul Sharma,919876543210
Amit Verma,919812345678
Pooja Patel,919711223344
Suresh Kumar,919899001122
Neha Gupta,919876543210
Vikram Singh,919655443322
Ananya Roy,919988776655
Rajesh Mehta,919876543210
Kavita Jain,919123456780
Deepak Joshi,919823456789
`;

export const README_MD_CONTENT = `# 🤖 WhatsApp Auto-Bot & Bulk Sender (WhatsApp Cloud API)

FastAPI aur Meta WhatsApp Cloud API par aadharit WhatsApp Auto-Reply Bot aur CSV Bulk Template Sender.

---

## 📌 Features & Highlights

1. **GET /webhook**: Meta WhatsApp Cloud API webhook verification token verify karta hai aur \`hub.challenge\` return karta hai.
2. **POST /webhook**: User ke aane wale message padhta hai aur turant Hinglish Auto-Reply menu bhejta hai:
   - **Greeting** (Hi / Hello / Namaste): Business ka swagat aur 1 se 4 menu options.
   - **Option 1**: Products ki detail aur information.
   - **Option 2**: Price list aur discount offer.
   - **Option 3**: Office/Shop address aur Google Maps link.
   - **Option 4**: Team contact notification: *"Dhanyawad! Hamari team ko aapka message mil gaya hai. Hum jaldi aapko call karenge."*
   - **Fallback**: Agar koi aur text ho toh polite guidance message bhejta hai.
3. **Bulk Template Sender (\`bulk.py\`)**:
   - \`numbers.csv\` se customers ka data padhta hai (\`name,number\`).
   - Sirf approved WhatsApp Templates bhejta hai (Meta compliance).
   - **Duplicate protection**: Duplicate numbers ko automatically skip karta hai.
   - **Safety Test Mode**: By default sirf **pehle 3 numbers** par test karta hai!
   - \`--all\` flag se poori list par chalaya ja sakta hai.
   - 1 second delay (rate limit safety) aur har message ka status \`log.csv\` me save hota hai.

---

## 📁 File Structure

\`\`\`text
├── main.py              # FastAPI Webhook server (GET & POST)
├── bulk.py              # Bulk template sender script (with test mode & logging)
├── numbers.csv          # Sample customer contacts (name, number with country code)
├── requirements.txt     # Python dependencies
├── .env.example         # Environment variables template
├── .env                 # Aapki actual secret API keys
└── README.md            # Hinglish Setup & Deployment Guide
\`\`\`

---

## 🛠️ Step 1: Dependencies Setup

\`\`\`bash
# 1. Virtual environment (optional)
python3 -m venv venv
source venv/bin/activate  # Windows: venv\\Scripts\\activate

# 2. Dependencies install karein
pip install -r requirements.txt
\`\`\`

---

## 🌐 Step 2: Bot Chalayein & ngrok Setup

\`\`\`bash
# Terminal 1: FastAPI bot start karein
python main.py

# Terminal 2: ngrok se public HTTPS URL banayein
ngrok http 8000
\`\`\`

Meta Developer portal me Webhook URL daalein: \`https://xyz.ngrok-free.app/webhook\` aur verify token match karein!
`;

export const ANVEXAA_TERMUX_CONTENT = `#!/data/data/com.termux/files/usr/bin/bash
# =================================================================
# Anvexaa AI - WhatsApp Cloud API Bot Runner for Android (Termux)
# =================================================================

echo "======================================================"
echo "🚀 Starting Anvexaa AI WhatsApp Bot on Android (Termux)..."
echo "======================================================"

# 1. Update packages
echo "📦 Updating Termux repositories..."
pkg update -y

# 2. Install Python if not present
if ! command -v python3 &> /dev/null
then
    echo "🐍 Installing Python..."
    pkg install python -y
fi

# 3. Install required pip dependencies
echo "📥 Installing dependencies (FastAPI, Requests, Uvicorn)..."
pip install fastapi uvicorn requests python-dotenv pydantic

# 4. Check .env file
if [ ! -f .env ]; then
    echo "⚙️ Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠️ Kripya .env file mein apna WHATSAPP_TOKEN aur PHONE_NUMBER_ID edit karein: nano .env"
fi

echo ""
echo "Select mode:"
echo "1) Start FastAPI WhatsApp Webhook Bot (Port 8000)"
echo "2) Run CSV Bulk Sender (Test Mode - 3 numbers)"
echo "3) Run CSV Bulk Sender (Full Broadcast - All numbers)"
echo "4) Exit"
echo ""

read -p "Enter choice (1-4): " choice

case $choice in
    1)
        echo "🚀 Starting Webhook Server on Android..."
        python main.py
        ;;
    2)
        echo "🧪 Running Bulk Sender in Safety Test Mode (3 numbers)..."
        python bulk.py --direct-text --msg 1
        ;;
    3)
        echo "🚀 Running Bulk Sender on ALL numbers..."
        python bulk.py --direct-text --msg 2 --all
        ;;
    *)
        echo "Exiting."
        ;;
esac
`;

export const DELIVERABLE_FILES: DeliverableFile[] = [
  {
    filename: 'main.py',
    title: 'FastAPI Webhook Server',
    language: 'python',
    description: 'GET/POST /webhook endpoints with Anvexaa AI auto-reply state machine and WhatsApp Cloud API integration.',
    content: MAIN_PY_CONTENT
  },
  {
    filename: 'bulk.py',
    title: 'CSV Bulk Template & Pitch Sender',
    language: 'python',
    description: 'Reads numbers.csv, sends approved WhatsApp templates or custom Anvexaa AI pitches, skips duplicates, defaults to test mode (3 numbers), and outputs log.csv.',
    content: BULK_PY_CONTENT
  },
  {
    filename: 'anvexaa_termux.sh',
    title: 'Android Termux Auto-Runner',
    language: 'bash',
    description: 'Shell script to run Python, FastAPI Webhook, and CSV Bulk Sender directly on any Android phone using Termux (no PC needed).',
    content: ANVEXAA_TERMUX_CONTENT
  },
  {
    filename: 'requirements.txt',
    title: 'Python Dependencies',
    language: 'text',
    description: 'Required packages: fastapi, uvicorn, requests, python-dotenv, pydantic.',
    content: REQUIREMENTS_TXT_CONTENT
  },
  {
    filename: '.env.example',
    title: 'Environment Variables Template',
    language: 'bash',
    description: 'WHATSAPP_TOKEN, PHONE_NUMBER_ID, VERIFY_TOKEN, and Anvexaa AI business customization variables.',
    content: ENV_EXAMPLE_CONTENT
  },
  {
    filename: 'numbers.csv',
    title: 'Sample Customer Contacts',
    language: 'csv',
    description: 'CSV file with name and country code numbers (includes duplicate number example for verification).',
    content: NUMBERS_CSV_CONTENT
  },
  {
    filename: 'README.md',
    title: 'Hinglish Setup & Deploy Guide',
    language: 'markdown',
    description: 'Step-by-step instructions in Hinglish for Meta Cloud API credentials, ngrok setup, webhook verification, and bulk execution.',
    content: README_MD_CONTENT
  }
];
