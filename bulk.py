"""
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
        f"Hi {c_name}, this is {sender} from Anvexaa AI. We help businesses grow using AI with these services:\n\n"
        "1. AI Automation (WhatsApp auto-reply, bulk messaging, lead handling)\n"
        "2. Professional Website: ₹19,999\n"
        "3. AI Video Content: ₹1,499 per 1 min\n"
        "4. Animation Video: ₹1,499 per 1 min\n"
        "5. Promotional Video (Ads): ₹1,499 per 1 min\n\n"
        f"Let me know which service would work best for your {business_type}. I'd be happy to create a free demo for you 🙂\n\n"
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
    """
    Cleans phone number and ensures country code format (e.g., 919876543210).
    Strips +, -, spaces, parentheses.
    """
    if not raw_num:
        return ""
    cleaned = "".join(ch for ch in str(raw_num) if ch.isdigit())
    # If 10 digits given (Indian mobile), prefix 91
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
                error.replace("\n", " "),
                msg_id
            ])
    except Exception as e:
        logger.error(f"Failed to write to log.csv: {e}")


def send_template_message(to_number: str, customer_name: str, template_name: str, language_code: str) -> tuple[bool, str, str]:
    """
    Sends an approved WhatsApp template message to a single number.
    Returns: (is_success, error_message, message_id)
    """
    if not WHATSAPP_TOKEN or not PHONE_NUMBER_ID:
        return False, "WHATSAPP_TOKEN ya PHONE_NUMBER_ID .env me missing hai", ""

    headers = {
        "Authorization": f"Bearer {WHATSAPP_TOKEN}",
        "Content-Type": "application/json"
    }

    # Meta Cloud API Template Payload
    # If template has variable (e.g. {{1}} = name), components can be included
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

    # If customer name is provided, include as parameter 1 (if template uses {{1}})
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
    skip_duplicates: bool = True,
    use_direct_text: bool = False,
    msg_preset: int = 1,
    sender_name: str = SENDER_NAME,
    business_type: str = "business"
):
    """
    Main bulk runner with duplicate protection, rate limiting delay, and test mode.
    """
    logger.info("=" * 60)
    logger.info("🚀 WhatsApp Bulk Broadcast Sender (Anvexaa AI) shuru ho raha hai...")
    logger.info(f"📂 CSV File: {csv_file}")
    if use_direct_text:
        logger.info(f"💬 Send Mode: DIRECT CUSTOM TEXT (Message {msg_preset})")
    else:
        logger.info(f"📋 Send Mode: META APPROVED TEMPLATE '{template_name}' ({language_code})")
    logger.info(f"⏱️ Delay per message: {delay_seconds} second")
    logger.info(f"🛡️ Skip duplicates: {'Haan' if skip_duplicates else 'Nahi'}")
    logger.info(f"🧪 Mode: {'TEST MODE (Sirf first 3 numbers)' if test_mode else 'FULL PRODUCTION BROADCAST (Poori List)'}")
    logger.info("=" * 60)

    # Validate environment credentials
    if not WHATSAPP_TOKEN or not PHONE_NUMBER_ID:
        logger.error("❌ ERROR: WHATSAPP_TOKEN aur PHONE_NUMBER_ID .env file me set hone zaroori hain!")
        logger.error("Kripya .env file check karein.")
        sys.exit(1)

    init_log_file(log_file)
    raw_contacts = load_numbers_from_csv(csv_file)

    if not raw_contacts:
        logger.warning(f"⚠️ '{csv_file}' me koi contacts nahi mile!")
        return

    # In Test mode, strictly take only first 3 contacts
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

        logger.info(f"\n[{idx}/{len(contacts_to_process)}] Processing: {name} ({raw_number}) -> {clean_number}")

        # Check duplicate
        if skip_duplicates and clean_number in seen_numbers:
            logger.warning(f"⏩ SKIP (Duplicate): {clean_number} pehle process ho chuka hai.")
            append_log(log_file, clean_number, name, "SKIPPED", "Duplicate number")
            total_skipped += 1
            continue

        seen_numbers.add(clean_number)

        # Validate number length
        if len(clean_number) < 10:
            logger.error(f"❌ INVALID NUMBER: {raw_number} (country code ke saath hona chahiye)")
            append_log(log_file, raw_number, name, "FAILED", "Invalid phone number format")
            total_failed += 1
            continue

        # Send either Direct Custom Text or Approved Template
        if use_direct_text:
            if msg_preset == 2:
                custom_body = get_anvexaa_message_2(name, sender=sender_name, business_type=business_type)
            else:
                custom_body = get_anvexaa_message_1(name, sender=sender_name, business_type=business_type)

            success, error_msg, msg_id = send_direct_text_message(clean_number, custom_body)
        else:
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

        # Delay to avoid Meta rate limits (1 sec default)
        if idx < len(contacts_to_process):
            time.sleep(delay_seconds)

    logger.info("\n" + "=" * 60)
    logger.info("🏁 Broadcast Completed Summary:")
    logger.info(f"   • Total Processed : {len(contacts_to_process)}")
    logger.info(f"   • Successfully Sent: {total_sent}")
    logger.info(f"   • Failed Messages  : {total_failed}")
    logger.info(f"   • Duplicate Skipped: {total_skipped}")
    logger.info(f"   • Detailed Log saved in: {log_file}")
    logger.info("=" * 60)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="WhatsApp Cloud API Bulk Template Sender - Anvexaa AI")
    parser.add_argument("--csv", default="numbers.csv", help="Path to CSV input file (default: numbers.csv)")
    parser.add_argument("--log", default="log.csv", help="Path to output log CSV file (default: log.csv)")
    parser.add_argument("--template", default=DEFAULT_TEMPLATE, help=f"Template name (default: {DEFAULT_TEMPLATE})")
    parser.add_argument("--lang", default=DEFAULT_LANGUAGE, help=f"Template language code (default: {DEFAULT_LANGUAGE})")
    parser.add_argument("--delay", type=float, default=1.0, help="Delay between messages in seconds (default: 1.0)")
    parser.add_argument("--all", action="store_true", help="Run for ALL numbers (disables safety test mode of 3 numbers)")
    parser.add_argument("--direct-text", action="store_true", help="Send custom text message directly without Meta template approval")
    parser.add_argument("--msg", type=int, choices=[1, 2], default=1, help="Custom message preset (1: 2-min intro pitch, 2: Services & Pricing)")
    parser.add_argument("--sender", default=SENDER_NAME, help="Your name to show in message (e.g. Subhash)")
    parser.add_argument("--business", default="business", help="Target business type (e.g. restaurant, clinic, agency)")

    args = parser.parse_args()

    # Rule: Default to test mode (3 numbers only) unless explicitly passed --all
    is_test_mode = not args.all

    if is_test_mode:
        print("\n🟡 TEST MODE ACTIVE: Sirf pehle 3 numbers ko message bheja jayega.")
        print("💡 Poori list par chalane ke liye command run karein:")
        print("   python bulk.py --all\n")

    run_bulk_broadcast(
        csv_file=args.csv,
        log_file=args.log,
        template_name=args.template,
        language_code=args.lang,
        test_mode=is_test_mode,
        delay_seconds=args.delay,
        skip_duplicates=True,
        use_direct_text=args.direct_text,
        msg_preset=args.msg,
        sender_name=args.sender,
        business_type=args.business
    )
