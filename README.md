# 🤖 WhatsApp Auto-Bot & Bulk Sender (WhatsApp Cloud API)

FastAPI aur Meta WhatsApp Cloud API par aadharit WhatsApp Auto-Reply Bot aur CSV Bulk Template Sender.

---

## 📌 Features & Highlights

1. **GET /webhook**: Meta WhatsApp Cloud API webhook verification token verify karta hai aur `hub.challenge` return karta hai.
2. **POST /webhook**: User ke aane wale message padhta hai aur turant Hinglish Auto-Reply menu bhejta hai:
   - **Greeting** (Hi / Hello / Namaste): Business ka swagat aur 1 se 4 menu options.
   - **Option 1**: Products ki detail aur information.
   - **Option 2**: Price list aur discount offer.
   - **Option 3**: Office/Shop address aur Google Maps link.
   - **Option 4**: Team contact notification: *"Dhanyawad! Hamari team ko aapka message mil gaya hai. Hum jaldi aapko call karenge."*
   - **Fallback**: Agar koi aur text ho toh polite guidance message bhejta hai.
3. **Bulk Template Sender (`bulk.py`)**:
   - `numbers.csv` se customers ka data padhta hai (`name,number`).
   - Sirf approved WhatsApp Templates bhejta hai (Meta compliance).
   - **Duplicate protection**: Duplicate numbers ko automatically skip karta hai.
   - **Safety Test Mode**: By default sirf **pehle 3 numbers** par test karta hai, taaki testing me galti na ho!
   - `--all` flag se poori list par chalaya ja sakta hai.
   - 1 second delay (rate limit safety) aur har message ka status `log.csv` me save hota hai.
   - Script crash nahi hoti agar kisi number me error aaye.

---

## 📁 File Structure

```text
├── main.py              # FastAPI Webhook server (GET & POST)
├── bulk.py              # Bulk template sender script (with test mode & logging)
├── numbers.csv          # Sample customer contacts (name, number with country code)
├── requirements.txt     # Python dependencies (fastapi, uvicorn, requests, python-dotenv)
├── .env.example         # Environment variables template
├── .env                 # Aapki actual secret API keys (Git me commit na karein)
├── log.csv              # Bulk sender output report (automatic banti hai)
└── README.md            # Hinglish Setup & Deployment Guide
```

---

## 🛠️ Step 1: Python Environment & Dependencies Setup

Apne computer ya terminal me project folder kholein:

```bash
# 1. Virtual environment banayein (Optional par recommended)
python3 -m venv venv

# Virtual environment activate karein:
# Windows:
venv\Scripts\activate
# Mac / Linux:
source venv/bin/activate

# 2. Dependencies install karein
pip install -r requirements.txt
```

---

## 🔑 Step 2: Meta Developer Account & WhatsApp API Keys Hasil Karein

1. [Meta for Developers](https://developers.facebook.com/) par jayein aur login karein.
2. **My Apps** > **Create App** par click karein.
3. App type me **Other** > **Business** select karein.
4. App dashboard me **WhatsApp** product ko **Set up** karein.
5. Left menu me **WhatsApp** > **API Setup** par click karein:
   - Yahan aapko **Temporary access token** dikhega (isko copy karein).
   - **Phone number ID** dikhega (jaise `109876543210987`).
6. Apna test phone number add karein jahan aap WhatsApp message receive karna chahte hain.

---

## ⚙️ Step 3: `.env` File Configure Karein

Ek nayi file banayein jiska naam `.env` rakhein (`.env.example` ko copy karke rename kar sakte hain):

```env
# Meta WhatsApp Cloud API Credentials
WHATSAPP_TOKEN=EAAxxxxxxx...aapka_meta_token...
PHONE_NUMBER_ID=109876543210987
VERIFY_TOKEN=my_secure_secret_token_123

# Business Info (Optional)
BUSINESS_NAME=Shree Ram Traders
BUSINESS_LOCATION=Shop No. 12, Main Market, MG Road, New Delhi
GOOGLE_MAPS_LINK=https://maps.google.com/?q=28.6139,77.2090
TEAM_CONTACT_NUMBER=+919876543210

# Bulk Sender Template Config
DEFAULT_TEMPLATE_NAME=hello_world
DEFAULT_TEMPLATE_LANGUAGE=en_US
```

> ⚠️ **Dhyan dein:** `VERIFY_TOKEN` aap khud koi bhi custom password/string rakh sakte hain (jaise `my_secure_secret_token_123`). Meta dashboard me bhi yehi same token daalna hoga!

---

## 🌐 Step 4: Webhook Server Start & ngrok Se Public URL Banayein

Meta WhatsApp servers aapke local computer (`localhost:8000`) se directly baat nahi kar sakte, isliye **ngrok** ka use karte hain:

### Terminal 1: FastAPI Bot Chalayein

```bash
python main.py
```
Aapka bot `http://0.0.0.0:8000` par start ho jayega.

### Terminal 2: ngrok Tunnel Banayein

```bash
# Agar ngrok install nahi hai: https://ngrok.com/download
ngrok http 8000
```

ngrok aapko ek **HTTPS URL** dega, jaise:
`https://abc1-234-56-78.ngrok-free.app`

---

## 🔗 Step 5: Meta Dashboard Par Webhook Configure Karein

1. Meta Developers Portal me jayein: **WhatsApp** > **Configuration**.
2. **Webhook** section me **Edit** par click karein:
   - **Callback URL**: `https://abc1-234-56-78.ngrok-free.app/webhook` (ngrok URL ke aage `/webhook` lagayein)
   - **Verify Token**: Jo aapne `.env` file me `VERIFY_TOKEN` rakha tha (jaise `my_secure_secret_token_123`).
3. **Verify and save** par click karein.
   - Meta `GET /webhook` request bhejega aur `hub.challenge` verify karke green check dikhayega!
4. **Webhook fields** section me **Manage** par click karein:
   - `messages` field ko **Subscribe** karein.

Ab aapka WhatsApp Auto-Reply Bot bilkul LIVE hai! 🎉

---

## 📱 Step 6: Auto-Reply Bot Test Karein

Apne WhatsApp se business number par message bhej kar dekhein:

| User ka Message | Bot ka Reply (Hinglish) |
|---|---|
| `Hi` ya `Namaste` | Business Greeting + 1 se 4 ka Menu |
| `1` | Products ki detailed list |
| `2` | Price list aur discount details |
| `3` | Shop address aur Google Maps link |
| `4` | Support callback confirmation message |
| `Koi random baat` | Fallback: *"Samajh nahi aaya, kripya 1 se 4 mein se number bhejein"* |

---

## 📤 Step 7: Bulk Template Messages Bhejna (`bulk.py`)

WhatsApp Cloud API par bina opt-in direct text bhejne par number ban ho sakta hai. Isliye Meta **Approved Templates** allow karta hai.

### 1. `numbers.csv` Tayyar Karein
Format:
```csv
name,number
Rahul Sharma,919876543210
Amit Verma,919812345678
Pooja Patel,919711223344
Suresh Kumar,919899001122
```
*(Country code zaroor lagayein, India ke liye `91` bina `+` ke).*

### 2. Pehle Safety Test Mode Me Chalayein (Sirf Pehle 3 Numbers):
```bash
python bulk.py
```
Ye command sirf pehle 3 numbers par message bhejegi taaki aap result aur format check kar sakein!

### 3. Poori List Par Chalane Ke Liye:
```bash
python bulk.py --all
```

### 4. Custom Template ya Delay ke Saath Chalana:
```bash
python bulk.py --all --template your_approved_template --lang hi --delay 1.5
```

### 5. Send Report Check Karein:
Har message ka result `log.csv` me save ho jata hai:
```csv
timestamp,number,name,status,error,message_id
2026-09-24 10:15:30,919876543210,Rahul Sharma,SENT,,wamid.HBg...
2026-09-24 10:15:31,919876543210,Rahul Sharma,SKIPPED,Duplicate number,
2026-09-24 10:15:32,919812345678,Amit Verma,SENT,,wamid.HBg...
```

---

## 🛡️ Best Practices & Rules

1. **Never Hardcode Secrets**: Tokens hamesha `.env` me rakhein.
2. **Opt-in Customers Only**: Sirf unhi logon ko message bhejein jinhone aapse baat ki ho ya opt-in diya ho.
3. **Permanent Token**: Testing token 24 ghante me expire hota hai. Production ke liye Meta Business Settings me **System User** banakar permanent token generate karein.
4. **Duplicate Protection**: `bulk.py` me duplicate phone number check pehle se enabled hai taaki kisi customer ko do baar message na jaye.
5. **Rate Limiting**: Meta standard tier me 80 messages/second tak allow karta hai, par 1 second delay safe rehta hai.
